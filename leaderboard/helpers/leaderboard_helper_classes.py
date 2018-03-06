from datetime import datetime
from progress_analyzer.helpers.helper_classes import ProgressReport
from leaderboard.models import Score as s

class RankedScore(object):
	def __init__(self,user,score,category,created_at,rank=None):
		self.user = user
		self._score = score
		self._category = category
		self._rank = rank
		self.created_at = created_at

	@property		
	def category(self):
		return self.__category

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
		if not rank < 1 and type(rank) is int:
			self._rank = rank
		else:
			raise ValueError("'{}' is not a valid rank. Rank should be integer and non zero".format(rank))

	@property
	def created_at(self):
		return self._created_at

	@created_at.setter
	def created_at(self, created_at):
		if isinstance(created_at, datetime):
			self._created_at = created_at
		else:
			raise ValueError("'{}' should be datetime object".format(created_at))
			

class Leaderboard(object):

	def __init__(self,user, query_params):
		pass