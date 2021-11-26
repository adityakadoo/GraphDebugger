#include<bits/stdc++.h>
using namespace std;

#define MAX_NODES 6

enum colour {RED, BLUE, GREEN};

float fff = 782.4342;

class Node{
    public:
        Node(){}
        Node(int i,char c,colour e,float f,bool b,string s){
            data1 = i;
            data2 = c;
            data3 = e;
            data4 = f;
            data5 = b;
            data6 = s;
        }
        
        //Adding neighbours
        void addNeighbour(Node *neighbour){
            neighbours.insert(neighbour);
        };

        // set of elements containing pointers to the neighbours of the node
        set<Node*> neighbours;

        //Data stored in the node
        int data1;
        char data2;
        colour data3;
        float data4;
        bool data5;
        string data6;
};

class Graph{
    public:
        set<Node*> nodes;

        Graph(){}
};

int main(/*int argc, char const *argv[]*/){

    //creating an instance of the graph object
    Graph graph = Graph();

    //Number of Nodes
    int n = 8;

    //Adding the nodes
    for(int i=0;i<n;i++){
        //any data can be stored in the nodes
        graph.nodes.insert(new Node(i*2,97+i,colour(i%3),(float)i/10,i%2,"index->"+to_string(i)));
    }

    // Adding the Edges
    for(auto it=graph.nodes.begin();it!=graph.nodes.end();it++){
        set<Node*>::iterator jt;
        if(it!=--graph.nodes.end()){
            jt = it; jt++;
        }
        else{
            jt = graph.nodes.begin();
        }
        (*it)->addNeighbour(*jt);
    }

    // graph.nodes[0]->addNeighbour(graph.nodes[1]);
    // graph.nodes[0]->addNeighbour(graph.nodes[2]);
    // graph.nodes[0]->addNeighbour(graph.nodes[3]);
    // graph.nodes[1]->addNeighbour(graph.nodes[4]);
    // graph.nodes[2]->addNeighbour(graph.nodes[4]);
    // graph.nodes[2]->addNeighbour(graph.nodes[5]);
    // graph.nodes[3]->addNeighbour(graph.nodes[5]);
    // graph.nodes[3]->addNeighbour(graph.nodes[6]);
    // graph.nodes[1]->addNeighbour(graph.nodes[6]);
    // graph.nodes[4]->addNeighbour(graph.nodes[7]);
    // graph.nodes[5]->addNeighbour(graph.nodes[7]);
    // graph.nodes[6]->addNeighbour(graph.nodes[7]);

    //Graph should be made by now

    //Viewing the values of all nodes
    for(auto it:graph.nodes){
        cout<<it->data2<<" ";
    }
    cout<<"\n";
}