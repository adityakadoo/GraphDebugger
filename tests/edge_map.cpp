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

        //Data stored in the node
        int data1;
        char data2;
        colour data3;
        float data4;
        bool data5;
        string data6;
};

class Edge{
    public:
        Edge(Node* src,Node* tgt,colour e){
            from=src;
            to=tgt;
            edgecolour=e;
        }
        Node* from;
        Node* to;
        colour edgecolour;

};  

class Graph{
    public:
        vector<Node*> nodes;
        map<Node*,map<Node*,Edge*>> edge_map;
        Graph(){}
};

int main(/*int argc, char const *argv[]*/){

    //creating an instance of the graph object
    Graph graph = Graph();

    //Number of Nodes
    int n = 8;
    graph.nodes.resize(n);

    //Adding the nodes
    for(int i=0;i<n;i++){
        //any data can be stored in the nodes
        graph.nodes[i]= new Node(i*2,97+i,colour(i%3),(float)i/10,i%2,"index->"+to_string(i));
    }
    
    int m = 8;

    // Adding the Edges
    for(int i=0;i<m;i++){
        graph.edge_map[graph.nodes[i]][graph.nodes[(i+2)%m]]=new Edge(graph.nodes[i],graph.nodes[(i+2)%m],(colour)(i%3));
    }
    graph.edge_map[graph.nodes[0]][graph.nodes[1]]=new Edge(graph.nodes[0],graph.nodes[1],BLUE);
    graph.edge_map[graph.nodes[2]][graph.nodes[3]]=new Edge(graph.nodes[2],graph.nodes[3],BLUE);
    // graph.edges.push_back(new Edge(graph.nodes[0],graph.nodes[1],RED));
    //Graph should be made by now

    //Viewing the values of all nodes
    for(auto it:graph.nodes){
        cout<<it->data2<<" ";
    }
    cout<<"\n";
}