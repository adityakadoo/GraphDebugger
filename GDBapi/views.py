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
        #fix the json format as here you need to access graph objects or i am giving this name and it will be used forever
        temp_dataset,created=Graph.objects.get_or_create(name="trialgraph")
        temp_dataset.data=received_json_data
        temp_dataset.save()
        print(received_json_data)
        return HttpResponse('')

    def get(self,request):
        graph,created=Graph.objects.get_or_create(name="trialgraph")
        c=graph.config
        g=graph.data
        if c['format'] == 'Adj-List':
            res = self.adj_list_format(c, g)
        elif c['format'] == 'Edge-List':
            res = self.edge_list_format(c,g)
        elif c['format'] == "Edge-Map":
            res=self.edge_map_format(c,g)
        return JsonResponse(res)
    
    @staticmethod
    def get_node_data(c, g, node_list):
        res=dict()
        res['nodes']=[]
        res['Nodedata']=dict()
        node_id=dict()
        for i in range(len(node_list)):
            node=g[node_list[i]]
            node_id[node_list[i]]=i+1
            node_dict={
                'id':i+1,
                'label': node['name']
            }
            res['nodes'].append(node_dict)
            feature_dict=dict()
            for feature in c['Nodefeatures']:
                if feature in node['value']:
                    feature_dict[feature]=str(g[node['value'][feature]]['value'])
                else:
                    feature_dict[feature]="Not Found"
            res['Nodedata'][i+1]=feature_dict
        return res,node_id

    @staticmethod
    def adj_list_format(c, g):
        for e in g.keys():
            if e.split(' ')[0] == c['Graph'] and g[e]['name'] == c['graph']:
                node_list=g[g[e]['value'][c['nodelist']]]['value']
                break
        res, node_id = graphview.get_node_data(c, g, node_list)
        res['edge_list']=[]
        for node in node_list :    
            for neighbour in g[g[node]['value'][c['neighbours']]]['value']:
                if neighbour in node_list:
                    temp_edge={ 
                        'from':node_id[node],
                        'to':node_id[neighbour],
                    }
                    res['edge_list'].append(temp_edge)
        return res
    
    @staticmethod
    def edge_list_format(c, g):
        for e in g.keys():
            if e.split(' ')[0] == c['Graph'] and g[e]['name'] == c['graph']:
                node_list=g[g[e]['value'][c['nodelist']]]['value']
                edge_list=g[g[e]['value'][c['edgelist']]]['value']
                break
        
        res, node_id = graphview.get_node_data(c, g, node_list)

        res['edge_list']=[]
        for edge in edge_list:
            temp_edge={
                'from':node_id[g[edge]['value'][c['from']]],
                'to':node_id[g[edge]['value'][c['to']]],
            }
            res['edge_list'].append(temp_edge)
        return res

    @staticmethod
    def edge_map_format(c, g):
        res=dict()
        for e in g.keys():
            if e.split(' ')[0] == c['Graph'] and g[e]['name'] == c['graph']:
                node_list=g[g[e]['value'][c['nodelist']]]['value']
                edge_map=g[g[e]['value'][c['edgemap']]]['value']
                break
        
        res, node_id = graphview.get_node_data(c, g, node_list)

        res['edge_list']=[]
        for i in range(0,len(edge_map),2):
            src=edge_map[i]
            src_edges=g[edge_map[i+1]]['value']
            for j in range(0,len(src_edges),2):
                tgt=src_edges[j]
                temp_edge={
                    'from':node_id[src],
                    'to':node_id[tgt],
                }
                res['edge_list'].append(temp_edge)
        return res
    
@method_decorator(csrf_exempt, name='dispatch')
class configview(View):
    def post(self,request):
        received_json_data=json.loads(request.body.decode("utf-8"))
        #fix the json format as here you need to access graph objects or i am giving this name and it will be used forever
        temp_dataset,created=Graph.objects.get_or_create(name="trialgraph")
        temp_dataset.config=received_json_data
        temp_dataset.save()
        return HttpResponse('')