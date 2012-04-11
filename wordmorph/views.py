import os
import json
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.utils.datastructures import MultiValueDictKeyError
import wordmorph.utils as u

def wordmorph(request):
    return render_to_response('../templates/wordmorph_base.html')

def path(request):
    """
    Returns json object containing a status and the path as an array of strings
    """
    start_word = request.GET.get("start_word")
    end_word = request.GET.get("end_word")

    if not start_word:
        return HttpResponse(status=400, content="start_word is required")
    if not end_word:
        return HttpResponse(status=400, content="end_word is required")
    if len(start_word) != len(end_word):
        return HttpResponse(status=400, content="start_word and end_word must be the same length")

    path = u.path_between(start_word, end_word)
    formatted_path = [path[0]]

    for i in range(1, len(path)):
        this_word, last_word = path[i], path[i-1]
        for j in range(len(this_word)):
            if this_word[j] != last_word[j]:
                formatted_path.append(this_word[:j] + "<em>" + this_word[j] + "</em>" + this_word[j+1:])
                break
    zipped_path = zip(path, formatted_path)
    print zipped_path
    return render_to_response("wordmorph_path.html", {"path_dict": zipped_path})

#    response = json.dumps({'status': 'success',
#                           'path': path})
#    return HttpResponse(response, "application/javascript")


