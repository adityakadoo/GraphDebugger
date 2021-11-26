import React, { useState ,useRef, Component,createClass } from "react";

import Graph from "react-graph-vis";

import axios from 'axios'
import { render } from "@testing-library/react";
import Form2 from './from2'
import { v4 as uuidv4 } from 'uuid'
//import { data } from "vis-network";
import './graph_style.css'




const api = axios.create({
  baseURL : 'http://localhost:8000/gdb/graph/'
})

//global variables
var Mynode = [];
var clusterNode = [];

var count = 1;
var nodedata = {"Select Node":""};
let textInput;

var labels = ['data1','data2'];
var searchdata = {
  "data1": '12',
  
}
var high_color = "#FF7F7F";

function randomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

function clusterbyid(Object){
  if(typeof(Object)=="undefined") return;
  if(clusterNode.length<2) return;
  
  //console.log("hare1");
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
//console.log(Object);
Object.cluster(cidoptions);
//console.log(Object);
count=count+1;
}

function destroy(Object){
  //console.log(clusterNode.length)
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

function handleClick3(data,event){
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

function disp_data(Object,data,nodes){
  var selectdata={};
  console.log(nodes.length == 1)
  if(nodes.length !=1 ){
    console.log("skk")
    return selectdata;
  }
  console.log("heer");
  if(typeof(nodes[0])=='string'){
    selectdata=Object.getNodesInCluster(nodes[0]);
    console.log(selectdata);
    //return(Object.getNodesInCluster(nodes[0]));
  }
  else{
    console.log(data.Nodedata[nodes[0]]);
    return(data.Nodedata[nodes[0]]);
  }
}

//options for the graph
const options = {
  interaction: { multiselect: true},
  layout: {
    hierarchical: false
  },
  edges:{
    arrows: {
      to: {
        enabled: true,
        imageHeight: undefined,
        imageWidth: undefined,
        scaleFactor: 1,
        src: undefined,
        type: "arrow"
      },
      middle: {
        enabled: false,
        imageHeight: 32,
        imageWidth: 32,
        scaleFactor: 1,
        src: "https://visjs.org/images/visjs_logo.png",
        type: "image"
      },
      from: {
        enabled: false,
        imageHeight: undefined,
        imageWidth: undefined,
        scaleFactor: 1,
        src: undefined,
        type: "arrow"
      }
    },
    endPointOffset: {
      from: 0,
      to: 0
    },
    arrowStrikethrough: true,
    chosen: true,
    color: {
      color:'#848484',
      highlight:'#848484',
      hover: '#848484',
      inherit: 'from',
      opacity:1.0
    },
    dashes: false,
    font: {
      color: '#343434',
      size: 14, // px
      face: 'arial',
      background: 'none',
      strokeWidth: 2, // px
      strokeColor: '#ffffff',
      align: 'horizontal',
      multi: false,
      vadjust: 0,
      bold: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        vadjust: 0,
        mod: 'bold'
      },
      ital: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        vadjust: 0,
        mod: 'italic',
      },
      boldital: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        vadjust: 0,
        mod: 'bold italic'
      },
      mono: {
        color: '#343434',
        size: 15, // px
        face: 'courier new',
        vadjust: 2,
        mod: ''
      }
    },
    hidden: false,
    hoverWidth: 1.5,
    label: undefined,
    labelHighlightBold: true,
    length: undefined,
    physics: true,
    scaling:{
      min: 1,
      max: 15,
      label: {
        enabled: true,
        min: 14,
        max: 30,
        maxVisible: 30,
        drawThreshold: 5
      },
      customScalingFunction: function (min,max,total,value) {
        if (max === min) {
          return 0.5;
        }
        else {
          var scale = 1 / (max - min);
          return Math.max(0,(value - min)*scale);
        }
      }
    },
    selectionWidth: 1,
    selfReferenceSize: 20,
    selfReference:{
        size: 20,
        angle: Math.PI / 4,
        renderBehindTheNode: true
    },
    shadow:{
      enabled: false,
      color: 'rgba(0,0,0,0.5)',
      size:10,
      x:5,
      y:5
    },
    smooth: {
      enabled: true,
      type: "dynamic",
      roundness: 0.5
    },
    title:undefined,
    value: undefined,
    width: 1,
    widthConstraint: false
  },

  nodes:{
    shape:'box',
  },
  height: "500px"
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
        nodedata = data.Nodedata;
      });
      
  const createNode = () => {
    axios.get( 'http://localhost:8000/gdb/graph/')
      .then((res)=>{
        data=res.data
        console.log(data.Nodedata);
      });

    const color = randomColor();
    setState(({ graph: { nodes, edges }, counter, ...rest }) => {
     
     
      Mynode  = data.nodes;
      MyEdge = data.edge_list;
      nodedata = JSON.stringify(data.Nodedata);
      for(var i =0;i<Mynode.length;i++){
        var labelstr = '';
        for(var j=0;j<labels.length;j++){
          labelstr += labels[j]+ ":" +  data.Nodedata[Mynode[i].id][labels[j]] + '\n';  
        }
        var found = true;
        if(searchdata.lenght == 0) found = false;
        if(found){
        for (const [key, value] of Object.entries(searchdata)) {
          if(data.Nodedata[Mynode[i].id][key] != value){
            found = false;
            break;
          }
        }
        }
        if(found){
          Mynode[i].color = high_color;
        }
        //console.log(data.Nodedata[1] , labelstr);
        Mynode[i].label=labelstr;
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
    
    counter: 5,
    graph: {
       nodes:Mynode, 
       edges:MyEdge
      
    },
    events: {
      selectNode: ({ nodes, edges }) => {
        //console.log("Selected nodes:");
        //console.log(nodes);
        //console.log(nodedata[1]['data1']);
        
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
        disp_data(this,data,nodes);
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
  
 // const receiveValue = (value) => {console.log("value received from B",value)}

  return (
      
        
        <div className="row">
        
         
        <Form2/>  
        <div className="main">  
        <h1> Node Info </h1>  
        
        
        {
        //data
            



        // Object.entries(nodedata)
        // .map( ([key, value]) => 
        // <h3 >{key} : {value}</h3> )
        
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
            console.log("3");
          handleClick3(data,e);
        }}
        > Test
        </button>

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
        
    
    
   
     
     <Graph graph={graph} options={options} events={events} style={{ height: "70vh" }} />
     </div> 
     </div> 
      
       
  );

} 

export default MyGraph;