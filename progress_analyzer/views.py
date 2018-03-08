from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from progress_analyzer.helpers.helper_classes import ProgressReport
	
class ProgressReportView(APIView):
	'''Generate Progress Analyzer Reports on the fly'''

	permission_classes = (IsAuthenticated,)
	def get(self, request, format="json"):
		DATA = ProgressReport(request.user, request.query_params).get_progress_report()
		return Response(DATA,status=status.HTTP_200_OK)