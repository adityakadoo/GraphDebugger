import gdb
import subprocess as sp
import json
import requests
from threading import Thread, _active
import sys,os,signal
from datetime import datetime

current_loc=os.path.realpath(__file__).split("/")
sys.path.append("/"+current_loc[1]+"/"+current_loc[2]+"/GraphDebugger")

from helper_scripts.handler import *

django_thread = None
react_thread = None
django_server = None
react_server = None

def start_react_server():
    global react_server
    react_server = sp.Popen("npm start --prefix ~/GraphDebugger/Frontend/graph-ui",stdin=sp.PIPE,stdout=sp.PIPE,stderr=sp.PIPE,shell=True,preexec_fn=os.setsid)

def start_django_server():
    global current_loc
    global django_server
    django_server = sp.Popen("python3 /"+current_loc[1]+"/"+current_loc[2]+"/GraphDebugger/manage.py runserver",stdin=sp.PIPE,stdout=sp.PIPE,stderr=sp.PIPE,shell=True,preexec_fn=os.setsid)

class Run_server(gdb.Command):
    """Command to start GraphDebugger servers"""

    def __init__(self) -> None:
        super(Run_server, self).__init__("run-server", gdb.COMMAND_SUPPORT)

    def invoke(self, arg, from_tty):
        # Django
        global django_thread
        django_thread=Thread(target=start_django_server)
        django_thread.start()

        # React
        global react_thread
        react_thread=Thread(target=start_react_server)
        react_thread.start()

class Close_server(gdb.Command):
    """Command to stop GraphDebugger servers"""

    def __init__(self) -> None:
        super(Close_server, self).__init__("close-server", gdb.COMMAND_SUPPORT)
    
    def invoke(self, arg, from_tty):
        global react_thread, react_server, django_thread, django_server
        if react_server is not None:
            os.killpg(os.getpgid(react_server.pid), signal.SIGKILL)
        if django_server is not None:
            os.killpg(os.getpgid(django_server.pid), signal.SIGKILL)
        if react_thread is not None:
            react_thread.join()
            react_thread = None
        if django_thread is not None:
            django_thread.join()
            django_thread = None

class Free_server(gdb.Command):
    """Frees up localhost:8000 and localhost:3000 for using GraphDebugger"""

    def __init__(self) -> None:
        super(Free_server, self).__init__("free-server", gdb.COMMAND_SUPPORT)

    def invoke(self, arg, from_tty):
        sp.Popen("kill -9 $(lsof -t -i:3000)",stdin=sp.PIPE,stdout=sp.PIPE,stderr=sp.PIPE,shell=True)
        sp.Popen("kill -9 $(lsof -t -i:8000)",stdin=sp.PIPE,stdout=sp.PIPE,stderr=sp.PIPE,shell=True)

def send_request(event):
    data = get_data()
    data['time_stamp']=str(datetime.now())
    try:    
        response = requests.post("http://localhost:8000/gdb/graph/",
                data=json.dumps(data,indent=0),
                headers={'content-type':'application/json'},
            )
        if response.status_code != 200:
            print("Error occured while connecting, with status code " + str(response.status_code) + ".")
    except requests.exceptions.ConnectionError as e:
        pass
    return

Run_server()
Close_server()
Free_server()

gdb.events.stop.connect(send_request)

print("\033[0;35;1mEnter 'run-server' command to start Graph Debugger app.")
print("\033[0;37;0m",end="")
