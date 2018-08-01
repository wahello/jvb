from datetime import datetime
from operator import attrgetter,itemgetter
from itertools import zip_longest
from functools import cmp_to_key
from django.contrib.auth import get_user_model

from progress_analyzer.helpers.helper_classes import ProgressReport
from leaderboard.helpers.leaderboard_helper import (
	_str_to_hours_min_sec,
	_hours_to_hours_min
)

class LeaderboardCategories(object):
	"""
	Class to represent possible categories for leader board and 
	category meta information
	"""
	def __init__(self):
		# If score of any category is not provided (none) then 
		# default maximum or minimum value will be assigned as score.
		# For example, if score for Overall Health GPA category is 
		# is not present then DEFAULT_MINIMUM_SCORE value is assigned 
		# because if DEFAULT_MAXIMUM_SCORE is assigned, then score will
		# get better rank in leader board. Better the gpa, better the rank.
		self.DEFAULT_MAXIMUM_SCORE = 999999
		self.DEFAULT_MINIMUM_SCORE = -999999
	
		self.categories = {
			'oh_gpa':"Overall Health GPA",
			'nes':"Non Exercise Steps",
			'mc':"Movement Consistency",
			'avg_sleep':"Average Sleep",
			'ec':"Exercise Consistency",
			'prcnt_uf':"Percent Unprocessed Food",
			'alcohol':"Alcohol",
			'total_steps':"Total Steps",
			'floor_climbed':"Floors Climbed",
			'resting_hr':"Resting Heart Rate",
			'deep_sleep':"Deep Sleep",
			'awake_time':"Awake Time",
			'time_99':"Time To 99",
			"pure_time_99":"Pure Time To 99",
			"beat_lowered":"Heart Beats Lowered In 1st Minute",
			"pure_beat_lowered":"Pure Heart Beats Lowered In 1st Minute",
			"overall_hrr":"Overall HRR"
		}

		# default score value for each leader board category
		self.category_default_score = {
			'oh_gpa':self.DEFAULT_MINIMUM_SCORE,
			'nes':self.DEFAULT_MINIMUM_SCORE,
			'mc':self.DEFAULT_MAXIMUM_SCORE,
			'avg_sleep':self.DEFAULT_MINIMUM_SCORE,
			'ec':self.DEFAULT_MINIMUM_SCORE,
			'prcnt_uf':self.DEFAULT_MINIMUM_SCORE,
			'alcohol':self.DEFAULT_MAXIMUM_SCORE,
			'total_steps':self.DEFAULT_MINIMUM_SCORE,
			'floor_climbed':self.DEFAULT_MINIMUM_SCORE,
			'resting_hr':self.DEFAULT_MAXIMUM_SCORE,
			'deep_sleep':self.DEFAULT_MINIMUM_SCORE,
			'awake_time':self.DEFAULT_MAXIMUM_SCORE,
			'time_99':self.DEFAULT_MAXIMUM_SCORE,
			'pure_time_99':self.DEFAULT_MAXIMUM_SCORE,
			'beat_lowered':self.DEFAULT_MINIMUM_SCORE,
			'pure_beat_lowered':self.DEFAULT_MINIMUM_SCORE
		}

		# Verbose name for score of certain category
		self.category_score_vname = {
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
			'awake_time':'Awake Time Duration (hh:mm)',
			'time_99':'Time To Reach 99',
			'pure_time_99':'Pure Time To 99 ',
			'beat_lowered':'Heart Beat Lowered In 1st Minute',
			'pure_beat_lowered':'Pure Heart Beat Lowered In 1st Minute'
		}
		self.category_score_priority = self.__get_catg_score_priority()

	def __get_catg_score_priority(self):
		''' 
		Create dict representing score priority of each category
		Example:
			{
				'mc': 'lowest_first',
				'resting_hr':'lowest_first',
				...
			}
		'''
		categories = self.categories.keys()
		catg_score_priority = {}
		lowest_first_categories = ['mc','resting_hr','awake_time','alcohol',
			'time_99','pure_time_99',"overall_hrr"]
		for category in categories:
			if category in lowest_first_categories:
				catg_score_priority[category] = 'lowest_first'
			else:
				catg_score_priority[category] = 'lowest_last'
		return catg_score_priority

