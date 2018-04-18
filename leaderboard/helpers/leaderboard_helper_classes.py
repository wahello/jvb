from datetime import datetime
from operator import attrgetter
from itertools import zip_longest

from django.contrib.auth import get_user_model

from progress_analyzer.helpers.helper_classes import ProgressReport
from leaderboard.models import Score as s

class RankedScore(object):
	DEFAULT_MAXIMUM_SCORE = 999999
	DEFAULT_MINIMUM_SCORE = -999999

	CATEGORY_DEFAULT_SCORE = {
		'oh_gpa':DEFAULT_MINIMUM_SCORE,
		'mne_gpa':DEFAULT_MINIMUM_SCORE,
		'mc':DEFAULT_MAXIMUM_SCORE,
		'avg_sleep':DEFAULT_MINIMUM_SCORE,
		'ec':DEFAULT_MINIMUM_SCORE,
		'prcnt_uf':DEFAULT_MINIMUM_SCORE,
		'alcohol_drink':DEFAULT_MAXIMUM_SCORE,
		'total_steps':DEFAULT_MINIMUM_SCORE,
		'floor_climbed':DEFAULT_MINIMUM_SCORE,
		'resting_hr':DEFAULT_MAXIMUM_SCORE,
		'deep_sleep':DEFAULT_MINIMUM_SCORE,
		'awake_time':DEFAULT_MAXIMUM_SCORE
	}

	def __init__(self,current_user,user,category,score,rank=None):
		self.current_user = current_user
		self.user = user
		self.category = category
		self.score = score
		self.rank = rank

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
			score = self._hours_to_hours_min(score)

		if self.user == self.current_user or self.current_user.is_staff:
			#if user is staff user, show username
			username = self.user.username
		else:
			username = "Anonymous",
		d = {
			'username':username,
			'score':score,
			'category':verbose_category[self.category],
			'rank':self.rank
		}
		return d

	def _hours_to_hours_min(self,hours):
		if hours or hours is not None:
			mins = hours * 60
			hours,mins = divmod(mins,60)
			hours = round(hours)
			mins = round(mins)
			if mins < 10:
				mins = "{:02d}".format(mins) 
			return "{}:{}".format(hours,mins)
		return None			

class Leaderboard(object):
	def __init__(self,user,scores,score_priority='lowest_last'):
		self.user = user
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

	def _get_lst(self,lst,i,default = None):
		""" get method for list similar to dictionary's get method """
		try:
			return lst[i];
		except IndexError:
			return default
		except TypeError:
			return default

	def _str_to_hours_min_sec(self,str_duration,time_format='hour',time_pattern="hh:mm:ss"):
		'''
			Expect duration in this format - "hh:mm:ss"
			convert in into hours, min or sec
			
			Arguments
			- str_duration : type String, time in format 'hh:mm:ss'

			- time_format: type String, possible values are [hour, minute, seconds]
			  specified in what format time to be converted
			  
			- time_pattern: type String, possible values are substring of "hh:mm:ss"
			  specify the position of hour, minute and second in the str_duration

		'''
		if str_duration:
			hms = str_duration.split(":")
			pattern_lst = time_pattern.split(":")
			pattern_indexed = {
				"hour":pattern_lst.index("hh") if "hh" in pattern_lst else None,
				"minute":pattern_lst.index("mm") if "mm" in pattern_lst else None,
				"second":pattern_lst.index("ss") if "ss" in pattern_lst else None
			}

			h = int(self._get_lst(hms,pattern_indexed["hour"],0))\
				if self._get_lst(hms,pattern_indexed["hour"],0) else 0
			m = int(self._get_lst(hms,pattern_indexed["minute"],0))\
				if self._get_lst(hms,pattern_indexed["minute"],0) else 0
			s = int(self._get_lst(hms,pattern_indexed["second"],0))\
				if self._get_lst(hms,pattern_indexed["second"],0) else 0

			t = 0
			if time_format == 'hour':
				t = h + (m/60) + (s/3600)
			elif time_format == 'minute':
				t = (h*60) + m + (s/60)
			else:
				t = (h * 3600) + (m * 60) + s
			return round(t,3)
		return 0

	def _get_catg_score_priority(self):
		categories = [x[0] for x in s.CATEGORY_CHOICES]
		catg_score_priority = {}
		lowest_first_categories = ['mc','resting_hr','awake_time','alcohol_drink']
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
					elif catg == 'mne_gpa':
						score = data['non_exercise']['non_exercise_steps'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'mc':
						score = data['mc']['movement_consistency_score'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'avg_sleep':
						score = data['sleep']['overall_sleep_gpa'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'ec':
						score = data['ec']['avg_no_of_days_exercises_per_week'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'prcnt_uf':
						score = data['nutrition']['prcnt_unprocessed_food_gpa'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'alcohol_drink':
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
						score = self._str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					if catg == 'awake_time':
						score = data['sleep']['awake_duration_in_hours_min'][dtype]
						score = self._str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
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
						elif catg == 'mne_gpa':
							score = data['non_exercise']['non_exericse_steps_gpa']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'mc':
							score = data['mc']['movement_consistency_score']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'avg_sleep':
							score = data['sleep']['overall_sleep_gpa']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'ec':
							score = data['ec']['avg_no_of_days_exercises_per_week']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'prcnt_uf':
							score = data['nutrition']['prcnt_unprocessed_food_gpa']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						elif catg == 'alcohol_drink':
							score = data['alcohol']['alcoholic_drinks_per_week_gpa']['custom_range'][str_range]['data']
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
							score = self._str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
						if catg == 'awake_time':
							score = data['sleep']['awake_duration_in_hours_min']['custom_range'][str_range]['data']
							score = self._str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(RankedScore(self.user,user,catg,score))
		return category_wise_data

	def _get_category_leaderboard(self,category,format):
		duration_lb = {}
		for dtype in self.duration_type:
			duration_lb[dtype] = Leaderboard(
				self.user,
				self.category_wise_data[category][dtype],
				self.catg_score_priority[category]
			).get_leaderboard(format=format)

		if self.custom_ranges:
			custom_range_lb = {}
			for r in self.custom_ranges:
				str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
				custom_range_lb[str_range] = Leaderboard(
					self.user,
					self.category_wise_data[category]['custom_range'][str_range],
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