from django.shortcuts import render_to_response
from traceback import print_exc

def spirograph(request):
    xhr = request.GET.has_key("xhr")
    return render_to_response("spirograph.html", {"xhr": xhr})

def sierpinski(request):
    xhr = request.GET.has_key("xhr")
    return render_to_response("sierpinski.html", {"xhr": xhr})