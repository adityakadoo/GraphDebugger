import gdb
import subprocess as sp
import traceback
import requests
from threading import Thread, current_thread
import sys,os

def start_react_server():
	sp.run(["npm","start","--prefix","~/GraphDebugger/Frontend/graph-ui"],stdin=sp.PIPE,capture_output=True)

def start_django_server():
    current_loc=os.getcwd()
    sp.run(["python3",current_loc+"/GraphDebugger/manage.py","runserver"],stdin=sp.PIPE,capture_output=True)

if __name__ == "__main__":
    django_thread=Thread(target=start_django_server)
    django_thread.start()
    react_thread=Thread(target=start_react_server)
    react_thread.start()
    while(True):
        print("\033[0;31;1mPress Ctrl+C then enter to start a normal gdb session.")
        print("\033[0;34;1mgdb-graph",end="")
        command=input("\033[0;37;0m$ ")
        try:
            gdb.execute(command)
        except gdb.error:
            print(traceback.format_exc(),end="")
            continue
        except KeyboardInterrupt:
            django_thread.join()
            react_thread.join()
            break
            
