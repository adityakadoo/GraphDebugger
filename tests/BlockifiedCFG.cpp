#include<bits/stdc++.h>
using namespace std;

#define MAX_NODES 6

enum colour {RED, BLUE, GREEN};

float fff = 782.4342;

class CFGBlock{
    public:
     CFGBlock(){}
     CFGBlock(int i,char c,colour e,float f,bool b,string s){
            data1 = i;
            data2 = c;
            data3 = e;
            data4 = f;
            data5 = b;
            data6 = s;
            data7 = make_pair(i*1000, i*1000+3000);
            data8 = make_tuple(i+100,c,b);
        }
        
        //Adding children
        void addNeighbour(shared_ptr <CFGBlock> neighbour){
            children.insert(neighbour);
        };

        // set of elements containing pointers to the children of the node
        set<shared_ptr <CFGBlock>> children;

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

class BlockifiedCFG{
    public:
        set<shared_ptr<CFGBlock>> nodes;
        BlockifiedCFG(){}
};

int main(/*int argc, char const *argv[]*/){

    //creating an instance of the graph object
    BlockifiedCFG graph = BlockifiedCFG();

    //Number of CFGBlocks
    int n = 8;

    //Adding the nodes
    for(int i=0;i<n;i++){
        //any data can be stored in the nodes
        graph.nodes.insert(shared_ptr <CFGBlock>(new CFGBlock(i*2,97+i,colour(i%3),(float)i/10,i%2,"index->"+to_string(i))));
    }

    // Adding the Edges
    for(auto it=graph.nodes.begin();it!=graph.nodes.end();it++){
        set<shared_ptr <CFGBlock>>::iterator jt;
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

    //BlockifiedCFG should be made by now

    //Viewing the values of all nodes
    for(auto it:graph.nodes){
        cout<<it->data2<<" ";
    }
    cout<<"\n";
}