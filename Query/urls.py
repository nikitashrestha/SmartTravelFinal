from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from .import views

app_name = "Query"
urlpatterns=[
    url(r'^RetaurantandBar', views.RetaurantandBar, name='RetaurantandBar'),
    url(r'^placeDetail/rest/(?P<placeId>\d+)/',views.restDetail,name= 'restDetail'),
    url(r'^placeDetail/place/(?P<placeId>\d+)/',views.placeDetail,name= 'placeDetail'),
    url(r'^result/$',views.result,name= 'result'),
    url(r'^soo/$',views.soo,name= 'soo'),
    url(r'^map/$',views.map,name= 'map'),
]

urlpatterns+=[
	url(r'^logout$',auth_views.logout, {'template_name':'Query/logout.html'},name="logout" ),
    url(r'^$',auth_views.login, {'template_name':'Query/index.html'},name="login" ),
    url(r'^register/$', views.register, name="register"),
    url(r'^home/$',views.index,name="home" ), #recommendations returned from Query.views.index

]