class RankedScore(object):
	'''
	Represent a score with rank and other information.
	'''
	DEFAULT_SLEEP_DURATION = '0:00'

	def __init__(self,current_user,user,category,score,
			rank=None,other_scores=None):
		'''
		Initialize a RankedScore object

		Args:
			current_user (:obj:`User`): Currently logged user
			user (:obj:`User`): User to which this score belong
			category (str): Category to which this score belongs.
			score: Actual score value
			rank (int): Rank of this score in it's respective category
				leader board. Default to None
			other_score: Other scores related to this score. Default to None	  
		'''
		self.category_meta = LeaderboardCategories()
		self.current_user = current_user
		self.user = user
		self.category = category
		self.score = score
		self.rank = rank
		self.other_scores = other_scores

	@property		
	def category(self):
		'''string: Category to which this score belongs.'''
		return self.__category

	@category.setter
	def category(self,category):
		'''Setter for property "category" '''
		category_choices = self.category_meta.categories.keys()
		if category.lower() in category_choices:
			self.__category = category
		else:
			# If category associated with score is not valid category,
			# throw a ValueError
			raise ValueError("'{}' is not a valid category".format(category))

	@property
	def score(self):
		'''Actual score value, could be None, int, float or string'''
		return self.__score

	@score.setter
	def score(self,score):
		'''
		Setter for property score
		
		If provided score value is None, "Not Reported" or "Not Provided"
		then it'll be replaced with respective category default value 
		'''
		if score == None or score in ['Not Reported','Not Provided']:
			self.__score = self.category_meta.category_default_score[self.category]
		else:
			self.__score = score

	@property
	def other_scores(self):
		'''dict: Other scores related to this score. Default to None'''
		return self.__other_scores

	@other_scores.setter
	def other_scores(self,other_scores):
		'''
		Setter for property other_scores
		'''
		if other_scores and self.category == 'avg_sleep':
			if other_scores['sleep_duration']['value'] == None:
				other_scores['sleep_duration']['value'] = self.DEFAULT_SLEEP_DURATION
		self.__other_scores = other_scores

	@property
	def rank(self):
		'''
		(int): Rank of this score in it's respective category
			leader board. Default to None
		'''
		return self.__rank

	@rank.setter
	def rank(self,rank):
		'''
		Setter for property rank

		If rank is not None or less than 1 then raise ValueError
		'''
		if (rank is None or (not rank < 1 and type(rank) is int)):
			self.__rank = rank
		else:
			raise ValueError("'{}' is not a valid rank. Rank should be positive integer and non zero".format(rank))

	def as_dict(self,privacy="private"):
		'''
		convert score data in dict object
		Args:
			privacy: Toggle between whether to show username or not.
				If it is "private", then show 'Anonymous'. If it's 
				"public" diaplay username of score's user. Default to 
				"private"

		Return:
			dict: A dictionary having data related to score. Example - 
			{
				'username':'itachi',
				'score':{
					'value':3.9,
					'verbose_name':'Overall Health GPA'
				},
				'other_scores':None,
				'category':'Overall Health GPA',
				'rank':1
			}
		'''
		verbose_category = self.category_meta.categories
		score = self.score
		if (score == self.category_meta.DEFAULT_MAXIMUM_SCORE 
			or score == self.category_meta.DEFAULT_MINIMUM_SCORE):
			# Change default score to 'N/A'
			score = "N/A"
		elif self.category in ["awake_time","deep_sleep","time_99","pure_time_99"]:
			score = _hours_to_hours_min(score)

		other_scores = self.other_scores
		if other_scores and self.category == 'avg_sleep':
			if other_scores['sleep_duration']['value'] == self.DEFAULT_SLEEP_DURATION:
				other_scores['sleep_duration']['value'] = 'N/A'

		if (self.user == self.current_user 
			or self.current_user.is_staff
			or privacy == "public"):
			#if user is staff user, show username
			username = self.user.username
		else:
			username = "Anonymous",

		data = {
			'username':username,
			'score':{
				'value':score,
				'verbose_name':self.category_meta.category_score_vname[self.category]
			},
			'other_scores':other_scores,
			'category':verbose_category[self.category],
			'rank':self.rank
		}
		return data

