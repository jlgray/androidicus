import pickle, os
from django.conf import settings

def one_char_different(word1, word2):
    """
        Returns whether or not two words of the same length are different by only one character
    """
    
    strikes = 1 #three strikes policy with one strike to start with
    for i in xrange(len(word1)):
        if word1[i] != word2[i]:
            strikes += 1
        if strikes > 2:
            return False
    
    if strikes > 1: 
        return True
    else: 
        return False  #Same word
    

def make_word_len_graph(wordlist):
    """
    Makes a graph of words of the same length with an edge if one_char_different passes for the two words
    """
    word_len_graph = {}
    for word in wordlist:
        
        word_len = len(word)

        word_obj = {"word": word,
                    "neighbors": set(),
                    "visited": False}

        for same_len_word in word_len_graph:
            if one_char_different(word, same_len_word):
               word_obj["neighbors"].add(same_len_word)
               word_len_graph[same_len_word]["neighbors"].add(word)

        word_len_graph[word] = word_obj

    return word_len_graph


def make_word_graph(wordlist):
    """

    """
    wordlists = {}

    #Sort words in wordlist by length
    for word in wordlist:
        #word = word.rstrip()
        word_len = len(word)

        if word_len not in wordlists:
            wordlists[word_len] = []

        wordlists[word_len].append(word)

    for word_len in wordlists:
        print word_len
        pickle_graph(make_word_len_graph(wordlists[word_len]), word_len)


def pickle_graph(graph_dict, word_len):
    f = open(os.path.join(settings.PROJECT_PATH, ('wordmorph/graphs/%s.pkl' % word_len)), 'w')
    pickle.dump(graph_dict, f)
        

if __name__ == "__main__":

    make_word_graph("./dict.txt")
    
    #unpickled_word_graph = pickle.load(file('./graphs/4.pkl'))
    
    #for word in unpickled_word_graph['clap']["neighbors"]:
    #    print word

     

    
