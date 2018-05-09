from datetime import datetime
from operator import attrgetter
from itertools import zip_longest
from functools import cmp_to_key

from django.contrib.auth import get_user_model

from progress_analyzer.helpers.helper_classes import ProgressReport
from leaderboard.helpers.leaderboard_helper import (
	_get_lst,
	_str_to_hours_min_sec,
	_hours_to_hours_min
)
from leaderboard.models import Score as s

class RankedScore(object):
	DEFAULT_MAXIMUM_SCORE = 999999
	DEFAULT_MINIMUM_SCORE = -999999
	DEFAULT_SLEEP_DURATION = '0:00'

	CATEGORY_DEFAULT_SCORE = {
		'oh_gpa':DEFAULT_MINIMUM_SCORE,
		'nes':DEFAULT_MINIMUM_SCORE,
		'mc':DEFAULT_MAXIMUM_SCORE,
		'avg_sleep':DEFAULT_MINIMUM_SCORE,
		'ec':DEFAULT_MINIMUM_SCORE,
		'prcnt_uf':DEFAULT_MINIMUM_SCORE,
		'alcohol':DEFAULT_MAXIMUM_SCORE,
		'total_steps':DEFAULT_MINIMUM_SCORE,
		'floor_climbed':DEFAULT_MINIMUM_SCORE,
		'resting_hr':DEFAULT_MAXIMUM_SCORE,
		'deep_sleep':DEFAULT_MINIMUM_SCORE,
		'awake_time':DEFAULT_MAXIMUM_SCORE
	}

	CATEGORY_SCORE_VNAME = {
		'oh_gpa':'Overall Health GPA',
		'nes':'Non Exercise Steps',
		'mc':'Movement Consistency Score',
		'avg_sleep':'Sleep GPA',
		'ec':'Avg # of Days Exercised/Week',
		'prcnt_uf':'% Unprocessed Food',
		'alcohol':'Average Drinks Per Week (7 Days)',
		'total_steps':'Total Steps',
		'floor_climbed':'Floors Climbed',
		'resting_hr':'Resting Heart Rate (RHR)',
		'deep_sleep':'Deep Sleep Duration (hh:mm)',
		'awake_time':'Awake Time Duration (hh:mm)'
	}

	def __init__(self,current_user,user,category,score,
			rank=None,other_scores=None):
		self.current_user = current_user
		self.user = user
		self.category = category
		self.score = score
		self.rank = rank
		self.other_scores = other_scores

	@property		
	def category(self):
		return self.__category

	@category.setter
	def category(self,category):
		category_choices = [c[0] for c in s.CATEGORY_CHOICES]
		if category.lower() in category_choices:
			self.__category = category
		else:
			raise ValueError("'{}' is not a valid category".format(category))

	@property
	def score(self):
		return self.__score

	@score.setter
	def score(self,score):
		if score == None or score in ['Not Reported','Not Provided']:
			self.__score = self.CATEGORY_DEFAULT_SCORE[self.category]
		else:
			self.__score = score

	@property
	def other_scores(self):
		return self.__other_scores

	@other_scores.setter
	def other_scores(self,other_scores):
		if other_scores:
			for score,data in other_scores.items():
				if data['value'] == None:
					other_scores[score]['value'] = self.DEFAULT_SLEEP_DURATION
		self.__other_scores = other_scores

	@property
	def rank(self):
		return self.__rank

	@rank.setter
	def rank(self,rank):
		if (rank is None or (not rank < 1 and type(rank) is int)):
			self.__rank = rank
		else:
			raise ValueError("'{}' is not a valid rank. Rank should be positive integer and non zero".format(rank))

	def as_dict(self):
		verbose_category = {c[0]:c[1] for c in s.CATEGORY_CHOICES}
		score = self.score
		if score == self.DEFAULT_MAXIMUM_SCORE or score == self.DEFAULT_MINIMUM_SCORE:
			score = "N/A"
		elif self.category in ["awake_time","deep_sleep"]:
			score = _hours_to_hours_min(score)

		other_scores = self.other_scores
		if other_scores:
			for score_key,data in self.other_scores.items():
				if data['value'] == self.DEFAULT_SLEEP_DURATION:
					other_scores[score_key]['value'] = 'N/A'

		if self.user == self.current_user or self.current_user.is_staff:
			#if user is staff user, show username
			username = self.user.username
		else:
			username = "Anonymous",

		d = {
			'username':username,
			'score':{
				'value':score,
				'verbose_name':self.CATEGORY_SCORE_VNAME[self.category]
			},
			'other_scores':other_scores,
			'category':verbose_category[self.category],
			'rank':self.rank
		}
		return d

