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

var count = 1;
var nodedata = {"Select Node":""};
let textInput;
let node_feature_list=[]; 
var labels = [];
var searchdata = {
  "data1": '12'
  
}
var searchdata1 = {}
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

function handleclick4(data1,event) {
  event.stopPropagation();
  console.log("reaching");
}
function handleChangedatan(i,e){
  console.log("reached")
  var dictg
  Object.keys(searchdata1).map(function(key,index){
    console.log(index)
    console.log(key)
    console.log(searchdata1[key])
    console.log("done")
  })
Object.entries(searchdata1).map(function(key,value){
  console.log(value)
  console.log(key)
})
  searchdata1[i]=e.target.value;
}
function handleChangedatat(i,e){
  searchdata1[searchdata1[i]]=e.target.value;
}
function handleadd(data,event){
  event.stopPropagation();
  console.log("reached")
  var x=document.getElementById("txt_1").value;
  var y=document.getElementById("txt_2").value;
  searchdata1[x]=y;
  document.getElementById("txt_1").value="";
  console.log(x)
  document.getElementById("txt_2").value="";
  console.log(y)
  console.log(searchdata1);
}
function handlerevert(data,event){
  event.stopPropagation();
  searchdata1={};
}
function handlesubmit(data,event){
  event.stopPropagation();
  searchdata=searchdata1;
  searchdata1={};
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

};



const MyGraph = () => {
  
  let data
  //var Mynode  = [];
  var MyEdge = [];
  
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
      for(var i =0;i<Mynode.length;i++){
        var labelstr = '';
        labelstr += "Node :" +Mynode[i].id + '\n';
        for(var j=0;j<labels.length;j++){
          labelstr += labels[j]+ ":" +  data.Nodedata[Mynode[i].id][labels[j]] + '\n';  
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
        Mynode[i].color='#ADD8E6';
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
        
        <div className="form-style">
        <Form2/>  
        
        <legend><span className="number">2</span> Node Info</legend>  
        
        
        {
        //data
            



        Object.entries(nodedata)
        .map( ([key, value]) => 
        <h3 >{key} : {value}</h3> )
        
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
              <legend><span className="number">4</span> Labelling</legend>
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

            <form>      
                 <legend><span className="number">5</span> Highlight Nodes</legend>
        {/* <label className="name">Variable Name</label> */}
        
        <input type="text" placeholder="Query Variable *" id="txt_1" />
        
        {/* <label className="name">Variable Value</label> */}
        
        <input type="text" placeholder="Query Value *" id="txt_2" />
     
        
        <p><button   onClick={e=>{handleadd(data,e)}}>Add</button></p>
       
        
        <p><button   onClick={e=>{handlerevert(data,e)}}>Revert</button></p>
       
        
        <p><button   onClick={e=>(handlesubmit(data,e),createNode())}>Submit</button></p>
        
        </form>


                 </div>
                 <div className="main"> 
     <Graph graph={graph} options={options} events={events} style={{ height: "100vh" }} />


     </div> 
     </div> 
      
       
  );

} 

export default MyGraph;