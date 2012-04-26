import pickle, os
from collections import defaultdict

from django.conf import settings

from wordmorph import models as wm
from wordmorph import utils as u


def make_word_len_graph(wordlist):
    """
    Makes a graph of words of the same length with an edge if one_different passes for the two words
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
    graph = defaultdict(set)
    wlen = len(wordlist)

    for i in range(len(wordlist)):

        if not i%1000:
            print "mwg: %s (%s)" % (i, wlen)

        word1 = wordlist[i]

        for j in range(i+1, len(wordlist)):
           if u.one_different(word1, word2):
                graph[word1].add(word2)

    return graph



def write_graph_to_db(graph):
    i=0
    wlen =len(graph)
    for word in graph:
        if not i%1000:
            print "wg2db: %s (%s)" % (i, wlen)
        i+=1
        for neighbor in graph[word]:
            wm.EdgeList(word=word, neighbor=neighbor).save()



def graph2db(wordgraph):
    for word, neighbors_set in wordgraph.items():
        new_word, created = models.WordNode.objects.get_or_create(text=word)
        if created:
            new_word.save()

        for neighbor in neighbors_set:
            neighbor_obj, created = models.WordNode.objects.get_or_create(text=neighbor)
            if created:
                neighbor_obj.save()
            new_word.neighbors.add(neighbor_obj)
            neighbor_obj.neighbors.add(new_word)


def import_wordlist(filepath, separator=" "):
    f = open(filepath)
    wordlist = [w.rstrip().lower() for w in f.read().split(separator)]
    return wordlist


def pickle_graph(graph_dict, word_len):
    f = open(os.path.join(settings.PROJECT_PATH, ('wordmorph/graphs/%s.pkl' % word_len)), 'w')
    pickle.dump(graph_dict, f)


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