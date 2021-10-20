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
        available_dataset,created=Graph.objects.get_or_create(name="trialgraph")
        c=available_dataset.config
        g=available_dataset.data
        temp_data=dict()
        # # nodes_cnt=g[c['Graph']]
        for e in g[c['Graph']].keys():
            if e!='fields' and g[c['Graph']][e]['name']==c['graph'] :
                starting_location=e
        nodes_dict=dict()
        # #nodes_dict['mem_loc']=id
        Node_array=g[c['Graph']][starting_location]['value'][c['nodelist']]
        cnt=0
        for e in g[Node_array['type']][Node_array['ref']]['value']:
            cnt+=1
            nodes_dict[e['ref']]=cnt
        edge_list=[]
        nodedata=dict()
        node_list=[]
        for node in nodes_dict:
            temp=dict()
            temp['id']=nodes_dict[node]
            temp['label']=node
            node_list.append(temp)
            neighbour_pointer=g[c['Node']][node]['value'][c['neighbours']]
            neighbour_array= g[neighbour_pointer['type']][neighbour_pointer['ref']]['value']
            source=nodes_dict[node]#1,2
            for e in neighbour_array:
                e = g[e['type']][e['ref']]['value']
                if e['ref'] in nodes_dict.keys():
                    dest=nodes_dict[e['ref']]
                    a=dict()
                    a['from']=source
                    a['to']=dest
                    edge_list.append(a)
            data_values=g[c['Node']][node]['value']

            nodedata[nodes_dict[node]]=dict()
            for e in c['Nodefeatures']:
                try:
                    data_value=g[data_values[e]['type']][data_values[e]['ref']]
                    nodedata[nodes_dict[node]][e]=str(data_value['value'])
                except KeyError:
                    continue
            
        temp_data['Nodedata']=nodedata
        temp_data['nodes']=node_list
        temp_data['edge_list']=edge_list

        return JsonResponse(temp_data)
    
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