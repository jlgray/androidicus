import pickle, os
from django.db import connection
import wordmorph.models as wmodels

def path_between2(start_word, end_word):
    word_len = len(start_word)
    assert(word_len == len(end_word))

    visited = {}  #word -> parent word. This allows us to combine visited checks and parent lookup for after end_word is found
    destination_found = False
    search_queue = [start_word]

    cursor = connection.cursor()

    while not destination_found:
        if not search_queue:
            #Words are not connected
            return False

        current_word = search_queue.pop(0)
        cursor.execute("""
            SELECT word, neighbor FROM wordmorph_edgelist
            WHERE word = %s or neighbor = %s;
        """, [current_word, current_word])
        for word1, word2, in cursor.fetchall():
            if word1 == current_word:
                word = word1
                neighbor = word2
            else:
                word = word2
                neighbor = word1

            if neighbor in visited:
                continue

            visited[neighbor] = current_word
            
            if neighbor == end_word:
                destination_found = True
                break
            else:
                search_queue.append(neighbor)

    dfs_path = []
    current_word = end_word
    while True:
        dfs_path.append(current_word)
        if current_word == start_word:
            break
        current_word = visited[current_word]

    dfs_path.reverse()
    return dfs_path


def path_between1(start_word, end_word):
    graph_folder = os.path.join(os.path.dirname(__file__), 'graphs/').replace('\\', '/')

    word_len = len(start_word)
    assert(word_len == len(end_word))

    word_graph = pickle.load(file(os.path.join(graph_folder, '%s.pkl' % word_len)))

    destination_found = False
    search_queue = [start_word]

    while not destination_found:
        if not search_queue:
            #Words are not connected
            return False

        for neighbor in word_graph[search_queue[0]]['neighbors']:
            if neighbor == end_word:
                destination_found = True
                word_graph[end_word]["parent"] = search_queue[0]
            elif word_graph[neighbor]["visited"]:
                continue
            else:
                word_graph[neighbor]["visited"] = True
                word_graph[neighbor]["parent"] = search_queue[0]
                search_queue.append(neighbor)

        search_queue.pop(0)


    dfs_path = []
    current_word = end_word
    while True:
        dfs_path.append(current_word)
        if current_word == start_word:
            break
        current_word = word_graph[current_word]["parent"]

    dfs_path.reverse()

    return dfs_path



def one_different(word1, word2):
    """
        Returns whether or not two strings have a Levenshtein Distance of 1
    """
    len_1 = len(word1)
    len_2 = len(word2)
    max_len = max([len_1, len_2])
    min_len = min([len_1, len_2])
    len_diff = abs(len_1 - len_2)
    strikes = 0
    for i in range(max_len):
        if (len_diff == 1 and i == max_len-1) or (i < min_len and word1[i] != word2[i]):
#            print "strikes", strikes, i,y
            if strikes == 1:
                return False
            strikes += 1
            #Check for substitution
            if word1[i+1:] == word2[i+1:] and len_diff == 0:
#                print "subs", i,
                return True

            #Check for insertion
            elif word1[i:] == word2[i+1:]:
#                print "ins", i,
                return True

            #Check for deletion
            elif word1[i+1:] == word2[i:] or (len_diff == 1 and i == max_len-1):
#                print "del", i,
                return True

    return False
