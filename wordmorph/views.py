from autils.shortcuts import render_with_RequestContext

import wordmorph.utils as u
import wordmorph.forms as wforms

def wordmorph(request):
    form = wforms.WordmorphForm()
    return render_with_RequestContext(request, '../templates/wordmorph_base.html', {"form": form})

def path(request):
    """
        Returns the shortest path between two words.
        Expects a form request with a 'start_word' and an 'end_word'
    """
    form = wforms.WordmorphForm(request.GET)
    if form.is_valid():
        start_word = form.cleaned_data["start_word"]
        end_word = form.cleaned_data["end_word"]

        path = u.path_between(start_word, end_word)

        if not path:
            error_msg = '"%s" and "%s" are not connected by substitution'% (start_word, end_word)
            return render_with_RequestContext(request, "wordmorph_base.html", {"error_msg": error_msg, "form": form})

        formatted_path = [path[0]]

        #Make HTML for path, adding <em> tags around the different word
        for i in range(1, len(path)):
            this_word, last_word = path[i], path[i-1]
            for j in range(len(this_word)):
                if this_word[j] != last_word[j]:
                    formatted_path.append(this_word[:j] + "<em>" + this_word[j] + "</em>" + this_word[j+1:])
                    break

        zipped_path = zip(path, formatted_path)   #(word, word_html)
        return render_with_RequestContext(request, "wordmorph_base.html", {"form": form, "path_dict": zipped_path})
    else:
        return render_with_RequestContext(request, "wordmorph_base.html", {"form": form})


