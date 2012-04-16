from django.shortcuts import render_to_response
from django.template import RequestContext

def render_with_RequestContext(request, template, *args, **kwargs):
    """
    This shortcut automatically includes RequestContext
    """
    kwargs['context_instance'] = RequestContext(request)
    return render_to_response(template, *args, **kwargs)