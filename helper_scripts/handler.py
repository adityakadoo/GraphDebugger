import gdb

def pointer_handler(varr, tp):
    while(tp.code == gdb.TYPE_CODE_PTR):
        varr = varr.dereference()
        tp = varr.type
    return varr,tp

def array_handler(varr, tp):
    min,max = tp.range()
    array = []
    queue = []
    for i in range(min,max+1):
        temp_varr = varr[i]
        temp_tp = temp_varr.type
        temp_varr, temp_tp = pointer_handler(temp_varr, temp_tp)
        queue.append((temp_varr,"["+str(i)+"]"))
        temp = str(temp_tp)+" "+str(temp_varr.address).split(" ")[0]
        array.append(temp)
    return array,queue

def struct_handler(varr, tp):
    fields = tp.fields()
    struct = dict()
    queue = []
    for key in fields:
        temp_varr = varr[key]
        temp_tp = temp_varr.type
        temp_varr, temp_tp = pointer_handler(temp_varr, temp_tp)
        if(temp_tp.code == gdb.TYPE_CODE_ARRAY):
            struct[key.name], q = array_handler(temp_varr, temp_tp)
            for e in q:
                queue.append(e)
        else:
            struct[key.name] = str(temp_tp)+" "+str(temp_varr.address).split(" ")[0]
            queue.append((temp_varr,key.name))
    return struct,queue
