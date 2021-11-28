import React, { useState ,useRef, Component,createClass } from "react";

import Graph from "react-graph-vis";

import axios from 'axios'
import { getByDisplayValue, render } from "@testing-library/react";
import Form2 from './from2'
import { v4 as uuidv4 } from 'uuid'
//import { data } from "vis-network";
import './graph_style.css'
import { ConnectionLineType } from "react-flow-renderer";
import ReactDOM from "react-dom";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import {Multiselect} from "multiselect-react-dropdown";
import Select from "react-select";



const api = axios.create({
  baseURL : 'http://localhost:8000/gdb/graph/'
})

//global variables
var Mynode = [];
var clusterNode = [];
var cluster_ids=[];
var Node_groups={}; 
var count = 1;
//let nodedata;
let textInput;
let node_feature_list=[]; 
var labels = [];
var searchdata = {
  "data1": '8',
  
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
    clusterNodeProperties: {id:'Grp'+String(count),label:'group'+String(count), borderWidth:3, shape:'box'}

}
//console.log(Object);
Object.cluster(cidoptions);
console.log(Object);
cluster_ids.push('Grp'+String(count));
clusterNode = [];
count=count+1;
}

function destroy(Object){
  //console.log(clusterNode.length)
  if(clusterNode.length==0) return;
  for(var i = 0; i< clusterNode.length;i++){
    if(typeof(clusterNode[i])!='string') continue;
    for(var j = 0; j<cluster_ids.length ; j++){
      if(cluster_ids[j]==clusterNode[i]){
        cluster_ids.splice(j,1);
      }
    }
    Object.openCluster(clusterNode[i]);
    
  }
  clusterNode = [];
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

function handleclick4(data1,event) {
  event.stopPropagation();
  console.log("reaching");
}


function disp_data(Object,data,nodes){
  var tempdata={};
  console.log(nodes.length == 1)
  if(nodes.length !=1 ){
    //console.log("skk")
    tempdata = {"Selct Node":""}
    return tempdata;
  }
  //console.log("heer");
  if(typeof(nodes[0])=='string'){
    var temparray = Object.getNodesInCluster(nodes[0]);
    
    var grp_nodes = "";
    var grp_groups = "";
    for(var i =0; i<2;i++){
      console.log(temparray['length'],i);
      if(typeof(temparray[i])=='string'){
        
        grp_groups += temparray[i]+"\n";
      }
      else{
        console.log("here")
        grp_nodes+= 'Node:'+temparray[i]+"\n";
      }
    }
    tempdata = {
      "Nodes":grp_nodes,
      "Groups":grp_groups
    };
    return tempdata;
    //return(Object.getNodesInCluster(nodes[0]));
  }
  else{
    
    tempdata = data.Nodedata[nodes[0]];
    console.log(tempdata);
    return tempdata;
  }
}

// function getdisp(){
//   if( typeof(nodedata) == 'undefined') nodedata = {"Select":"data"};
//   return(
//     <ul>
//      { Object.entries(nodedata)
//         .map( ([key, value]) => 
//         <h3 >{key} : {value}</h3> )
//      }
//     </ul>
//   )
// }


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
    //selfReferenceSize: 20,
    selfReference:{
        size: 0,
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
  
  let data;
  //var Mynode  = [];
  var MyEdge = [];
  //let nodedata;
  axios.get('http://localhost:8000/gdb/graph/')
      .then((res)=>{
        data=res.data
        console.log(data)
        node_feature_list=[]
        if(Object.keys(data.Nodedata[1])){
          Object.entries(data.Nodedata[1]).map(([key1,value1]) =>node_feature_list.push(key1))
        } 

        Mynode  = data.nodes;
        MyEdge = data.edge_list;
        //nodedata = data.Nodedata;
      });

  
  const disp_node = (Object,nodes) => {
    
    setState(({ nodedata,...rest }) => {
      var temp_data = disp_data(Object,data,nodes);
      return{
        nodedata:temp_data,
        ...rest
      }

      
    }
    )
  }    

  const createNode = (Object1) => {
    axios.get( 'http://localhost:8000/gdb/graph/')
      .then((res)=>{
        data=res.data
        //console.log(data.Nodedata);
      });
      //console.log(Object1);
    const color = randomColor();
    setState(({ graph: { nodes, edges }, counter, ...rest }) => {
      for(var k =0;k<cluster_ids.length;k++){
        Object1.openCluster(cluster_ids[k]);
      }
      cluster_ids = [];
      Mynode  = data.nodes;
      MyEdge = data.edge_list;
      // for(var i = 0; i<Mynode.length ;i++){
        
      //   var temp_nodes = Object1.findNode(Mynode[i].id);
      //   for(var j = 0; j<MyEdge.length ;j++){
      //     if(Mynode[i].id== MyEdge[j].to){
      //       MyEdge[j].to = temp_nodes[0];
      //     }
      //     if(Mynode[i].id== MyEdge[j].from){
      //       MyEdge[j].from = temp_nodes[0];
      //     }
      //   }
      // }
      //nodedata = JSON.stringify(data.Nodedata);
      for(var i =0;i<Mynode.length;i++){
        var labelstr = '';

          labelstr += Mynode[i].label + "\n";

        
        for(var j=0;j<labels.length;j++){
          labelstr += labels[j]+ ":" +  data.Nodedata[Mynode[i].id][labels[j]] + "\n";  
        
      } 
        var found = true;
        if(searchdata.length == 0) found = false;
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
    nodedata:{"select Node":""},
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
        //disp_data(this,data,nodes);
        
        //if(typeof(nodedata) == 'undefined'){
        //  nodedata = {"No DATA":""};
        //}
       

      },
      click: ({ pointer: { canvas } }) => {
        
        //nodedata = {"Select Node":""};
        
      },
      select: function(event) {
        var { nodes, edges } = event;
        disp_node(this,nodes);
        //disp_data(this,data,nodes);
        clusterNode = nodes;
        textInput=this;
      },
      doubleClick:function(){
        createNode(this);
        //console.log(this);
        //textInput=this;
        //textInput.current.focus();
        

        
        //console.log(textInput);
        //console.log(typeof(textInput))
       }
    }
  })
  const { graph, events,nodedata} = state;
  
  let [graphKey, setGraphKey] = useState(uuidv4);
  
 // const receiveValue = (value) => {console.log("value received from B",value)}

  return (
      
        
        <div className="row">
        
        <div className="form-style">
        <Form2/>  
        
        <legend><span className="number">2</span> Node Info</legend>  
        
        
        {
          Object.entries(nodedata)
          .map(([key,value])=>
          <h3>{key}:{value}</h3>
          )
        }
        

        
        
        
        
         
        <label> Create Group </label>
        {
        //   Object.entries(clusterNode)
        //   .map( ([key, value]) => 
        //   Object.entries(Mynode)
        //   .map( ([key1,value1]) =>
        //   <h3 >{value} : {key1}</h3> ))
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
        {/* <div>
        <Example />
        </div> */}

            {/* <button 
              onClick={(e)=>{
                handleclick4(data,e);
              }}>DISPLAY</button>  */}
             <form>
                <label className="name">Variable Names</label>
                <Multiselect 
                isObject={false}
                id="mselect"
                onSelect={(event)=>(
                  labels=event,
                  createNode()
                  )}
                 onRemove={(event)=>(
                   labels=event,
                   createNode()
                 )}
                 options={node_feature_list}
                 />
                 </form>
                 </div>
                 <div className="main"> 
     <Graph graph={graph} options={options} events={events} style={{ height: "100%" }} />


     </div> 
     </div> 
      
       
  );

} 

export default MyGraph;