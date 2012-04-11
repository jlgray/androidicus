from django.conf.urls.defaults import *
from django.contrib import admin

admin.autodiscover()

def gotohell(request):
    print "gotohell"

urlpatterns = patterns('wordmorph.views',
    (r'^$', 'wordmorph'),
    (r'^path/$', 'path'),
)