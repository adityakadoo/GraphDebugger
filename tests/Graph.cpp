#include<bits/stdc++.h>
using namespace std;

#define MAX_NODES 6

enum colour {WHITE, GREEN, YELLOW};
enum EdgeColor {BLACK, RED, BLUE};

float fff = 782.4342;

class Node{
    protected:
        shared_ptr<int> source_,target_;
    public:
        Node(){}
        Node(int i,char c,colour e,float f,bool b,string s){
            data1 = i;
            data2 = c;
            data3 = e;
            data4 = f;
            data5 = b;
            data6 = s;
            data7 = make_pair(i*1000, i*1000+3000);
            data8 = make_tuple(i+100,c,b);
        }
        
        //Adding neighbours
        // void addNeighbour(shared_ptr<Node> neighbour){
        //     neighbours.insert(neighbour);
        // };

        // set of elements containing pointers to the neighbours of the node
        // set<shared_ptr<Node>> neighbours;

        //Data stored in the node
        int data1;
        char data2;
        colour data3;
        float data4;
        bool data5;
        string data6;
        pair<long long, long long> data7;
        tuple<int, char, bool> data8;
};

// class Edge{
//     public:
//         Edge(shared_ptr<Node> src,shared_ptr<Node> tgt,colour e){
//             start_node=src;
//             end_node=tgt;
//             edgecolour=e;
//         }
//         shared_ptr<Node> start_node;
//         shared_ptr<Node> end_node;
//         colour edgecolour;

// };  

class Graph{
    public:
        set<shared_ptr<Node>> nodes;
        shared_ptr<Node> start_node, end_node;
        map<shared_ptr<Node>,map<shared_ptr<Node>,EdgeColor>> edges;
        Graph(){}
        void addEdge(shared_ptr<Node> src,shared_ptr<Node> tgt,EdgeColor color){
            edges[src][tgt]=color;
        };
};

int main(/*int argc, char const *argv[]*/){

    //creating an instance of the graph object
    Graph graph = Graph();

    //Number of Nodes
    int n = 8;

    //Adding the nodes
    for(int i=0;i<n;i++){
        //any data can be stored in the nodes
        graph.nodes.insert(shared_ptr<Node>(new Node(i*2,97+i,colour(i%3),(float)i/10,i%2,"index->"+to_string(i))));
    }

    // Adding the Edges
    for(auto it=graph.nodes.begin();it!=graph.nodes.end();it++){
        set<shared_ptr<Node>>::iterator jt;
        if(it!=--graph.nodes.end()){
            jt = it; jt++;
        }
        else{
            jt = graph.nodes.begin();
        }
        graph.addEdge(*jt,*it,(EdgeColor)(rand()%3));
        // (*it)->addNeighbour(*jt);
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