import gdb
import subprocess as sp
import traceback
import json
import requests
from threading import Thread
import sys,os
current_loc=os.path.realpath(__file__).split("/")
sys.path.append("/"+current_loc[1]+"/"+current_loc[2]+"/GraphDebugger")
from helper_scripts.handler import *

def start_react_server():
    sp.run(["npm","start","--prefix","~/GraphDebugger/Frontend/graph-ui"],stdin=sp.PIPE,capture_output=True)

def start_django_server():
    current_loc=os.path.realpath(__file__).split("/")
    sp.run(["python3","/"+current_loc[1]+"/"+current_loc[2]+"/GraphDebugger/manage.py","runserver"],stdin=sp.PIPE,capture_output=True)

def add_varr(varr):
    tp = varr.type
    varr, tp = pointer_handler(varr, tp)
    try:
        if tp.code == gdb.TYPE_CODE_ARRAY:
            array, q = array_handler(varr, tp)
            for e in q:
                queue.append(e)
            return array
        elif tp.code == gdb.TYPE_CODE_STRUCT:
            struct, q = struct_handler(varr, tp)
            for e in q:
                queue.append(e)
            return struct
        elif tp.code == tp.code == gdb.TYPE_CODE_ENUM:
            return str(varr)
        elif tp.code == gdb.TYPE_CODE_STRING or tp.code == gdb.TYPE_CODE_CHAR:
            return str(varr)
        elif tp.code == gdb.TYPE_CODE_INT:
            if(str(tp)=='char'):
                return chr(int(varr)%256)
            return int(varr)
        elif tp.code == gdb.TYPE_CODE_FLT:
            return round(float(varr),6)
        elif tp.code == gdb.TYPE_CODE_BOOL:
            return bool(varr)
        else:
            return str(varr.type.code)+" "+str(varr)
    except(gdb.error):
        return str(varr.type.code)+" "+str(varr)

def get_blocks(frame):
    curr_block = frame.block()
    blocks = [curr_block]
    while curr_block.function is None:
        curr_block = curr_block.superblock
        blocks.append(curr_block)
    return blocks

def get_data():
    frame = gdb.newest_frame()
    blocks = get_blocks(frame)
    global queue
    queue = []
    res = dict()
    for block in blocks:
        for key in block:
            queue.append((key.value(frame),key.name))
    while len(queue) != 0:
        try:
            varr,name = queue[0]
            tp = varr.type
            type_addr = str(tp)+" "+str(varr.address).split(" ")[0]
            if type_addr not in res.keys():
                res[type_addr] = {
                    'name': name,
                    'value': add_varr(varr)
                }
            queue.pop(0)
        except gdb.MemoryError as e:
            # print("gdb.MeroError: ",e)
            queue.pop(0)
            continue
    return res

def send_request(data: dict):
    response = requests.post("http://localhost:8000/gdb/graph/",
            data=json.dumps(data,indent=0),
            headers={'content-type':'application/json'},
        )
    return response 

if __name__ == "__main__":
    django_thread=Thread(target=start_django_server)
    django_thread.start()
    react_thread=Thread(target=start_react_server)
    react_thread.start()
    print("\033[0;33;1mPress Ctrl+C then enter to start a normal gdb session.")
    while(True):
        print("\033[0;34;1mgdb-graph",end="")
        command=input("\033[0;37;0m$ ")
        try:
            gdb.execute(command)
            gdb.flush()
            data = get_data()
            # print(json.dumps(data,indent=4))
            send_request(data)
        except gdb.error as e:
            print(traceback.format_exc(),end="")
            print("gdb.error: "+str(e))
            continue
        except KeyboardInterrupt:
            django_thread.join()
            react_thread.join()
            break  
