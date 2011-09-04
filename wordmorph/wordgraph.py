def oneCharDifferent(word1, word2):
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
    

def makeWordLenGraph(word_list):

    word_len_graph = {}
    for word in word_list:
        
        word_len = len(word)

        word_obj = {"word": word,
                    "neighbors": set(),
                    "visited": False}
        
        for same_len_word in word_len_graph:
            if oneCharDifferent(word, same_len_word):
               word_obj["neighbors"].add(same_len_word)
               word_len_graph[same_len_word]["neighbors"].add(word)

        word_len_graph[word] = word_obj
    
    return word_len_graph
    
def makeWordGraph(filename):
    f = open(filename, "r")
    
    word_lists = {}
    
    for word in f.readlines():
        word = word.rstrip()
        word_len = len(word)

        if word_len not in word_lists:
            word_lists[word_len] = []

        word_lists[word_len].append(word)
    
    for word_len in word_lists:
        pickleGraph(makeWordLenGraph(word_lists[word_len]), word_len)

def pickleGraph(graph_dict, word_len):
    import pickle
    pickle.dump(graph_dict, file('./graphs/%s.pkl' % word_len, 'w'))
        

if __name__ == "__main__":

    #makeWordGraph("./dictionaries/113809of.txt")
    
    import pickle
   
    unpickled_word_graph = pickle.load(file('./graphs/4.pkl'))
    
    for word in unpickled_word_graph['clap']["neighbors"]:
        print word

     

    
