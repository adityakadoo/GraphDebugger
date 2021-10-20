import React from "react";
import './styles.css'
import axios from 'axios'

// import {writeJsonFile} from 'write-json-file';
//import fs from 'fs'

class Form2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
       format:"Adj-List",
       Graph:"",
       graph:"",
       Node:"",
       Nodefeatures:[{dataname:"",datatype:""}],
       Edge:null,
       Edgefeatures: [],
       done:true,
       nodelist:"",
       neighbours:""
     };
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChangedatan(i,e){
      let Nodefeatures = this.state.Nodefeatures;
      Nodefeatures[i].dataname=e.target.value;
      this.setState({Nodefeatures});
  }
  handleChangedatat(i,e){
    let Nodefeatures = this.state.Nodefeatures;
    Nodefeatures[i].datatype=e.target.value;
    this.setState({Nodefeatures});
  }
  handleChangelist(e){
    let format = this.state.format;
    format = e.target.value;
    this.setState({ format });
  }
  handleChangeGraph(e){
    let Graph = this.state.Graph;
    Graph=e.target.value;
    this.setState({Graph});
  }
  handleChangeGraphobj(e){
      let graph=this.state.graph;
      graph=e.target.value;
      this.setState({graph});
  }
  handleChangeNode(e){
    let Node=this.state.Node;
    Node=e.target.value;
    this.setState({Node});
  }
  addFormFields() {
    this.setState(({
    Nodefeatures: [...this.state.Nodefeatures, { dataname: "", datatype: "" }]
    }));
  }

  removeFormFields(i) {
    let Nodefeatures = this.state.Nodefeatures;
    Nodefeatures.splice(i, 1);
    this.setState({  Nodefeatures });
  }

  handleChangenodelist(e){
    let nodelist = this.state.nodelist;
    nodelist=e.target.value;
    this.setState({nodelist});
  }
  handleChangeneighbours(e){
    let neighbours = this.state.neighbours;
    neighbours=e.target.value;
    this.setState({neighbours});
  }


  handleSubmit(event) {
    event.preventDefault();
    this.state.done = false;
    var dict = {};
    dict=this.state;
    var new_node = this.state.Nodefeatures;
    var node_dict = {};
    for (var i=0; i < new_node.length; i++){
      var a_dict = new_node[i];
      node_dict[a_dict["dataname"]] = a_dict["datatype"];
    }
    dict["Nodefeatures"] = node_dict;
    console.log(dict);

    	try {
	  // make axios post request
    const json = JSON.stringify(dict);
	  const response = axios({
		method: "post",
		url: "http://localhost:8000/gdb/config/",
		data: json,
		headers: { "Content-Type": "application/json" },
	  });
	} catch(error) {
	  console.log(error)
	}
  }

    
    

    //const fs = require("fs");

    // fs.writeFile("config.json", "Writing content", (err) => {
    //    if (err) throw err;
    //    console.log("Completed!");
    // });



//   const handleSubmit = async() => {
// 	// store the states in the form data
// 	const loginFormData = new FormData();
// 	loginFormData.append("username", formValue.email)
// 	loginFormData.append("password", formValue.password)
  
// 	try {
// 	  // make axios post request
// 	  const response = await axios({
// 		method: "post",
// 		url: "/api/login",
// 		data: loginFormData,
// 		headers: { "Content-Type": "multipart/form-data" },
// 	  });
// 	} catch(error) {
// 	  console.log(error)
// 	}
//   }


  render() {
    
    return (

      

        <form  onSubmit={this.handleSubmit}>
            <p className="head" ><label className="hname">Graph</label></p>
           <div className="form-inline"> 
            <label className="name">
          Choose Format of Graph:
          <select value={this.state.format} onChange={e=>this.handleChangelist(e)}>
           <option value="Adj-List">Adj-List</option> 
           <option value="Edge-List">Edge-List</option> 
            <option value="Adj-Matrix-List">Adj-Matrix-List</option> 
          </select>
        </label>

            <p><label className="name">Graph Class Name</label>
            <input className="inp" type="text"  value={this.state.Graph ||""} onChange={e => this.handleChangeGraph(e)}/></p>
            
            <p><label className="name">Graph Object Name</label>
            <input className="inp" type="text"  value={this.state.graph ||""} onChange={e => this.handleChangeGraphobj(e)}/></p>
            
            <p><label className="name">Node Class Name</label>
            <input className="inp" type="text"  value={this.state.Node ||""} onChange={e => this.handleChangeNode(e)}/></p>
            
            <p><label className="name">Nodelist Name</label>
            <input className="inp" type="text"  value={this.state.nodelist ||""} onChange={e => this.handleChangenodelist(e)}/></p>

            <p><label className="name"> Neighbours Name</label>
            <input className="inp" type="text"  value={this.state.neighbours ||""} onChange={e => this.handleChangeneighbours(e)}/></p>
            
            </div>
            <p className="head" ><label className="hname">Node Features</label></p>
          {this.state.done && this.state.Nodefeatures.map((element, index) => (
           <div className="form-inline" key={index}>
              <label className="name1">Data Name</label>
              <input className="inp1" type="text" value={element.dataname || ""} onChange={e => this.handleChangedatan(index, e)} />
              <label className="name2">Data Type</label>
              <input className="inp1" type="text"  value={element.datatype || ""} onChange={e => this.handleChangedatat(index, e)} />
              {
                index ? 
                  <button className="buttonrem"  type="button"  onClick={() => this.removeFormFields(index)}>Remove</button> 
                : null
              }
               
            </div>
          ))}

         <div className="button-section">
              <button className="buttonadd" type="button" onClick={() => this.addFormFields()}>Add</button>
              <p><button className="buttonsubmit" type="submit">Submit</button></p>
          </div>
      </form>
    );
}
}
export default Form2;