class Leaderboard(object):
	def __init__(self,user,scores,category,score_priority='lowest_last'):
		self.user = user
		self.priorities = ["lowest_last","lowest_first"]
		self.scores = scores
		self.category = category
		self._score_priority = score_priority
		self.ranked_scores = self.rank_scores()

	@property
	def score_priority(self):
		return self._score_priority

	@score_priority.setter
	def score_priority(self,priority):
		if priority in self.priorities:
			self._score_priority = priority
		else:
			raise ValueError("'{}' is not a valid score priority".format(priority))

	def sleep_rank_comparator(self,x,y):
		if(x.score > y.score):
			return 1
		elif(x.score == y.score):
			if (_str_to_hours_min_sec(x.other_scores['sleep_duration']['value']) > 
				_str_to_hours_min_sec(y.other_scores['sleep_duration']['value'])):
				return 1
			elif(_str_to_hours_min_sec(x.other_scores['sleep_duration']['value']) ==
				 _str_to_hours_min_sec(y.other_scores['sleep_duration']['value'])):
				return 0
			else:
				return -1
		else:
			return -1

	def rank_sleep(self,to_reverse):
		ranked_scores = []
		rank_to_award = 1
		previous_sleep_gpa = None
		previous_sleep_duration = None
		sorted_scores = sorted(
			self.scores, 
			key = cmp_to_key(self.sleep_rank_comparator),
			reverse=to_reverse
		)
		for i,score in enumerate(sorted_scores):
			if (previous_sleep_gpa is not None and previous_sleep_gpa == score.score):
				if(previous_sleep_duration is not None 
					and previous_sleep_duration != _str_to_hours_min_sec(
						score.other_scores['sleep_duration']['value'])
					):
					rank_to_award = i+1
			elif (previous_sleep_gpa is not None and previous_sleep_gpa != score.score):
				rank_to_award = i+1 

			score.rank = rank_to_award
			ranked_scores.append(score)
			previous_sleep_gpa = score.score
			previous_sleep_duration = _str_to_hours_min_sec(
				score.other_scores['sleep_duration']['value']
			)
		return ranked_scores

	def rank_scores(self):
		if self._score_priority == 'lowest_first':
			to_reverse = False
		elif self._score_priority == 'lowest_last':
			to_reverse = True

		if self.category == 'avg_sleep':
			return self.rank_sleep(to_reverse)
		else:
			ranked_scores = []
			rank_to_award = 1
			previous_score = None
			sorted_scores = sorted(self.scores,key=attrgetter('score'),reverse=to_reverse)
			for i,score in enumerate(sorted_scores):
				if previous_score is not None and (previous_score != score.score):
					rank_to_award = i+1
				score.rank = rank_to_award
				ranked_scores.append(score)
				previous_score = score.score
			return ranked_scores

	def get_leaderboard(self,format = 'dict'):
		lb = {
			"user_rank":None,
			"all_rank":None
		}
		if format == 'dict':
			user_rank = None
			dict_scores = []
			for score in self.ranked_scores:
				if score.user == self.user:
					user_rank = score.as_dict()
				dict_scores.append(score.as_dict())
			lb['user_rank'] = user_rank
			lb['all_rank'] = dict_scores
			return lb
		else:
			return self.ranked_scores

