from datetime import datetime
from operator import attrgetter
from itertools import zip_longest

from django.contrib.auth import get_user_model

from progress_analyzer.helpers.helper_classes import ProgressReport
from leaderboard.models import Score as s

class RankedScore(object):
	def __init__(self,user,score,category,rank=None):
		self.user = user
		self._score = score
		self._category = category
		self._rank = rank

	@property		
	def category(self):
		return self._category

	@category.setter
	def category(self,category):
		category_choices = [c[0] for c in s.CATEGORY_CHOICES]
		if category.lower() in category_choices:
			self._category = category
		else:
			raise ValueError("'{}' is not a valid category".format(category))

	@property
	def rank(self):
		return self._rank

	@rank.setter
	def rank(self,rank):
		if ((not rank < 1 and type(rank) is int) or rank is None):
			self._rank = rank
		else:
			raise ValueError("'{}' is not a valid rank. Rank should be integer and non zero".format(rank))

	def as_dict(self):
		verbose_category = {c[0]:c[1] for c in s.CATEGORY_CHOICES}
		d = {
			'username':self.user.username,
			'score':self._score,
			'category':verbose_category[self._category],
			'rank':self._rank
		}
		return d			

class Leaderboard(object):
	def __init__(self,scores,score_priority='lowest_last'):
		self.priorities = ["lowest_last","lowest_first"]
		self.scores = scores
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

	def rank_scores(self):
		if self._score_priority == 'lowest_first':
			to_reverse = False
		elif self._score_priority == 'lowest_last':
			to_reverse = True

		ranked_scores = []
		rank_to_award = 1
		previous_score = None
		sorted_scores = sorted(self.scores,key=attrgetter('_score'),reverse=to_reverse)
		for i,score in enumerate(sorted_scores):
			if previous_score and (previous_score != score._score):
				rank_to_award = i+1
			score.rank = rank_to_award
			ranked_scores.append(score)
			previous_score = score._score
		return ranked_scores

	def get_leaderboard(self,format = 'dict'):
		if format == 'dict':
			lb = [x.as_dict() for x in self.ranked_scores]
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
		if not self.current_date:
			self.duration_type = []

		self.categories.pop('awake_time')
		self.categories.pop('deep_sleep')


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
			data = ProgressReport(user,query_params).get_progress_report()['summary']
			for catg in category_wise_data.keys():
				for dtype in self.duration_type:
					if catg == 'oh_gpa':
						score = data['overall_health']['overall_health_gpa'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'mne_gpa':
						score = data['non_exercise']['non_exericse_steps_gpa'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'mc':
						score = data['mc']['movement_consistency_gpa'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'avg_sleep':
						score = data['sleep']['overall_sleep_gpa'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'ec':
						score = data['ec']['avg_no_of_days_exercises_per_week'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'prcnt_uf':
						score = data['nutrition']['prcnt_unprocessed_food_gpa'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'alcohol_drink':
						score = data['alcohol']['alcoholic_drinks_per_week_gpa'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'total_steps':
						score = data['non_exercise']['total_steps'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'floor_climbed':
						score = data['other']['floors_climbed'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					elif catg == 'resting_hr':
						score = data['other']['resting_hr'][dtype]
						score = score if score else 0
						category_wise_data[catg][dtype].append(RankedScore(user,score,catg))
					# if catg == 'deep_sleep':
					# 	pass
					# if catg == 'awake_time':
					# 	pass

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
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'mne_gpa':
							score = data['non_exercise']['non_exericse_steps_gpa']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'mc':
							score = data['mc']['movement_consistency_gpa']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'avg_sleep':
							score = data['sleep']['overall_sleep_gpa']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'ec':
							score = data['ec']['avg_no_of_days_exercises_per_week']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'prcnt_uf':
							score = data['nutrition']['prcnt_unprocessed_food_gpa']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'alcohol_drink':
							score = data['alcohol']['alcoholic_drinks_per_week_gpa']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'total_steps':
							score = data['non_exercise']['total_steps']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'floor_climbed':
							score = data['other']['floors_climbed']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						elif catg == 'resting_hr':
							score = data['other']['resting_hr']['custom_range'][str_range]['data']
							score = score if score else 0
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(user,score,catg))
						# if catg == 'deep_sleep':
						# 	pass
						# if catg == 'awake_time':
						# 	pass
		# import pprint 
		# pprint.pprint(category_wise_data)
		return category_wise_data

	def _get_category_leaderboard(self,category,format):
		duration_lb = {}
		for dtype in self.duration_type:
			duration_lb[dtype] = Leaderboard(
				self.category_wise_data[category][dtype]
			).get_leaderboard(format=format)

		if self.custom_ranges:
			custom_range_lb = {}
			for r in self.custom_ranges:
				str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
				custom_range_lb[str_range] = Leaderboard(
					self.category_wise_data[category]['custom_range'][str_range]
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

		return lb					