import React from "react";
import './styles.css'
import axios from 'axios'

class Form2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
       "format":"Adj-List", 
        Graph:"",
        graph:"", 
        Node:"",
        nodelist:"",
        neighbours:"",
        Edge: "",
        edgelist: "",
        from: "",
        to: "",
        edgemap: "",        
        Nodefeatures:[{dataname:"",datatype:""}],
        done:true
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangedatan(i,e){
    let Nodefeatures = this.state.Nodefeatures;
     Nodefeatures[i].dataname =e.target.value;
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
    Graph = e.target.value;
    this.setState({Graph});
  }
  handleChangeGraphobj(e){
    let graph = this.state.graph;
    graph = e.target.value;
    this.setState({graph});
  }
  handleChangeNode(e){
    let Node = this.state.Node;
    Node = e.target.value;
    this.setState({Node});
  }
  handleChangenodelist(e){
    let nodelist = this.state.nodelist;
    nodelist = e.target.value;
    this.setState({nodelist});
  }
  handleChangeneighbours(e){
    let neighbours = this.state.neighbours;
    neighbours = e.target.value;
    this.setState({neighbours});
  }
  handleChangeedge(e){
    let Edge = this.state.Edge;
    Edge = e.target.value;
    this.setState({Edge});
  }
  handleChangeedgelist(e){
    let edgelist = this.state.edgelist;
    edgelist = e.target.value;
    this.setState({edgelist});
  }
  handleChangefrom(e){
    let from = this.state.from;
    from = e.target.value;
    this.setState({from});
  }
  handleChangeto(e){
    let to = this.state.to;
    to = e.target.value;
    this.setState({to});
  }
  handleChangeedgemap(e){
    let edgemap = this.state.edgemap;
    edgemap = e.target.value;
    this.setState({edgemap});
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
  handleSubmit(event) {
    event.preventDefault();
    let done = false;
    this.setState({done});
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


  render() {
    
    return (

        <form  onSubmit={this.handleSubmit}>
            <p className="head" ><label className="hname">Graph</label></p>


        <div className="form-inline">

            <p><label className="name">Graph Class Name</label>
            <input className="inp" type="text"  value={this.state.Graph ||""} onChange={e => this.handleChangeGraph(e)}/></p>
            
            <p><label className="name">Graph Object Name</label>
            <input className="inp" type="text"  value={this.state.graph ||""} onChange={e => this.handleChangeGraphobj(e)}/></p>
            
            <p><label className="name">Node Class Name</label>
            <input className="inp" type="text"  value={this.state.Node ||""} onChange={e => this.handleChangeNode(e)}/></p>
            
            <p><label className="name">Nodelist Name</label>
            <input className="inp" type="text"  value={this.state.nodelist ||""} onChange={e => this.handleChangenodelist(e)}/></p>
        
        </div>  


        <div className="form-inline"> 

            <label className="name">
             Choose Format of Graph:
            <select value={this.state.format} onChange={e=>this.handleChangelist(e)}>
              <option value="Adj-List">Adj-List</option> 
              <option value="Edge-List">Edge-List</option> 
              <option value="Edge-Map">Edge-Map</option> 
            </select>
            </label>

        </div>


        <div className="form-inline">

          {this.state.format==="Adj-List" && (
            <p><label className="name"> Neighbours Name</label>
            <input className="inp" type="text"  value={this.state.neighbours ||""} onChange={e => this.handleChangeneighbours(e)}/></p>
          )}
          {this.state.format==="Edge-List" && (
            <p><label className="name"> Edge Name</label>
            <input className="inp" type="text"  value={this.state.Edge ||""} onChange={e => this.handleChangeedge(e)}/></p>            
          )}
          {this.state.format==="Edge-Map" && (
            <p><label className="name"> Edge Name</label>
            <input className="inp" type="text"  value={this.state.Edge ||""} onChange={e => this.handleChangeedge(e)}/></p>            
          )}          
          {this.state.format==="Edge-List" && (
            <p><label className="name"> Edgelist Name</label>
            <input className="inp" type="text"  value={this.state.edgelist ||""} onChange={e => this.handleChangeedgelist(e)}/></p>
          )}
          {this.state.format==="Edge-List" && (
            <p><label className="name"> from Node Name</label>
            <input className="inp" type="text"  value={this.state.from ||""} onChange={e => this.handleChangefrom(e)}/></p>
          )}
          {this.state.format==="Edge-List" && (  
            <p><label className="name"> to Node Name</label>
            <input className="inp" type="text"  value={this.state.to ||""} onChange={e => this.handleChangeto(e)}/></p>            
          )}
          {this.state.format==="Edge-Map" && (  
            <p><label className="name"> edgemap Name</label>
            <input className="inp" type="text"  value={this.state.edgemap ||""} onChange={e => this.handleChangeedgemap(e)}/></p>
          )}  

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