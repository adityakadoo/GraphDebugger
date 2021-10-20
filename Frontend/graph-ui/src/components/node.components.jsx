import React from "react";
import ReactFlow from "react-flow-renderer";

const initialElement = [
    {id:'1', type: 'input', data:{label:'Node'}, position: {x:0,y:0}}
]

const MindNode = () => {
    return(
        <React.Fragment>
            <ReactFlow elements={initialElement}
            style={{width:'100',height: '90vh'}}/>
            <h1>Hello</h1>
        </React.Fragment>
    );
}

export default MindNode;