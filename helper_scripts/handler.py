from sre_constants import error
import gdb
from .stl_handler import supported_handlers, get_basic_type
import re
import traceback

queue = None

def pointer_handler(varr, tp):
    while tp.code == gdb.TYPE_CODE_PTR:
        try:
            varr = varr.dereference()
            tp = varr.type
        except gdb.MemoryError as e:
            return None,tp
    return varr,tp

def array_handler(varr, tp):
    min,max = tp.range()
    array = []
    global queue
    for i in range(min,max+1):
        temp_varr = varr[i]
        temp_tp = temp_varr.type
        temp_varr, temp_tp = pointer_handler(temp_varr, temp_tp)
        if temp_varr is None:
            array.append("NULL 0x0")
        else:
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
        if temp_varr is None:
            struct[key.name] = "NULL 0x0"
        else:
            struct[key.name] = str(temp_tp)+" "+str(temp_varr.address).split(" ")[0]
            queue.append((key.name,temp_varr))
    return struct

def add_varr(varr):
    global queue
    tp = varr.type
    varr, tp = pointer_handler(varr, tp)
    if varr is None:
        return None

    try:
        tag = get_basic_type(tp)
        if tag is not None:
            compiled_rx = re.compile('^([a-zA-Z0-9_:]+)(<.*>)?$')
            match = compiled_rx.match(tag)
            if match is not None:
                basename = match.group(1)
                if basename in supported_handlers:
                    handler =  supported_handlers[basename](basename,varr)
                    res = []
                    if hasattr(handler, 'display_hint'):
                        if handler.display_hint() == "string":
                            return handler.to_string()
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
        elif tp.code == gdb.TYPE_CODE_INT:
            if str(tp) == 'char' or str(tp) == 'const char':
                return chr(int(varr)%256)
            return int(varr)
        elif tp.code == gdb.TYPE_CODE_FLT:
            return round(float(varr),6)
        elif tp.code == gdb.TYPE_CODE_BOOL:
            return bool(varr)
        else:
            return str(varr.type.code)+" "+str(varr)
    except gdb.MemoryError as e:
        # print(traceback.format_exc())
        return None

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
    res = {
        "NULL 0x0" : {
            "name": "nullptr",
            "value": None
        }
    }
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
        except error as e:
            # print("gdb.MemoryError: ",e)
            queue.pop(0)
            print(traceback.format_exc())
            continue
    return res
