import React from "react";
import './better_styles.css'
import axios from 'axios'

class Form2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "format": "Adj-List",
      Graph: "",
      graph: "",
      Node: "",
      nodelist: "",
      neighbours: "",
      Edge: "",
      edgelist: "",
      from: "",
      to: "",
      edgemap: "",
      done: true
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangelist(e) {
    let format = this.state.format;
    format = e.target.value;
    this.setState({ format });
  }
  handleChangeGraph(e) {
    let Graph = this.state.Graph;
    Graph = e.target.value;
    this.setState({ Graph });
  }
  handleChangeGraphobj(e) {
    let graph = this.state.graph;
    graph = e.target.value;
    this.setState({ graph });
  }
  handleChangeNode(e) {
    let Node = this.state.Node;
    Node = e.target.value;
    this.setState({ Node });
  }
  handleChangenodelist(e) {
    let nodelist = this.state.nodelist;
    nodelist = e.target.value;
    this.setState({ nodelist });
  }
  handleChangeneighbours(e) {
    let neighbours = this.state.neighbours;
    neighbours = e.target.value;
    this.setState({ neighbours });
  }
  handleChangeedge(e) {
    let Edge = this.state.Edge;
    Edge = e.target.value;
    this.setState({ Edge });
  }
  handleChangeedgelist(e) {
    let edgelist = this.state.edgelist;
    edgelist = e.target.value;
    this.setState({ edgelist });
  }
  handleChangefrom(e) {
    let from = this.state.from;
    from = e.target.value;
    this.setState({ from });
  }
  handleChangeto(e) {
    let to = this.state.to;
    to = e.target.value;
    this.setState({ to });
  }
  handleChangeedgemap(e) {
    let edgemap = this.state.edgemap;
    edgemap = e.target.value;
    this.setState({ edgemap });
  }
  handleChangeDone(e) {
    let done = this.state.done;
    done = true;
    this.setState({ done });
  }
  handleSubmit(event) {
    event.preventDefault();
    let done = false;
    this.setState({ done });
    var dict = {};
    dict = this.state;
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
    } catch (error) {
      console.log(error)
    }
  }


  render() {

    return (

      <form onSubmit={this.handleSubmit}>

        <legend onClick={e => this.handleChangeDone(e)}><span className="number">1</span> Graph</legend>

        <div>
          {this.state.done && (
            <label className="name">Graph formats:</label>
          )}
          {this.state.done && (
            <select value={this.state.format} onChange={e => this.handleChangelist(e)}>
              <option value="Adj-List">Adj-List</option>
              <option value="Edge-List">Edge-List</option>
              <option value="Edge-Map">Edge-Map</option>
            </select>
          )}

          {/* </div>


        <div className="form-inline"> */}


          {this.state.done && (
            <input type="text" placeholder="Graph Class *" value={this.state.Graph || ""} onChange={e => this.handleChangeGraph(e)} />
          )}
          {this.state.done && (
            <input type="text" placeholder="Graph Instance *" value={this.state.graph || ""} onChange={e => this.handleChangeGraphobj(e)} />
          )}
          {this.state.done && (
            <input type="text" placeholder="Node Class *" value={this.state.Node || ""} onChange={e => this.handleChangeNode(e)} />
          )}
          {this.state.done && (
            <input type="text" placeholder="Container for Nodes *" value={this.state.nodelist || ""} onChange={e => this.handleChangenodelist(e)} />
          )}
          {/* </div>  



        <div className="form-inline"> */}

          {this.state.done && this.state.format === "Adj-List" && (
            <input type="text" placeholder="Container for Adjacent Nodes *" value={this.state.neighbours || ""} onChange={e => this.handleChangeneighbours(e)} />
          )}
          {this.state.done && this.state.format === "Edge-List" && (
            <input type="text" placeholder="Edge Class *" value={this.state.Edge || ""} onChange={e => this.handleChangeedge(e)} />
          )}
          {this.state.done && this.state.format === "Edge-Map" && (
            <input type="text" placeholder="Edge Class *" value={this.state.Edge || ""} onChange={e => this.handleChangeedge(e)} />
          )}
          {this.state.done && this.state.format === "Edge-List" && (
            <input type="text" placeholder="Container for Edges *" value={this.state.edgelist || ""} onChange={e => this.handleChangeedgelist(e)} />
          )}
          {this.state.done && this.state.format === "Edge-List" && (
            <input type="text" placeholder="Source Node *" value={this.state.from || ""} onChange={e => this.handleChangefrom(e)} />
          )}
          {this.state.done && this.state.format === "Edge-List" && (
            <input type="text" placeholder="Target Node *" value={this.state.to || ""} onChange={e => this.handleChangeto(e)} />
          )}
          {this.state.done && this.state.format === "Edge-Map" && (
            <input type="text" placeholder="Map of Edges *" value={this.state.edgemap || ""} onChange={e => this.handleChangeedgemap(e)} />
          )}

        </div>

        <div className="button-section">
          {this.state.done && (
            <p><button className="buttonsubmit" type="submit">Submit</button></p>
          )}
        </div>


      </form>
    );
  }
}
export default Form2;