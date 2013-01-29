from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
from django.views.generic.simple import redirect_to

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', redirect_to, {'url': '/admin/'}),
    url(r'^admin/', include(admin.site.urls)),
    (r'^favicon.ico$', 'django.views.generic.simple.redirect_to', {
        'url': '%stest_app/img/favicon.ico' % settings.STATIC_URL}),
)

if settings.DEV:
    urlpatterns += patterns('', 
        (r'^%s(.*)$' % settings.MEDIA_URL[1:], 
        'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        
    )
