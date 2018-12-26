class InvitationRequired(Exception):
	"""User must be in invitation list to register"""
	def __init__(self,m):
		self.message = m
	def __str__(self):
		return self.message