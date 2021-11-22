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
        res=dict()
        for e in g.keys():
            if e.split(' ')[0] == c['Graph'] and g[e]['name'] == c['graph']:
                node_list=g[g[e]['value'][c['nodelist']]]['value']
                break
        
        res['nodes']=[]
        res['edge_list']=[]
        res['Nodedata']=dict()
        temp_id=dict()
        for i in range(len(node_list)):
            node=g[node_list[i]]
            temp_id[node_list[i]]=i+1
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
        
        for node in node_list :    
            for neighbour in g[g[node]['value'][c['neighbours']]]['value']:
                if neighbour in node_list:
                    temp_edge={ 
                        'from':temp_id[node],
                        'to':temp_id[neighbour],
                    }
                    res['edge_list'].append(temp_edge)
        
        return JsonResponse(res)
    
@method_decorator(csrf_exempt, name='dispatch')
class configview(View):
    def post(self,request):
        # print('Haha')
        received_json_data=json.loads(request.body.decode("utf-8"))
        #fix the json format as here you need to access graph objects or i am giving this name and it will be used forever
        temp_dataset,created=Graph.objects.get_or_create(name="trialgraph")
        temp_dataset.config=received_json_data
        temp_dataset.save()
        print(received_json_data)
        return HttpResponse('')