import pickle
#from wordgraph import Word

word0 = raw_input('Starting Word: ')
wordn = raw_input('Destination Word: ')
word_len = len(word0)

word_graph = pickle.load(file('./graphs/%s.pkl' % word_len))


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

for word in dfs_path:
    print word

