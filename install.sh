#!/bin/bash

# installing necessary libraries
pip install -r requirements.txt
cd Frontend/graph-ui/ 
npm install
cd ../../

# configuring gdb-graph executable
touch /bin/gdb-graph
echo '#!/bin/sh
exec gdb -q -ex init-graph "$@"' > /bin/gdb-graph
echo "define init-graph
source ~/GraphDebugger/init_script.py
end
document init-graph
Initializes the GDB Graph Vizualizer
end" > ~/.gdbinit