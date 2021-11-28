from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.views import View
from .models import Graph
# Create your views here.
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class graphview(View):
    def post(self,request):
        received_json_data=json.loads(request.body.decode("utf-8"))
        temp_dataset,created=Graph.objects.get_or_create(name="GRAPH_1")
        temp_dataset.data=received_json_data
        temp_dataset.save()
        return HttpResponse('')

    def get(self,request):
        graph,created=Graph.objects.get_or_create(name="GRAPH_1")
        c=graph.config
        g=graph.data
        res={
            'time_stamp':g['time_stamp']
        }
        if c['format'] == 'Adj-List':
            res = self.adj_list_format(c, g)
        elif c['format'] == 'Edge-List':
            res = self.edge_list_format(c,g)
        elif c['format'] == "Edge-Map":
            res=self.edge_map_format(c,g)
        return JsonResponse(res)
    
    @staticmethod
    def get_node_data(c, g, node_list):
        res={
            'time_stamp':g['time_stamp']
        }
        res['nodes']=[]
        res['Nodedata']=dict()
        node_id=dict()
        for i in range(len(node_list)):
            node=g['varr'][node_list[i][0]][node_list[i][1]]
            node_id[node_list[i][1]]=i+1
            node_dict={
                'id':i+1,
                'label': node[0]
            }
            res['nodes'].append(node_dict)
            feature_dict=dict()
            for feature in node[1]:
                temp_feature=g['varr'][node[1][feature][0]][node[1][feature][1]][1]
                if type(temp_feature)==list:
                    temp_dict = dict()
                    for elem in temp_feature:
                        sub_feature = g['varr'][elem[0]][elem[1]]
                        if type(sub_feature[1])!=list and type(sub_feature[1])!=dict:
                            temp_dict[sub_feature[0]] = sub_feature[1]
                    if len(temp_dict) != 0:
                        feature_dict[feature]=str(temp_dict)
                elif type(temp_feature)!=dict: 
                    feature_dict[feature]=str(temp_feature)
            res['Nodedata'][i+1]=feature_dict
        return res,node_id

    @staticmethod
    def adj_list_format(c, g):
        node_list = None
        if c['Graph'] not in g['types']:
            empty_dict={
                'nodes':[],
                'Nodedata':dict(),
                'edge_list':[],
                'time_stamp':g['time_stamp']
            }
            return empty_dict
        allgraphs = g['varr'][g['types'][c['Graph']]]
        for e in allgraphs.keys():
            if allgraphs[e][0] == c['graph']:
                nodes_ptr=allgraphs[e][1][c['nodelist']]
                node_list=g['varr'][nodes_ptr[0]][nodes_ptr[1]][1]
                break
        if node_list is None:
            empty_dict={
                'nodes':[],
                'Nodedata':dict(),
                'edge_list':[],
                'time_stamp':g['time_stamp']
            }
            return empty_dict
        res, node_id = graphview.get_node_data(c, g, node_list)
        res['edge_list']=[]
        for nodeptr in node_list :
            node=g['varr'][nodeptr[0]][nodeptr[1]]
            for neighbour in g['varr'][node[1][c['neighbours']][0]][node[1][c['neighbours']][1]][1]:
                if neighbour in node_list:
                    temp_edge={ 
                        'from':node_id[nodeptr[1]],
                        'to':node_id[neighbour[1]],
                    }
                    res['edge_list'].append(temp_edge)
        return res
    
    @staticmethod
    def edge_list_format(c, g):
        node_list = None
        edge_list = None
        if c['Graph'] not in g['types']:
            empty_dict={
                'nodes':[],
                'Nodedata':dict(),
                'edge_list':[],
                'time_stamp':g['time_stamp']
            }
            return empty_dict
        allgraphs = g['varr'][g['types'][c['Graph']]]
        for e in allgraphs.keys():
            if allgraphs[e][0] == c['graph']:
                nodes_ptr=allgraphs[e][1][c['nodelist']]
                node_list=g['varr'][nodes_ptr[0]][nodes_ptr[1]][1]
                edges_ptr=allgraphs[e][1][c['edgelist']]
                edge_list=g['varr'][edges_ptr[0]][edges_ptr[1]][1]
                break
        if (node_list is None) or (edge_list is None):
            empty_dict={
                'nodes':[],
                'Nodedata':dict(),
                'edge_list':[],
                'time_stamp':g['time_stamp']
            }
            return empty_dict
        
        res, node_id = graphview.get_node_data(c, g, node_list)

        res['edge_list']=[]
        for edgeptr in edge_list:
            edge = g['varr'][edgeptr[0]][edgeptr[1]]
            temp_edge={
                'from':node_id[edge[1][c['from']][1]],
                'to':node_id[edge[1][c['to']][1]],
            }
            res['edge_list'].append(temp_edge)
        return res

    @staticmethod
    def edge_map_format(c, g):
        node_list = None
        edge_map = None
        if c['Graph'] not in g['types']:
            empty_dict={
                'nodes':[],
                'Nodedata':dict(),
                'edge_list':[],
                'time_stamp':g['time_stamp']
            }
            return empty_dict
        allgraphs = g['varr'][g['types'][c['Graph']]]
        for e in allgraphs.keys():
            if allgraphs[e][0] == c['graph']:
                nodes_ptr=allgraphs[e][1][c['nodelist']]
                node_list=g['varr'][nodes_ptr[0]][nodes_ptr[1]][1]
                edgemap_ptr=allgraphs[e][1][c['edgemap']]
                edge_map=g['varr'][edgemap_ptr[0]][edgemap_ptr[1]][1]
                break
        if (node_list is None) or (edge_map is None):
            empty_dict={
                'nodes':[],
                'Nodedata':dict(),
                'edge_list':[],
                'time_stamp':g['time_stamp']
            }
            return empty_dict
        
        res, node_id = graphview.get_node_data(c, g, node_list)

        res['edge_list']=[]
        for i in range(0,len(edge_map),2):
            src=edge_map[i]
            src_edges=g['varr'][edge_map[i+1][0]][edge_map[i+1][1]][1]
            for j in range(0,len(src_edges),2):
                tgt=src_edges[j]
                temp_edge={
                    'from':node_id[src[1]],
                    'to':node_id[tgt[1]],
                }
                res['edge_list'].append(temp_edge)
        return res
    
@method_decorator(csrf_exempt, name='dispatch')
class configview(View):
    def post(self,request):
        received_json_data=json.loads(request.body.decode("utf-8"))
        temp_dataset,created=Graph.objects.get_or_create(name="GRAPH_1")
        temp_dataset.config=received_json_data
        temp_dataset.save()
        return HttpResponse('')