class Leaderboard(object):
	''' Class representing leader board for particular category'''

	def __init__(self,user,scores,category,
			score_priority='lowest_last',privacy="private"):
		'''
		Initialize a Leader board object

		Args:
			user(:obj:`User`): Currently logged in user
			scores(list): A list of 'RankedScore' for any category
			category(str): Category to which these scores belong
			score_priority(str): Represents whether lowest score will be
				ranked higher or lower. It differs from category to 
				category. For example, if user have lower Movement 
				consistency score then that user should be ranked higher 
				than other user. Default to 'lowest_last'.Possible value -
					lowest_last: Lowest score should be ranked last
					lowest_first: Lowset score should be ranked first 
			privacy: Display username of users if public else show
				"Anonymous", default to "private". Possible values are
				- "public", "private"   
		'''
		self.user = user
		# possible score priorities
		self.priorities = ["lowest_last","lowest_first"]
		self.scores = scores
		self.category = category
		self._score_priority = score_priority
		# list of scores which are ranked
		self.ranked_scores = self.rank_scores()
		self.privacy = privacy

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
		'''
		Rank the scores of any category (except sleep)
		'''
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
		'''
		Return the ranked scores.
		By default, ranked scores will be converted into detailed 
		dictionary. Format can be extended and implementation have to
		be added for new format. 

		Args:
			format(string): Return data in specified format. Default to dict
		'''
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
				dict_scores.append(score.as_dict(privacy=self.privacy))
			# Ranked score of currently logged user
			lb['user_rank'] = user_rank 
			# Ranked score of all user
			lb['all_rank'] = dict_scores
			return lb
		else:
			return self.ranked_scores

class SleepLeaderboard(Leaderboard):
	'''
	Class for preparing Average Sleep Leaderboard
	'''
	def sleep_rank_comparator(self,x,y):
		'''
		Comparator for comparing two sleep scores

		First compare based on avg sleep gpa. 
		If sleep gpa is equal then compare based on avg sleep hours  
		'''

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

	def rank_scores(self):
		'''
		Rank the sleep scores

		Args:
			to_reverse (bool): If True, reverse the result of sorted scores
		'''
		if self._score_priority == 'lowest_first':
			to_reverse = False
		elif self._score_priority == 'lowest_last':
			to_reverse = True

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

class HrrOverallLeaderboard(Leaderboard):
	'''
	Class for preparing Overall HRR Leaderboard
	'''
	def __init__(self,user,category_wise_hrr_data,
			score_priority="lowest_first",privacy="private"):
		self.category_meta = LeaderboardCategories()
		self.user = user
		self.priorities = ["lowest_last","lowest_first"]
		self.category_wise_hrr_data = category_wise_hrr_data
		self.scores = self.__prepare_scores()
		self._score_priority = score_priority
		self.ranked_scores = self.rank_scores()
		self.privacy = privacy

	def __prepare_scores(self):
		'''
		Genarate a dictionary which contain individual HRR
		data and total rank point for individual users.
		'''
		catg_lb = {}
		overall_scores = {}
		catg_score_priority = self.category_meta.category_score_priority
		for catg,data in self.category_wise_hrr_data.items():
			catg_lb[catg] = Leaderboard(
				self.user,data,catg,catg_score_priority[catg],privacy="public"
			).get_leaderboard()

		for catg,lb in catg_lb.items():
			for score in lb['all_rank']:
				username = score['username']
				if not overall_scores.get(username):
					overall_scores[score['username']] = {
						"username":username,
						"total_hrr_rank_point":0,
						"rank":None
					}
				overall_scores[username][catg] = score
				overall_scores[username]["total_hrr_rank_point"] += score['rank']
		return overall_scores

	def rank_scores(self):
		'''
		Rank the scores of any category (except sleep)
		'''
		if self._score_priority == 'lowest_first':
			to_reverse = False
		elif self._score_priority == 'lowest_last':
			to_reverse = True
		ranked_scores = []
		rank_to_award = 1
		previous_score = None
		sorted_scores = sorted(
			self.scores.values(),
			key=itemgetter('total_hrr_rank_point'),
			reverse=to_reverse)
		for i,score in enumerate(sorted_scores):
			if (previous_score is not None 
				and (previous_score != score['total_hrr_rank_point'])):
				rank_to_award = i+1
			score['rank'] = rank_to_award
			ranked_scores.append(score)
			previous_score = score['total_hrr_rank_point']
		return ranked_scores

	def get_leaderboard(self,format = 'dict'):
		'''
		Return the ranked scores.
		By default, ranked scores will be converted into detailed 
		dictionary. Format can be extended and implementation have to
		be added for new format. 

		Args:
			format(string): Return data in specified format. Default to dict
		'''
		lb = {
			"user_rank":None,
			"all_rank":None
		}
		if format == 'dict':
			user_rank = None
			dict_scores = []
			for score in self.ranked_scores:
				if score["username"] == self.user.username:
					user_rank = score
					dict_scores.append(score)
				elif self.privacy == "public" or self.user.is_staff:
					dict_scores.append(score)
				else:
					score['username'] = 'Anonymous'
					dict_scores.append(score)
			# Ranked score of currently logged user
			lb['user_rank'] = user_rank 
			# Ranked score of all user
			lb['all_rank'] = dict_scores
			return lb
		else:
			return self.ranked_scores


