
import React, { useState , Component,createClass } from "react";

import Graph from "react-graph-vis";

import axios from 'axios'
//import { render } from "@testing-library/react";
import Form2 from './from2'

const api = axios.create({
  baseURL : 'http://localhost:8000/gdb/graph/'
})


const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000",
    selectionWidth: function (width) {return width*4;}
  }


};

function randomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

var nodedata = {"Select Node":""};

const MyGraph = () => {
  
  let data
  var Mynode  = [];
  var MyEdge = [];
    
  axios.get('http://localhost:8000/gdb/graph/')
      .then((res)=>{
        data=res.data
        console.log(data)
        Mynode  = data.nodes;
        MyEdge = data.edge_list;
        
      });
      
  const createNode = () => {
    axios.get('http://localhost:8000/gdb/graph/')
      .then((res)=>{
        data=res.data
        console.log(data)
        Mynode  = data.nodes;
        MyEdge = data.edgelist;
      });

    const color = randomColor();
    setState(({ graph: { nodes, edges }}) => {
      Mynode  = data.nodes;
      MyEdge = data.edge_list;
     
      
      
      return {
        
        graph: {
          nodes: Mynode,
          edges: MyEdge
        },
        
       
      }
    });
  }

 


  const [state, setState] = useState({
    
    counter: 5,
    graph: {
       nodes:Mynode, 
      
      //   { id: 1, label: "Node 1", color: "#e04141" },
      //   { id: 2, label: "Node 2", color: "#e09c41" },
      //   { id: 3, label: "Node 3", color: "#e0df41" },
      //   { id: 4, label: "Node 4", color: "#7be041" },
      //   { id: 5, label: "Node 5", color: "#41e0c9" }
      // ],
      edges:MyEdge,
      //  [
      //   { from: 1, to: 2 },
      //   { from: 1, to: 3 },
      //   { from: 2, to: 4 },
      //   { from: 2, to: 5 }
      // ]
    },
    events: {
      selectNode: ({ nodes,edges}) => {
        alert("nodeselected")
        console.log("Selected nodes:");
        console.log(nodes);
        console.log("Selected edges:");
        console.log(edges);
        
        nodedata = data.Nodedata[nodes];  
        if(typeof nodedata == 'undefined'){
          nodedata = {"No DATA":""};
        }
        createNode();
        //nodedata = {"Select Node":""};
      },
      doubleClick: ({ pointer: { canvas } }) => {
        createNode();
        //nodedata = {"Select Node":""};
      }
    }
  })
  const { graph, events } = state;
  
  
  
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

        
    </div>
    
     <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
      </div>
       
  );

} 

export default MyGraph;