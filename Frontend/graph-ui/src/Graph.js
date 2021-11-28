import React, { useState, useRef, Component, createClass } from "react";
import Graph from "react-graph-vis";
import axios from 'axios'
import Form2 from './from2'
import { v4 as uuidv4 } from 'uuid'
import './graph_style.css'
import { Multiselect } from "multiselect-react-dropdown";
import options from "./GraphOptions";


const api = axios.create({
  baseURL: 'http://localhost:8000/gdb/graph/'
})

//global variables
var Mynode = [];
var clusterNode = [];
var cluster_ids = [];
var count = 1;
//var nodedata = {"Select Node":""};
let textInput;
let node_feature_list = [];
var labels = [];
var searchdata = {
}
var searchdata1 = {}
var high_color = "#FF7F7F";


function randomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

function clusterbyid(Object) {
  if (typeof (Object) == "undefined") return;
  if (clusterNode.length < 2) return;

  //console.log("hare1");
  var cidoptions = {
    joinCondition: function (childOptions) {
      //console.log(childOptions)
      for (var i = 0; i < clusterNode.length; i++) {
        if (childOptions.id == clusterNode[i]) {
          childOptions.cid = count;
        }
      }
      return childOptions.cid == count;
    },
    clusterNodeProperties: { id: 'Grp' + String(count), label: 'group' + String(count), borderWidth: 3, shape: 'box' }

  }
  //console.log(Object);
  Object.cluster(cidoptions);
  //console.log(Object);
  cluster_ids.push('Grp' + String(count));
  clusterNode = [];
  count = count + 1;
}

function destroy(Object) {
  //console.log(clusterNode.length)
  if (clusterNode.length == 0) return;
  for (var i = 0; i < clusterNode.length; i++) {
    if (typeof (clusterNode[i]) != 'string') continue;
    for (var j = 0; j < cluster_ids.length; j++) {
      if (cluster_ids[j] == clusterNode[i]) {
        cluster_ids.splice(j, 1);
      }
    }
    Object.openCluster(clusterNode[i]);
  }
  clusterNode = [];
}


//handle create click
function handleClick1(Object, event) {
  event.stopPropagation();
  clusterbyid(Object);
}
//handle destroy click
function handleClick2(Object, event) {
  event.stopPropagation();
  destroy(Object);
}


function handleClick3(data, event) {
  event.stopPropagation();
  console.log(data.Nodedata);
  // data.Nodedata.forEach(item=>{

  //   item.members.map((member)=>{

  //     if(member.location&&member.location[0]){

  //       //Do whatever, maybe you want to use return statement in there
  //       console.log(member.location)
  //     }
  //     else{

  //       //do something else, or add more conditions
  //       console.log("There's no location in it")
  //     }
  //   })
  // })
}

function handleclick4(data1, event) {
  event.stopPropagation();
  console.log("reaching");
}
function handleChangedatan(i, e) {
  console.log("reached")
  var dictg
  Object.keys(searchdata1).map(function (key, index) {
    console.log(index)
    console.log(key)
    console.log(searchdata1[key])
    console.log("done")
  })
  Object.entries(searchdata1).map(function (key, value) {
    console.log(value)
    console.log(key)
  })
  searchdata1[i] = e.target.value;
}
function handleChangedatat(i, e) {
  searchdata1[searchdata1[i]] = e.target.value;
}
function handleadd(data, event) {
  event.stopPropagation();
  console.log("reached")
  var x = document.getElementById("txt_1").value;
  var y = document.getElementById("txt_2").value;
  searchdata1[x] = y;
  document.getElementById("txt_1").value = "";
  console.log(x)
  document.getElementById("txt_2").value = "";
  console.log(y)
  console.log(searchdata1);
}
function handlerevert(data, event) {
  event.stopPropagation();
  searchdata1 = {};
}
function handlesubmit(data, event) {
  event.stopPropagation();
  searchdata = searchdata1;
  searchdata1 = {};
}

function disp_data(Object, data, nodes) {
  var tempdata = {};
  console.log(nodes.length == 1)
  if (nodes.length != 1) {
    //console.log("skk")
    tempdata = { "Selct Node": "" }
    return tempdata;
  }
  //console.log("heer");
  if (typeof (nodes[0]) == 'string') {
    var temparray = Object.getNodesInCluster(nodes[0]);

    var grp_nodes = "";
    var grp_groups = "";
    for (var i = 0; i < 2; i++) {
      console.log(temparray['length'], i);
      if (typeof (temparray[i]) == 'string') {

        grp_groups += temparray[i] + "\n";
      }
      else {
        console.log("here")
        grp_nodes += 'Node:' + temparray[i] + "\n";
      }
    }
    tempdata = {
      "Nodes": grp_nodes,
      "Groups": grp_groups
    };
    return tempdata;
    //return(Object.getNodesInCluster(nodes[0]));
  }
  else {
    tempdata = data.Nodedata[nodes[0]];
    console.log(tempdata);
    return tempdata;
  }
}

//options for the graph




