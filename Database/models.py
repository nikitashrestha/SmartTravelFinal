from django.db import models
from django.contrib.auth.models import User
from Blog.models import *

# Create your models here.
class User_Profile(models.Model): #more like extending than overriding
    #username, password, email  already in user
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    dob=models.DateTimeField(null=True)
    address=models.CharField(max_length=50, null=True)
    phonenumber=models.IntegerField(null=True)
    profession=models.CharField(max_length=20, blank=True, null=True)
    favorite_Quote=models.CharField(max_length=100,  null=True)

#Because photos are numerous and we have to map them onto many operations
class Photos(models.Model):
    Options=(
        ('prof', 'Profile'),
        ('bl', 'blog'),
        ('res', 'restaurant'),
        ('ho', 'hotel'),
        ('pa', 'park'),
        ('st', 'store'),
    )
    title=models.CharField(max_length=20, null=True)
    photo= models.ImageField(upload_to='images', null=True)
    type=models.CharField(max_length=10, choices=Options)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True) #If user is deleted, so are his/her photos


class Blog(BlogPost):
    user=models.ForeignKey(User,on_delete=models.CASCADE)#If user is deleted, so are his/her blog
    tags=models.CharField( max_length=30, blank=True, null=True) #separate by commas


class Query(models.Model):
    user=models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # user who query for places
    text=models.CharField(max_length=100)
    tags=models.CharField(max_length=30, blank=True, null=True)
    date=models.DateTimeField(auto_now_add=True)


class Result(models.Model):
    result_id = models.IntegerField(primary_key=True)
    url=models.URLField()
    title = models.CharField(max_length=30)
    content = models.CharField(max_length=200)
    photos = models.ForeignKey(Photos, on_delete=models.SET_NULL, null=True)
    rating = models.IntegerField()


class ResultComment(models.Model):
    result = models.ForeignKey(Result, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
