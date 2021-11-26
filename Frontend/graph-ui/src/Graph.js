import React, { useState ,useRef, Component,createClass } from "react";

import Graph from "react-graph-vis";

import axios from 'axios'
import { render } from "@testing-library/react";
import Form2 from './from2'
import { v4 as uuidv4 } from 'uuid'





const api = axios.create({
  baseURL : 'http://localhost:8000/gdb/graph/'
})

//global variables
var Mynode = [];
var clusterNode = [];

var count = 1;
var nodedata = {"Select Node":""};
let textInput;


function randomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

function clusterbyid(Object){
  if(typeof(Object)=="undefined") return;
  if(clusterNode.length<2) return;
  // for(var i = 0; i<clusterNode.length;i++){
  //   if(typeof(clusterNode[i])=='string'){
      
  //     //console.log(Object.getNodesInCluster(clusterNode[i]));
  //     continue;
  //   }
  //   Mynode[clusterNode[i]-1].cid = count;
  //   console.log(Mynode[clusterNode[i]-1]);
  // }
  console.log("hare1");
  var cidoptions={
    joinCondition:function(childOptions) {
        //console.log(childOptions)
        for(var i = 0; i<clusterNode.length;i++){
          if(childOptions.id==clusterNode[i]){
            childOptions.cid =count;
          } 
        }
        return childOptions.cid == count;
    },
    clusterNodeProperties: {id:'Grp'+String(count),label:'group'+String(count), borderWidth:3, shape:'box',widthConstraint: {
      minimum:200,
      maximum:200
    }}

}
console.log(Object);
Object.cluster(cidoptions);
console.log(Object);
count=count+1;
}

function destroy(Object){
  console.log(clusterNode.length)
  if(clusterNode.length==0) return;
  for(var i = 0; i< clusterNode.length;i++){
    if(typeof(clusterNode[i])!='string') continue;
    Object.openCluster(clusterNode[i]);
  }
}


//handle create click
function handleClick1(Object,event){
  event.stopPropagation();
  clusterbyid(Object);
}
//handle destroy click
function handleClick2(Object,event){
  event.stopPropagation();
  destroy(Object);
}

function InpForm() {
  const [name, setName] = useState("");

  return (
    <form>
      <label>Enter your name:
        <input
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
    </form>
  )
}


//options for the graph
const options = {
  interaction: { multiselect: true},
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
  }
};



const MyGraph = () => {
  
  let data
  //var Mynode  = [];
  var MyEdge = [];
  
  axios.get('http://localhost:8000/gdb/graph/')
      .then((res)=>{
        data=res.data
        console.log(data)
        Mynode  = data.nodes;
        MyEdge = data.edge_list;
        
      });
      
  const createNode = () => {
    axios.get( 'http://localhost:8000/gdb/graph/')
      .then((res)=>{
        data=res.data
        console.log(data)
      });

    const color = randomColor();
    setState(({ graph: { nodes, edges }, counter, ...rest }) => {
     
     
      Mynode  = data.nodes;
      MyEdge = data.edge_list;
      
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
    
    counter: 5,
    graph: {
       nodes:Mynode, 
       edges:MyEdge
      
    },
    events: {
      selectNode: ({ nodes, edges }) => {
        console.log("Selected nodes:");
        console.log(nodes);

        
        nodedata = data.Nodedata[nodes];  
        if(typeof nodedata == 'undefined'){
          nodedata = {"No DATA":""};
        }

      },
      click: ({ pointer: { canvas } }) => {
        
        nodedata = {"Select Node":""};
        
      },
      select: function(event) {
        var { nodes, edges } = event;
        clusterNode = nodes;
        textInput=this;
      },
      doubleClick:function(){
        createNode();
        //textInput=this;
        //textInput.current.focus();
        

        
        //console.log(textInput);
        //console.log(typeof(textInput))
       }
    }
  })
  const { graph, events} = state;
  
  let [graphKey, setGraphKey] = useState(uuidv4);
  
  return (
      
    
        <div>
        <div className="container">  
        <Form2/>   
        <h1> Node Info </h1>  
        
        
        {
        
        Object.entries(nodedata)
        .map( ([key, value]) => 
        <h3 >{key} : {value}</h3> )
        
        } 
        <h2> Create Group </h2>
        {
          // Object.entries(clusterNode)
          // .map( ([key, value]) => 
          // Object.entries(Mynode)
          // .map( ([key1,value1]) =>
          // <h3 >{value} : {key1}</h3> ))
        }


        <button 
          onClick={(e) => {
          handleClick1(textInput,e);
        }}
        > Create
        </button>
        
        <button 
          onClick={(e) => {
          handleClick2(textInput,e);
        }}
        > Destroy
        </button>
        
        
        <InpForm/>

    </div>
    
   
     <div>
     <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
     </div> 
     </div> 
      
       
  );

} 

export default MyGraph;