import os
import json
from django.http import HttpResponse

def wordmorph(request):
    try:
        if request.method == "POST":
            import pickle
            graph_folder = os.path.join(os.path.dirname(__file__), 'graphs/').replace('\\', '/')
            #print os.path.dirname(__file__), os.path.join(os.path.dirname(__file__), 'graphs/')
            word0 = request.POST["start_word"]
            wordn = request.POST["end_word"]
            word_len = len(word0)

            word_graph = pickle.load(file(graph_folder+'%s.pkl' % word_len))

            destination_found = False
            search_queue = [word0]

            while not destination_found:
                for neighbor in word_graph[search_queue[0]]["neighbors"]:
                    if neighbor == wordn:
                        destination_found = True
                        word_graph[wordn]["parent"] = search_queue[0]
                    elif word_graph[neighbor]["visited"]:
                        continue
                    else:
                        word_graph[neighbor]["visited"] = True
                        word_graph[neighbor]["parent"] = search_queue[0]
                        search_queue.append(neighbor)

                search_queue.pop(0)

            dfs_path = []
            current_word = wordn
            while True:
                dfs_path.append(current_word)
                if current_word == word0:
                    break
                current_word = word_graph[current_word]["parent"]

            dfs_path.reverse()

            return HttpResponse(json.dumps(dfs_path), 'application/javascript')

    except:
        from traceback import print_exc
        print_exc()