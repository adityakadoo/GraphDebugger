from sre_constants import error
import gdb
from .stl_handler import supported_handlers, get_basic_type
import re
import traceback

queue = None

def pointer_handler(varr, tp):
    while tp.code == gdb.TYPE_CODE_PTR:
        varr = varr.dereference()
        tp = varr.type
    return varr,tp

def array_handler(varr, tp):
    min,max = tp.range()
    array = []
    global queue
    for i in range(min,max+1):
        temp_varr = varr[i]
        temp_tp = temp_varr.type
        temp_varr, temp_tp = pointer_handler(temp_varr, temp_tp)
        queue.append(("["+str(i)+"]",temp_varr))
        temp = str(temp_tp)+" "+str(temp_varr.address).split(" ")[0]
        array.append(temp)
    return array

def struct_handler(varr, tp):
    fields = tp.fields()
    struct = dict()
    global queue
    for key in fields:
        temp_varr = varr[key]
        temp_tp = temp_varr.type
        temp_varr, temp_tp = pointer_handler(temp_varr, temp_tp)
        if temp_tp.code == gdb.TYPE_CODE_ARRAY:
            struct[key.name] = array_handler(temp_varr, temp_tp)
        else:
            struct[key.name] = str(temp_tp)+" "+str(temp_varr.address).split(" ")[0]
            queue.append((key.name,temp_varr))
    return struct

def add_varr(varr):
    global queue
    tp = varr.type
    varr, tp = pointer_handler(varr, tp)
    
    try:
        tag = get_basic_type(tp)
        if tag is not None:
            compiled_rx = re.compile('^([a-zA-Z0-9_:]+)(<.*>)?$')
            match = compiled_rx.match(tag)
            if match is not None:
                basename = match.group(1)
                if basename in supported_handlers:
                    handler =  supported_handlers[basename](str(tp),varr)
                    res = []
                    for child in handler.children():
                        temp_varr, temp_tp = pointer_handler(child[1],child[1].type)
                        queue.append((child[0],temp_varr))
                        res.append(str(temp_tp)+" "+str(temp_varr.address).split(" ")[0])
                    return res

        if tp.code == gdb.TYPE_CODE_ARRAY:
            return array_handler(varr, tp)
        elif tp.code == gdb.TYPE_CODE_STRUCT:
            return struct_handler(varr, tp)
        elif tp.code == gdb.TYPE_CODE_ENUM:
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
    except error as e:
        traceback.print_exception(e)
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
            queue.append((key.name,key.value(frame)))
    while len(queue) != 0:
        try:
            name,varr = queue[0]
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
            traceback.print_exception(e)
            continue
    return res
