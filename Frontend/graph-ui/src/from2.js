import React from "react";
import './better_styles.css'
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
        <div className="form-style">
        <form  onSubmit={this.handleSubmit}>
          <legend><span className="number">1</span> Graph</legend>

        <div> 

            <label className="name">Graph formats:</label>
            <select value={this.state.format} onChange={e=>this.handleChangelist(e)}>
              <option value="Adj-List">Adj-List</option> 
              <option value="Edge-List">Edge-List</option> 
              <option value="Edge-Map">Edge-Map</option> 
            </select>

        {/* </div>


        <div className="form-inline"> */}

            {/* <p><label className="name">Graph Class Name</label> */}
            <input type="text" placeholder="Graph Class *" value={this.state.Graph ||""} onChange={e => this.handleChangeGraph(e)}/>
            
            {/* <p><label className="name">Graph Object Name</label> */}
            <input type="text" placeholder="Graph Instance *" value={this.state.graph ||""} onChange={e => this.handleChangeGraphobj(e)}/>
            
            {/* <p><label className="name">Node Class Name</label> */}
            <input type="text" placeholder="Node Class *" value={this.state.Node ||""} onChange={e => this.handleChangeNode(e)}/>
            
            {/* <p><label className="name">Nodelist Name</label> */}
            <input type="text" placeholder="Container for Nodes *" value={this.state.nodelist ||""} onChange={e => this.handleChangenodelist(e)}/>
            
        {/* </div>  



        <div className="form-inline"> */}

          {this.state.format==="Adj-List" && (
            <input type="text" placeholder="Container for Adjacent Nodes *" value={this.state.neighbours ||""} onChange={e => this.handleChangeneighbours(e)}/>
          )}
          {this.state.format==="Edge-List" && (
            <input type="text" placeholder="Edge Class *" value={this.state.Edge ||""} onChange={e => this.handleChangeedge(e)}/>           
          )}
          {this.state.format==="Edge-Map" && (
            <input type="text" placeholder="Edge Class *" value={this.state.Edge ||""} onChange={e => this.handleChangeedge(e)}/>
          )}          
          {this.state.format==="Edge-List" && (
            <input type="text" placeholder="Container for Edges *" value={this.state.edgelist ||""} onChange={e => this.handleChangeedgelist(e)}/>
          )}
          {this.state.format==="Edge-List" && (
            <input type="text" placeholder="Source Node *" value={this.state.from ||""} onChange={e => this.handleChangefrom(e)}/>
          )}
          {this.state.format==="Edge-List" && (
            <input type="text" placeholder="Target Node *" value={this.state.to ||""} onChange={e => this.handleChangeto(e)}/>
          )}
          {this.state.format==="Edge-Map" && (
            <input type="text" placeholder="Map of Edges *" value={this.state.edgemap ||""} onChange={e => this.handleChangeedgemap(e)}/>
          )}  

        </div>


        <legend><span className="number">2</span> Node Features</legend>
          
          {this.state.done && this.state.Nodefeatures.map((element, index) => (
           
           <div key={index}>
              
              {/* <label className="name1">Data Name</label> */}
              <input type="text" className="form-inline" placeholder="Variable Name *" value={element.dataname || ""} onChange={e => this.handleChangedatan(index, e)} />
              {/* <label className="name2">Data Type</label> */}
              <input type="text" className="form-inline" placeholder="Variable Type *" value={element.datatype || ""} onChange={e => this.handleChangedatat(index, e)} />
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
        

      </form></div>
    );
}
}
export default Form2;