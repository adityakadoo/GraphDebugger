#include<bits/stdc++.h>
using namespace std;

#define MAX_NODES 6

enum colour {RED, BLUE, GREEN};

float fff = 782.4342;

class Node{
    public:
        // Node(){}
        Node(): deg(0){}
        Node(int i,char c,colour e,float f,bool b,string s){
            deg = 0;
            data1 = i;
            data2 = c;
            data3 = e;
            data4 = f;
            data5 = b;
            data6 = s;
        }
        
        //Adding neighbours
        void addNeighbour(Node *neighbour){
            neighbours[deg] = neighbour;
            deg++;
            // neighbours.push_back(neighbour);
        };

        // Vector or list of elements containing pointers to the neighbours of the node
        Node* neighbours[MAX_NODES];
        int deg;
        // vector<Node*> neighbours;
        //list<Node*> neighbours;

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
        // vector<Node*> nodes;
        Node nodes[MAX_NODES];
        int size;

        Graph(): size(0){}
};

int main(/*int argc, char const *argv[]*/){

    //creating an instance of the graph object
    Graph graph = Graph();
    // vector<Node> &nodes = graph.nodes;
    
    //Number of Nodes
    int n = 6;//stoi(argv[1]);
    // cin>>n;
    // graph.nodes.resize(n);

    //Adding the nodes
    for(int i=0;i<n;i++){
        //any data can be stored in the nodes
        graph.nodes[i]= Node(i*2,97+i,colour(i%3),(float)i/10,i%2,"index->"+to_string(i));
        graph.size++;
    }
    
    //m==Number of edges
    int m = 6;//stoi(argv[2]);// cin>>m;

    // Adding the Edges
    for(int i=0;i<m;i++){
        int u = (i),v = (i+1)%6;
        // cin>>u>>v;
        graph.nodes[u].addNeighbour(&graph.nodes[v]);
    }

    // graph.nodes[0].addNeighbour(&graph.nodes[1]);
    // graph.nodes[0].addNeighbour(&graph.nodes[2]);
    // graph.nodes[0].addNeighbour(&graph.nodes[3]);
    // graph.nodes[1].addNeighbour(&graph.nodes[4]);
    // graph.nodes[2].addNeighbour(&graph.nodes[4]);
    // graph.nodes[2].addNeighbour(&graph.nodes[5]);
    // graph.nodes[3].addNeighbour(&graph.nodes[5]);
    // graph.nodes[3].addNeighbour(&graph.nodes[6]);
    // graph.nodes[1].addNeighbour(&graph.nodes[6]);
    // graph.nodes[4].addNeighbour(&graph.nodes[7]);
    // graph.nodes[5].addNeighbour(&graph.nodes[7]);
    // graph.nodes[6].addNeighbour(&graph.nodes[7]);

    //Graph should be made by now

    //Viewing the values of all nodes
    for(int i=0;i<graph.size;i++/*auto it:graph.nodes*/){
        cout<<graph.nodes[i].data2<<" ";
        // cout<<it.data2<<" ";
    }
    cout<<"\n";
}