const MyGraph = () => {

  let data;
  //var Mynode  = [];
  var MyEdge = [];

  axios.get('http://localhost:8000/gdb/graph/')
    .then((res) => {
      data = res.data
      console.log(data)
      node_feature_list = []
      if (Object.keys(data.Nodedata[1])) {
        Object.entries(data.Nodedata[1]).map(([key1, value1]) => node_feature_list.push(key1))
      }
      Mynode = data.nodes;
      MyEdge = data.edge_list;
    });

  const disp_node = (Object, nodes) => {

    setState(({ nodedata, ...rest }) => {
      var temp_data = disp_data(Object, data, nodes);
      return {
        nodedata: temp_data,
        ...rest
      }


    }
    )
  }

  const createNode1 = () => {
    setState(({ graph: { nodes, edges }, counter, ...rest }) => {
      for (var i = 0; i < Mynode.length; i++) {
        var labelstr = '';
        labelstr += Mynode[i].label + "\n";
        for (var j = 0; j < labels.length; j++) {
          labelstr += labels[j] + ":" + data.Nodedata[Mynode[i].id][labels[j]] + "\n";
        }
        var found = true;
        if (Object.keys(searchdata).length == 0) found = false;
        if (found) {
          for (const [key, value] of Object.entries(searchdata)) {
            if (data.Nodedata[Mynode[i].id][key] != value) {
              found = false;
              break;
            }
          }
        }
        Mynode[i].color = '#ADD8E6';
        if (found) {
          Mynode[i].color = high_color;
        }
        //console.log(data.Nodedata[1] , labelstr);
        Mynode[i].label = labelstr;
      }
      return {
        graph: {
          nodes: Mynode,
          edges: edges
        },

        ...rest
      }
    }
    );
  }

  const createNode = (Object1) => {

    axios.get('http://localhost:8000/gdb/graph/')
      .then((res) => {
        data = res.data
        //console.log(data.Nodedata);
      });

    const color = randomColor();
    setState(({ graph: { nodes, edges }, counter, ...rest }) => {
      for (var k = 0; k < cluster_ids.length; k++) {
        //console.log(Object1);
        Object1.openCluster(cluster_ids[k]);
      }
      cluster_ids = [];

      Mynode = data.nodes;
      MyEdge = data.edge_list;
      for (var i = 0; i < Mynode.length; i++) {
        var labelstr = '';
        labelstr += Mynode[i].label + "\n";
        for (var j = 0; j < labels.length; j++) {
          labelstr += labels[j] + ":" + data.Nodedata[Mynode[i].id][labels[j]] + "\n";
        }
        var found = true;
        if (Object.keys(searchdata).length == 0) found = false;
        if (found) {
          for (const [key, value] of Object.entries(searchdata)) {
            if (data.Nodedata[Mynode[i].id][key] != value) {
              found = false;
              break;
            }
          }
        }
        Mynode[i].color = '#ADD8E6';
        if (found) {
          Mynode[i].color = high_color;
        }
        //console.log(data.Nodedata[1] , labelstr);
        Mynode[i].label = labelstr;
      }
      return {

        graph: {
          nodes: Mynode,
          edges: MyEdge
        },

        ...rest
      }
    });
  }




  const [state, setState] = useState({
    nodedata: { "select Node": "" },
    counter: 5,
    graph: {
      nodes: Mynode,
      edges: MyEdge

    },
    events: {
      selectNode: ({ nodes, edges }) => {
        //console.log("Selected nodes:");
        //console.log(nodes);
        //console.log(nodedata[1]['data1']);

        //nodedata = data.Nodedata[nodes];  
        //if(typeof nodedata == 'undefined'){
        //  nodedata = {"No DATA":""};
        //}

      },
      click: ({ pointer: { canvas } }) => {

        //nodedata = {"Select Node":""};

      },
      select: function (event) {
        var { nodes, edges } = event;
        disp_node(this, nodes);
        clusterNode = nodes;
        textInput = this;
      },
      doubleClick: function () {
        createNode(this);
        //textInput=this;
        //textInput.current.focus();



        //console.log(textInput);
        //console.log(typeof(textInput))
      }
    }
  })
  const { graph, events, nodedata } = state;

  let [graphKey, setGraphKey] = useState(uuidv4);

  // const receiveValue = (value) => {console.log("value received from B",value)}

  return (


    <div className="row">

      <div className="form-style">
        <Form2 />

        <legend><span className="number">2</span> Node Info</legend>


        {
          Object.entries(nodedata)
            .map(([key, value]) =>
              <h3>{key}:{value}</h3>
            )
        }
        <legend><span className="number">3</span> Clustering</legend>
        {
          // Object.entries(clusterNode)
          // .map( ([key, value]) => 
          // Object.entries(Mynode)
          // .map( ([key1,value1]) =>
          // <h3 >{value} : {key1}</h3> ))
        }



        <button
          onClick={(e) => {
            handleClick1(textInput, e);
          }}
        > Create
        </button>

        <button
          onClick={(e) => {
            handleClick2(textInput, e);
          }}
        > Destroy
        </button>
        {/* <div>
        <Example />
        </div> */}

        {/* <button 
              onClick={(e)=>{
                handleclick4(data,e);
              }}>DISPLAY</button>  */}
        <legend><span className="number">4</span> Labelling</legend>
        <form>
          <label className="name">Variable Names</label>
          <Multiselect
            isObject={false}
            id="mselect"
            onSelect={(event) => (
              labels = event,
              createNode1()
            )}
            onRemove={(event) => (
              labels = event,
              createNode1()
            )}
            options={node_feature_list}
          />
        </form>


        <legend><span className="number">5</span> Highlight Nodes</legend>
        {/* <label className="name">Variable Name</label> */}

        <input type="text" placeholder="Query Variable *" id="txt_1" />

        {/* <label className="name">Variable Value</label> */}

        <input type="text" placeholder="Query Value *" id="txt_2" />


        <p><button onClick={e => { handleadd(data, e) }}>Add</button></p>


        <p><button onClick={e => { handlerevert(data, e) }}>Revert</button></p>


        <p><button onClick={e => (handlesubmit(data, e), createNode1())}>Submit</button></p>




      </div>
      <div className="main">
        <Graph graph={graph} options={options} events={events} style={{ height: "100vh" }} />


      </div>
    </div>


  );

}

export default MyGraph;