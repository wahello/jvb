from functools import wraps
import json

from .models import Invitation
from .exceptions import InvitationRequired

def invitation_required(view_func):
	@wraps(view_func)
	def _wrapped_view(request, *args, **kwargs):
		request_body = json.loads(request.body.decode('utf-8'))
		email = request_body.get('email')
		try:
			case_insensitive_email_field = "{}__iexact".format('email')
			invited_user = Invitation.objects.get(**{case_insensitive_email_field:email})
		except Invitation.DoesNotExist as e:
			invited_user = None
		if invited_user:
			return view_func(request, *args, **kwargs)
		raise InvitationRequired("User must be in invitation list to register")

	return _wrapped_view