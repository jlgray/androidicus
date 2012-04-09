import pickle, os

def path_between(start_word, end_word):
    graph_folder = os.path.join(os.path.dirname(__file__), 'graphs/').replace('\\', '/')

    word_len = len(start_word)
    assert(word_len == len(end_word))

    word_graph = pickle.load(file(os.path.join(graph_folder, '%s.pkl' % word_len)))

    destination_found = False
    search_queue = [start_word]

    while not destination_found:
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


def one_char_different(word1, word2):
    """
        Returns whether or not two strings of the same length are different by only one character
    """
    strikes = 1 #three strikes policy, with guilt presumed until proven otherwise
    for i in xrange(len(word1)):
        if word1[i] != word2[i]:
            strikes += 1
        if strikes > 2:
            return False

    if strikes > 1:
        return True
    else:
        return False

