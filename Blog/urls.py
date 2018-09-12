from django.conf.urls import url
from django.urls import path
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views


app_name = "Blog"

urlpatterns=[
    url(r'^settings/$', views.settings, name="settings"),
    
]

urlpatterns+=[
	path('', views.index, name='index'),
    path('blogDetail/(?P<blogId>\d+)/', views.blogDetail, name='blogDetail'),
    path('new_post/', views.new_post, name='new_post'),


    path('edit_post/<blogpost_id>/', views.edit_post, name='edit_post'),
    path('delete_post/<blogpost_id>/', views.delete_post, name='delete_post'),


    path('edit_post/<blogpost_id>', views.edit_post, name='edit_post'),
    path('delete_post/<blogpost_id>', views.delete_post, name='delete_post'),
    path('simple_search/', views.simple_search, name='simple_search'),
    path('like_post/', views.like_post, name='like_post'),
    path('dislike_post/', views.dislike_post, name='dislike_post'),
    path('notifications/', views.notifications, name='notifications'),
]