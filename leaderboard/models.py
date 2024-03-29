from django.db import models
from django.db.models import Func,Q
from django.conf import settings

class Rank(Func):
	'''
		Rank function of Postgresql
	'''
	function = 'RANK'
	template = '%(function)s() OVER (ORDER BY %(expressions)s %(sort_order)s'

	def __init__(self, expressions, sort_order = 'DESC', **extra):
		super().__init__(expressions,sort_order,**extra)

class LeaderboardManager(models.Manager):
	def generate(self,date,category=None):
		'''
		Generate leaderboard for given category and date
		If category is not provided, then generate leaderboard for each category
		'''
		qs = super().get_queryset()

		# lb = Scores.objects.annotate(
		# 	category_rank = Rank('score')
		# ).filter(category=self.category, created_at=self.created_at)

		where_condition = ''
		if category and date:
			where_condition = "WHERE s1.category = '{}' AND s1.created_at = '{}'".format(category,date)
		elif not category and date:
			where_condition = "WHERE s1.created_at = '{}'".format(date)

		SQL = """SELECT s1.id, s1.user_id, s1.category,s1.score,COUNT(s2.score) AS category_rank
FROM leaderboard_score s1 JOIN leaderboard_score s2 
ON ((s1.score < s2.score OR (s1.user_id = s2.user_id AND s1.score = s2.score))
AND s1.category = s2.category AND s1.created_at == s2.created_at)
{}
GROUP BY s1.id ORDER BY s1.category,category_rank""".format(where_condition)
				
		lb = qs.raw(SQL)
		return lb
		
class Score(models.Model):
	OVERALL_HEALTH_GPA = 'oh_gpa'
	NON_EXERCISE_STEPS = 'nes'
	MOVEMENT_CONSISTENCY = 'mc'
	AVG_SLEEP = 'avg_sleep'
	EXERCISE_CONSISTENCY = 'ec'
	PRCNT_UNPROCESSED_FOOD = 'prcnt_uf'
	ALCOHOL = 'alcohol'
	TOTAL_STEPS = 'total_steps'
	FLOOR_CLIMBED = 'floor_climbed'
	RESTING_HEART_RATE = 'resting_hr'
	DEEP_SLEEP = 'deep_sleep'
	AWAKE_TIME = 'awake_time'

	CATEGORY_CHOICES = (
		(OVERALL_HEALTH_GPA,"Overall Health GPA"),
		(NON_EXERCISE_STEPS,"Non Exercise Steps"),
		(MOVEMENT_CONSISTENCY, "Movement Consistency"),
		(AVG_SLEEP, "Average Sleep"),
		(EXERCISE_CONSISTENCY, "Exercise Consistency"),
		(PRCNT_UNPROCESSED_FOOD, "Percent Unprocessed Food"),
		(ALCOHOL, "Alcohol"),
		(TOTAL_STEPS, "Total Steps"),
		(FLOOR_CLIMBED, "Floors Climbed"),
		(RESTING_HEART_RATE, "Resting Heart Rate"),
		(DEEP_SLEEP, "Deep Sleep"),
		(AWAKE_TIME, "Awake Time"),
	)
	user = models.ForeignKey(settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE, related_name='ranks')
	category = models.CharField(choices = CATEGORY_CHOICES, max_length=200)
	score = models.FloatField(blank=True, null=True)
	created_at = models.DateField()
	updated_at = models.DateTimeField(auto_now=True)

	leaderboard = LeaderboardManager()

	class Meta:
		unique_together = ("user","category","created_at")
		indexes = [
			models.Index(fields=['category', '-created_at']),
			models.Index(fields=['created_at']),
		]

	def __str__(self):
		return "{}-{}-{}".format(self.user.username,self.category, self.created_at)


	@property
	def rank(self):
		'''
		Calculate rank in it's own category
		'''
		min_rank = Score.objects.filter(
			Q(score__gt = self.score) & Q(created_at = self.created_at) &
			Q(category = self.category)
		).count() + 1

		return min_rank
