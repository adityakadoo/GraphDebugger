import gdb

gdb.Breakpoint("main")
gdb.execute("start")

frame = gdb.newest_frame()
symtab_and_line = frame.find_sal()
symbol_table = symtab_and_line.symtab
line_table = symbol_table.linetable()

line_list = line_table.source_lines()

line_dict_str = "response = "+str({"line_numbers":line_list})
file = open("python_scripts/lines.py","w")
file.write(line_dict_str)
file.close()