from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from Summary.models import Summary_Desktop
from Summary.serializer import SummarySerializer

# Create your views here.
@csrf_exempt
def summary_list(request):


    if request.method == 'GET':
        summary = Summary_Desktop.objects.all()
        serializer = SummarySerializer(summary, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SummarySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
