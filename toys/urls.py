from django.conf.urls.defaults import *
from django.conf import settings

"""
from django.contrib import admin
admin.autodiscover()
"""

urlpatterns = patterns('toys.views',

        (r'^spirograph/$', 'spirograph'),
        (r'^sierpinski/$', 'sierpinski'),
)