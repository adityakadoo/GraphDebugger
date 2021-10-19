from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .python_scripts import lines

# Create your views here.

@csrf_exempt
def start_process(request):
    # Will contain config info in JSON format
    config = json.loads(request.body)
    # print(config)
    # Will contain binary-path in string format
    # binary = request.GET['path']
    # print(binary)

    # command = ["gdb","-x","python_scripts/start.py"]
    # Add code here to start and maintain a new GDB process with above command
    
    return JsonResponse(config)