class LeaderboardOverview(object):
	def __init__(self,user,query_params):
		self.user = user
		self.current_date = self._str_to_dt(query_params.get('date',None))
		self.categories = {x[0]:x[1] for x in s.CATEGORY_CHOICES}
		self.duration_type = ['today','yesterday','week','month','year']
		self.custom_ranges = self._get_custom_range_info(query_params)
		self.catg_score_priority = self._get_catg_score_priority()
		self.duration_date = None

		if not self.current_date:
			self.duration_type = []

		categories = query_params.get('category',None)
		if categories:
			categories = [item.strip() for item in categories.strip().split(',')]
			allowed = set(categories)
			existing = set(self.categories.keys())
			for item in existing-allowed:
				self.categories.pop(item)

		duration = query_params.get('duration',None)
		if duration and self.current_date:
			duration = [item.strip() for item in duration.strip().split(',')]
			allowed = set(duration)
			existing = set(self.duration_type)
			for d in existing-allowed:
				self.duration_type.pop(self.duration_type.index(d))

		self.category_wise_data = self._get_category_wise_data(query_params)

	def _str_to_dt(self,dt_str):
		if dt_str:
			return datetime.strptime(dt_str, "%Y-%m-%d")
		else:
			return None

	def grouped(self,iterable,n,fillvalue):
		'''
			Return grouped data for any iterable
			"s -> (s0,s1,s2,...sn-1), (sn,sn+1,sn+2,...s2n-1), (s2n,s2n+1,s2n+2,...s3n-1), ..."

			Arguments
			- n: type int, number of item in group
			- fillvalue: type obj, If the iterables are of uneven length, missing values
			  are filled-in with fillvalue

			example -
			>>> l = [1,2,3,4,5,6,7]
			>>> list(pairwise(l,2,None))
			>>> [(1,2), (3,4), (5,6), (7,None)]
		'''
		a = iter(iterable)
		return zip_longest(*[a]*n, fillvalue=fillvalue)

	def _get_catg_score_priority(self):
		categories = [x[0] for x in s.CATEGORY_CHOICES]
		catg_score_priority = {}
		lowest_first_categories = ['mc','resting_hr','awake_time','alcohol']
		for category in categories:
			if category in lowest_first_categories:
				catg_score_priority[category] = 'lowest_first'
			else:
				catg_score_priority[category] = 'lowest_last'
		return catg_score_priority

	def _get_custom_range_info(self,query_params):
		custom_ranges = query_params.get('custom_ranges',None)
		if custom_ranges:
			# it'll be list of tuples, where first item of tuple is the start of range
			# and second is end of the range. For example - 
			# [("2018-02-12","2018-02-17"), ("2018-02-01, 2018-02-29"), ...]

			custom_ranges = [(self._str_to_dt(r[0]),self._str_to_dt(r[1]))
				for r in list(self.grouped(custom_ranges.split(","),2,None))
				if r[0] and r[1]]
			return custom_ranges
		return None

	def _get_category_wise_data(self,query_params):
		user_model = get_user_model()
		category_wise_data = {catg:{dtype:[] 
			for dtype in self.duration_type} 
			for catg in self.categories.keys()}

		for user in user_model.objects.all():
			data = ProgressReport(user,query_params).get_progress_report()
			if not self.duration_date:
				self.duration_date = data.get("duration_date")
			data = data['summary']
			for catg in category_wise_data.keys():
				for dtype in self.duration_type:
					if catg == 'oh_gpa':
						score = data['overall_health']['overall_health_gpa'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'nes':
						score = data['non_exercise']['non_exercise_steps'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'mc':
						score = data['mc']['movement_consistency_score'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'avg_sleep':
						score = data['sleep']['overall_sleep_gpa'][dtype]
						other_scores = {
							'sleep_duration':{
								"value":data['sleep']['total_sleep_in_hours_min'][dtype],
								"verbose_name":"Sleep Duration (hh:mm)"
							}
						}
						category_wise_data[catg][dtype].append(
							RankedScore(self.user,user,catg,score,other_scores=other_scores)
						)
					elif catg == 'ec':
						score = data['ec']['avg_no_of_days_exercises_per_week'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'prcnt_uf':
						score = data['nutrition']['prcnt_unprocessed_volume_of_food'][dtype]
						other_scores = {
							"percent_unprocessed_food":{
								"value":data['nutrition']['prcnt_unprocessed_volume_of_food'][dtype],
								"verbose_name":"% Unprocessed Food"
							}
						}
						category_wise_data[catg][dtype].append(
							RankedScore(self.user,user,catg,score,other_scores=other_scores)
						)
					elif catg == 'alcohol':
						score = data['alcohol']['avg_drink_per_week'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'total_steps':
						score = data['non_exercise']['total_steps'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'floor_climbed':
						score = data['other']['floors_climbed'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'resting_hr':
						score = data['other']['resting_hr'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					if catg == 'deep_sleep':
						score = data['sleep']['deep_sleep_in_hours_min'][dtype]
						score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					if catg == 'awake_time':
						score = data['sleep']['awake_duration_in_hours_min'][dtype]
						score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))

				if self.custom_ranges:
					if not category_wise_data[catg].get('custom_range',None):
						category_wise_data[catg]['custom_range'] = {}
						for r in self.custom_ranges: 
							str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
							category_wise_data[catg]['custom_range'][str_range] = []

					for r in self.custom_ranges:
						str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
						if catg == 'oh_gpa':
							score = data['overall_health']['overall_health_gpa']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'nes':
							score = data['non_exercise']['non_exercise_steps']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'mc':
							score = data['mc']['movement_consistency_score']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'avg_sleep':
							score = data['sleep']['overall_sleep_gpa']['custom_range'][str_range]['data']
							other_scores = {
								'sleep_duration':{
									"value":data['sleep']['total_sleep_in_hours_min']['custom_range'][str_range]['data'],
									"verbose_name":"Sleep Duration (hh:mm)"
								}
							}
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score,other_scores=other_scores)
							)
						elif catg == 'ec':
							score = data['ec']['avg_no_of_days_exercises_per_week']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'prcnt_uf':
							score = data['nutrition']['prcnt_unprocessed_volume_of_food']['custom_range'][str_range]['data']
							other_scores = {
								"percent_unprocessed_food":{
									"value":data['nutrition']['prcnt_unprocessed_volume_of_food']['custom_range'][str_range]['data'],
									"verbose_name":"% Unprocessed Food"
								}
							}
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score,other_scores=other_scores)
							)
						elif catg == 'alcohol':
							score = data['alcohol']['avg_drink_per_week']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'total_steps':
							score = data['non_exercise']['total_steps']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'floor_climbed':
							score = data['other']['floors_climbed']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'resting_hr':
							score = data['other']['resting_hr']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						if catg == 'deep_sleep':
							score = data['sleep']['deep_sleep_in_hours_min']['custom_range'][str_range]['data']
							score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						if catg == 'awake_time':
							score = data['sleep']['awake_duration_in_hours_min']['custom_range'][str_range]['data']
							score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
		return category_wise_data

	def _get_category_leaderboard(self,category,format):
		duration_lb = {}
		for dtype in self.duration_type:
			duration_lb[dtype] = Leaderboard(
				self.user,
				self.category_wise_data[category][dtype],
				category,
				self.catg_score_priority[category]
			).get_leaderboard(format=format)

		if self.custom_ranges:
			custom_range_lb = {}
			for r in self.custom_ranges:
				str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
				custom_range_lb[str_range] = Leaderboard(
					self.user,
					self.category_wise_data[category]['custom_range'][str_range],
					category,
					self.catg_score_priority[category]
				).get_leaderboard(format = format)
			duration_lb['custom_range'] = custom_range_lb

		return duration_lb

	def get_leaderboard(self,format='dict',category=None):
		lb = {}
		if not category:
			#full leaderboard
			for catg in self.category_wise_data.keys():
				lb[catg] = self._get_category_leaderboard(catg,format)
		else:
			lb[category] = self._get_category_leaderboard(category,format)
		lb["duration_date"] = self.duration_date

		return lb					