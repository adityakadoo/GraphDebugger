#include<bits/stdc++.h>
using namespace std;

#define MAX_NODES 6

enum colour {WHITE, GREEN, YELLOW};
enum EdgeColor {BLACK, RED, BLUE};

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
        // void addNeighbour(shared_ptr <CFGBlock> neighbour){
        //     children.insert(neighbour);
        // };

        // set of elements containing pointers to the children of the node
        // set<shared_ptr <CFGBlock>> children;

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

class CCPGBlock{
    public:
     CCPGBlock(){}
     CCPGBlock(int i,char c,colour e,float f,bool b,string s){
            data1 = i;
            data2 = c;
            data3 = e;
            data4 = f;
            is_matching = b;
            data6 = s;
            data7 = make_pair(i*1000, i*1000+3000);
            data8 = make_tuple(i+100,c,b);
        }
        
        //Adding children
        void addNeighbour(shared_ptr <CCPGBlock> neighbour,EdgeColor color){
            children[neighbour]=color;
        };

        // set of elements containing pointers to the children of the node
        map<shared_ptr<CCPGBlock>,EdgeColor> children;

        //Data stored in the node
        int data1;
        char data2;
        colour data3;
        float data4;
        bool is_matching;
        string data6;
        pair<long long, long long> data7;
        tuple<int, char, bool> data8;
};

class BlockifiedCCPG{
    public:
        // set<shared_ptr<CCPGBlock>> nodes;
        map<int,shared_ptr<CCPGBlock>> nodes;
        set<shared_ptr<CFGBlock>> base_nodes;
        BlockifiedCCPG(){}
};

int main(/*int argc, char const *argv[]*/){

    //creating an instance of the graph object
    BlockifiedCCPG graph = BlockifiedCCPG();

    //Number of CCPGBlocks
    int n = 8;

    for(int i=0;i<n;i++){
        //any data can be stored in the nodes
        graph.base_nodes.insert(shared_ptr <CFGBlock>(new CFGBlock(i*2,97+i,colour(i%3),(float)i/10,i%2,"index->"+to_string(i))));
    }
    //Adding the nodes
    for(int i=0;i<n;i++){
        //any data can be stored in the nodes
        // auto it=graph.base_nodes.begin();int temp=i;
        // while(temp--){
        //     it++;
        //     if(it==graph.base_nodes.end()){
        //         it=graph.base_nodes.begin();
        //     }
        // }
        // set<shared_ptr<CFGBlock>>::iterator jt;
        // jt=it++;
        // if(jt==graph.base_nodes.end()){
        //     jt=graph.base_nodes.begin();
        // }
        graph.nodes[i]=(shared_ptr <CCPGBlock>(new CCPGBlock(i*3,97+2*i,colour((i+1)%3),(float)i/5,i%2,"index->"+to_string(i))));
    }
    // for(int i=0;i<n;i++){
    //     graph.nodes[make_pair(i,i)]->children[graph.nodes[make_pair((i+1)%n,(i+1)%n)]]=(EdgeColor)(i%3);
    // }

    // Adding the Edges
    for(int i=0;i<n;i++){
        // map<pair<shared_ptr<CFGBlock>,shared_ptr<CFGBlock>>,shared_ptr<CCPGBlock>>::iterator jt;
        // if(it!=--graph.nodes.end()){
        //     jt = it; jt++;
        // }
        // else{
        //     jt = graph.nodes.begin();
        // }
        // set<shared_ptr<CFGBlock>>::iterator jt;
        // jt=it++;
        // if(jt==graph.base_nodes.end()){
        //     jt=graph.base_nodes.begin();
        // }
        graph.nodes[i]->addNeighbour(graph.nodes[(i+1)%n],(EdgeColor)(rand()%3));
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

    //BlockifiedCCPG should be made by now

    //Viewing the values of all nodes
    // for(auto it:graph.nodes){
    //     cout<<it->data2<<" ";
    // }
    cout<<"\n";
}