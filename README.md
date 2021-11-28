# GraphDebugger

## A React based website to visualise graphs in a running C++ process using GDB's Python API

---

### Prerequisites

- You should have `pip`, `npm` and `gdb` installed on your PC.

---

### Installation

- Clone the Repository into the **home** directory on your PC
- Run the command `sudo bash install.sh` in the terminal, inside the project directory to install the packages required for the app.

---

### Usage

- Run the command `gdb-graph` or `gdb-graph <binary file name>` in your terminal to **start** the app and load it with the binary file that you want to debug.
- Some basic commands for using the app:

    1. `run-server` : To spawn the servers which can be used to view the graph application.
    2. `close-server` : To close down the servers spawned to run the app.
    3. `free-server` : a forced way to close the servers if you exited *gdb-graph* without using `close-server` command.

- After spawning the server you can use the usual *gdb* commands like breakpoints,continue to debug the file and the corresponding visuals of the Graph can be seen on `http://127.0.0.1:3000/` in your browser.

---

### User Interface

- Once the application is running, submit the **Graph** form with the **graph class type** and corresponding fields as mentioned in your C++ program.
- You can also click on the **Graph** heading to resubmit the form in case you made some errors while filling out the form.
- *Double click* anywhere on the canvas to get the updates of the graph.
- You can click on any Node to see its info in the **Node info** panel.
- You can select multiple nodes by clicking on the nodes while holding *Ctrl* and then click on *create* button in the **Clustering** panel to group/cluster them.
- Selecting any cluster and clicking on the *destroy* button will destroy the cluster into its constituent nodes.
- You can also choose the node data to be displayed as the *Node labels*.
- **Highlighting nodes** panel can be used to find/highlight nodes which obey the required properties mentioned by you.

---
