from sre_constants import error
import gdb
from .stl_handler import supported_handlers, get_basic_type
import re
import traceback

queue = None
res = {}

def pointer_handler(varr, tp):
    basename = get_basename(tp)
    while tp.code == gdb.TYPE_CODE_PTR or basename == 'std::shared_ptr':
        try:
            if tp.code == gdb.TYPE_CODE_PTR:
                varr = varr.dereference()
                tp = varr.type
            else:
                varr = varr['_M_ptr'].dereference().cast(tp.template_argument(0))
                tp = tp.template_argument(0)
            basename = get_basename(tp)
        except gdb.MemoryError as e:
            return None,tp
    return varr,tp

def array_handler(varr, tp):
    min,max = tp.range()
    array = []
    global queue, res
    for i in range(min,max+1):
        temp_varr = varr[i]
        temp_tp = temp_varr.type
        temp_varr, temp_tp = pointer_handler(temp_varr, temp_tp)
        if temp_varr is None:
            array.append([res["types"]["NULL"], "0x0"])
        else:
            if str(temp_tp) not in res["types"]:
                res["types"][str(temp_tp)] = len(res["varr"])
                res["varr"].append(dict())
            temp = [
                res["types"][str(temp_tp)],
                str(temp_varr.address).split(" ")[0]
            ]
            array.append(temp)
            queue.append(("["+str(i)+"]",temp_varr))
    return array

def struct_handler(varr, tp):
    fields = tp.fields()
    struct = dict()
    global queue, res
    for key in fields:
        temp_varr = varr[key]
        temp_tp = temp_varr.type
        temp_varr, temp_tp = pointer_handler(temp_varr, temp_tp)
        if temp_varr is None:
            struct[key.name] = [res["types"]["NULL"], "0x0"]
        else:
            if str(temp_tp) not in res["types"]:
                res["types"][str(temp_tp)] = len(res["varr"])
                res["varr"].append(dict())
            struct[key.name] = [
                res["types"][str(temp_tp)],
                str(temp_varr.address).split(" ")[0]
            ]
            queue.append((key.name,temp_varr))
    return struct

def add_varr(varr):
    global queue, res
    tp = varr.type
    varr, tp = pointer_handler(varr, tp)
    if varr is None:
        return None

    try:
        basename = get_basename(tp)
        if basename in supported_handlers:
            handler =  supported_handlers[basename](basename,varr)
            container = []
            if hasattr(handler, 'display_hint'):
                if handler.display_hint() == "string":
                    return handler.to_string()
            for child in handler.children():
                temp_varr, temp_tp = pointer_handler(child[1],child[1].type)
                if temp_varr is None:
                    break
                else:
                    if str(temp_tp) not in res["types"]:
                        res["types"][str(temp_tp)] = len(res["varr"])
                        res["varr"].append(dict())
                    container.append([
                        res["types"][str(temp_tp)],
                        str(temp_varr.address).split(" ")[0]
                    ])
                    queue.append((child[0],temp_varr))
            return container

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

def get_basename(tp):
    basename = None
    tag = get_basic_type(tp)
    if tag is not None:
        compiled_rx = re.compile('^([a-zA-Z0-9_:]+)(<.*>)?$')
        match = compiled_rx.match(tag)
        if match is not None:
            basename = match.group(1)
    return basename

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
    global queue, res
    queue = []
    res = {
        "binary" : gdb.inferiors()[0].progspace.filename.split("/")[-1],
        "types" : {
            "NULL" : 0,
        },
        "varr" : [
            {
                "0x0" : [
                    "nullptr",
                    None
                ]
            }
        ]
    }
    for block in blocks:
        for key in block:
            temp_varr, temp_tp = pointer_handler(key.value(frame),key.value(frame).type)
            queue.append((key.name,temp_varr))
    while len(queue) != 0:
        try:
            name,varr = queue[0]
            tp = varr.type
            addr = str(varr.address).split(" ")[0]

            if str(tp) not in res["types"].keys():
                res["types"][str(tp)] = len(res["varr"])
                res["varr"].append(dict())
            
            if addr not in res["varr"][res["types"][str(tp)]]:
                res["varr"][res["types"][str(tp)]][addr] = [
                    name,
                    add_varr(varr)
                ]
            queue.pop(0)
        except:
            queue.pop(0)
            print(traceback.format_exc())
            continue
    return res