class LeaderboardOverview(object):
	'''
	Class for providing complete leader board for every category
	'''
	def __init__(self,user,query_params):
		'''
		Initialize Leader board Overview object

		Args:
			user(:obj:`User`): Currently logged user
			query_params(dict): Dictionary having following info -
				date(str): Date for which leaderless should be generated.
					Date in format YYYY-MM-DD.
				custom_range(str): A string containing pairs of custom date ranges
					for which leader board should be generated.
				duration(str): Comma separated string values representing fixed 
					duration for which leader board have to generated.
				Example:
					query_params = {
						"date":"2018-02-19",
						"custom_ranges":"2018-02-12,2018-02-16,2018-02-13,2018-02-18",
						"duration":"today,yesterday,year"
					 }
		'''
		self.category_meta = LeaderboardCategories()
		# current logged user
		self.user = user
		# Current date from which leader board have to created
		self.current_date = self._str_to_dt(query_params.get('date',None))
		# Possible leader board categories
		self.categories = self.category_meta.categories
		self.duration_type = ['today','yesterday','week','month','year']
		# list of tuple, carrying pair of custom ranges
		self.custom_ranges = self._get_custom_range_info(query_params)
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
		'''
		Convert string date to datetime object
		'''
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
		'''
		Convert comma separated date into list of tuple. Each tuple
		contain a date pair (start date, end date)
		
		Returns:
			list: it'll be list of tuples, where first item of tuple is the
				start of range and second is end of the range.
				For example - 
					[("2018-02-12","2018-02-17"), ("2018-02-01, 2018-02-29"), ...]
		'''
		custom_ranges = query_params.get('custom_ranges',None)
		if custom_ranges:
			custom_ranges = [(self._str_to_dt(r[0]),self._str_to_dt(r[1]))
				for r in list(self.grouped(custom_ranges.split(","),2,None))
				if r[0] and r[1]]
			return custom_ranges
		return None

	def _get_category_wise_data(self,query_params):
		'''
		Transform progress analyzer data for all users and transform 
		the data into dictionary having following structure - 
			{
				'oh_gpa':{
					'today':[RankedScoreObj, RankedScoreObj,...]
					'yesterday':[RankedScoreObj, RankedScoreObj,...],
					'week':[RankedScoreObj, RankedScoreObj,...]
					'month':[RankedScoreObj, RankedScoreObj,...],
					'year':[RankedScoreObj, RankedScoreObj,...],
					'custom_range':{
						'2018-01-01 to 2018-01-10':[RankedScoreObj, RankedScoreObj,...],
						'2018-07-02 to 2018-07-05':[RankedScoreObj, RankedScoreObj,...],
						...
					}
				},
				'mc':{
					...
				}
				...
			}
		'''
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
					elif catg == 'deep_sleep':
						score = data['sleep']['deep_sleep_in_hours_min'][dtype]
						score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'awake_time':
						score = data['sleep']['awake_duration_in_hours_min'][dtype]
						score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'time_99':
						score = data['other']['hrr_time_to_99'][dtype]
						if score and score != "Not Provided":
							score = _str_to_hours_min_sec(score,time_format="minute",time_pattern="mm:ss")
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'pure_time_99':
						score = data['other']['hrr_pure_time_to_99'][dtype]
						if score and score != "Not Provided":
							score = _str_to_hours_min_sec(score,time_format="minute", time_pattern="mm:ss")
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'beat_lowered':
						score = data['other']['hrr_beats_lowered_in_first_min'][dtype]
						category_wise_data[catg][dtype].append(RankedScore(self.user,user,catg,score))
					elif catg == 'pure_beat_lowered':
						score = data['other']['hrr_pure_1_minute_beat_lowered'][dtype]
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
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'total_steps':
							score = data['non_exercise']['total_steps']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'floor_climbed':
							score = data['other']['floors_climbed']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'resting_hr':
							score = data['other']['resting_hr']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'deep_sleep':
							score = data['sleep']['deep_sleep_in_hours_min']['custom_range'][str_range]['data']
							score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'awake_time':
							score = data['sleep']['awake_duration_in_hours_min']['custom_range'][str_range]['data']
							score = _str_to_hours_min_sec(score,time_pattern="hh:mm") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'time_99':
							score = data['other']['hrr_time_to_99']['custom_range'][str_range]['data']
							if score and score != "Not Provided":
								score = _str_to_hours_min_sec(score,time_format="minute",time_pattern="mm:ss") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'pure_time_99':
							score = data['other']['hrr_pure_time_to_99']['custom_range'][str_range]['data']
							if score and score != "Not Provided":
								score = _str_to_hours_min_sec(score,time_format="minute",time_pattern="mm:ss") if score else score
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'beat_lowered':
							score = data['other']['hrr_beats_lowered_in_first_min']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
						elif catg == 'pure_beat_lowered':
							score = data['other']['hrr_pure_1_minute_beat_lowered']['custom_range'][str_range]['data']
							category_wise_data[catg]['custom_range'][str_range].append(
								RankedScore(self.user,user,catg,score))
		return category_wise_data

	def _get_category_leaderboard(self,category,format):
		'''
		Prepare leader board for certain category

		Args:
			category(string): Category for which leader board have to
				be created
			format(sting): Format in which return data is expected. 
		'''
		duration_lb = {}
		for dtype in self.duration_type:
			if category == 'overall_hrr':
				hrr_data = {
					'time_99':self.category_wise_data['time_99'][dtype],
					'pure_time_99':self.category_wise_data['pure_time_99'][dtype],
					'beat_lowered':self.category_wise_data['beat_lowered'][dtype],
					'pure_beat_lowered':self.category_wise_data['pure_beat_lowered'][dtype]
				}
				duration_lb[dtype] = HrrOverallLeaderboard(
					self.user,hrr_data
				).get_leaderboard(format=format)
			elif category == 'avg_sleep':
				duration_lb[dtype] = SleepLeaderboard(
					self.user,
					self.category_wise_data[category][dtype],
					category,
					self.category_meta.category_score_priority[category]
				).get_leaderboard(format=format)
			else:
				duration_lb[dtype] = Leaderboard(
					self.user,
					self.category_wise_data[category][dtype],
					category,
					self.category_meta.category_score_priority[category]
				).get_leaderboard(format=format)

		if self.custom_ranges:
			custom_range_lb = {}
			for r in self.custom_ranges:
				str_range = r[0].strftime("%Y-%m-%d")+" to "+r[1].strftime("%Y-%m-%d")
				if category == 'overall_hrr':
					hrr_data = {
						'time_99':self.category_wise_data['time_99']['custom_range'][str_range],
						'pure_time_99':self.category_wise_data['pure_time_99']['custom_range'][str_range],
						'beat_lowered':self.category_wise_data['beat_lowered']['custom_range'][str_range],
						'pure_beat_lowered':self.category_wise_data['pure_beat_lowered']['custom_range'][str_range]
					}
					custom_range_lb[str_range] = HrrOverallLeaderboard(
						self.user,hrr_data
					).get_leaderboard(format=format)
				elif category == 'avg_sleep':
					custom_range_lb[str_range] = SleepLeaderboard(
						self.user,
						self.category_wise_data[category]['custom_range'][str_range],
						category,
						self.category_meta.category_score_priority[category]
					).get_leaderboard(format=format)
				else:
					custom_range_lb[str_range] = Leaderboard(
						self.user,
						self.category_wise_data[category]['custom_range'][str_range],
						category,
						self.category_meta.category_score_priority[category]
					).get_leaderboard(format = format)
			duration_lb['custom_range'] = custom_range_lb

		return duration_lb

	def get_leaderboard(self,format='dict',category=None):
		'''
		Prepare overall leader board 
		'''
		lb = {}
		if not category:
			#full leader board
			for catg in self.category_wise_data.keys():
				lb[catg] = self._get_category_leaderboard(catg,format)
		else:
			lb[category] = self._get_category_leaderboard(category,format)
		lb["duration_date"] = self.duration_date

		return lb					