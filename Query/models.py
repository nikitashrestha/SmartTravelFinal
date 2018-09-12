from django.db import models
from django.db.models import Q

class PlaceDetail(models.Model):
    Name = models.CharField(max_length=200, null=True)
    Desc = models.CharField(max_length=3500, null=True)
    Opening_Time = models.CharField(max_length=30,default="Always open")
    Entry_fee = models.CharField(max_length=30,default=0)
    C_Name = models.CharField(max_length=300, null=True)
    latitude = models.CharField(max_length=50 , null=True)
    longitude = models.CharField(max_length=50 , null=True)
    Img_Path = models.CharField(max_length=300 , null=True)
    Popularity = models.CharField(max_length=10 , null=True)
    P_Name = models.CharField(max_length=50 , null=True)
    District = models.CharField(max_length=50 , null=True)
    Zone = models.CharField(max_length=50 , null=True)
    photo=models.FileField(upload_to='place', null=True, blank=True)
   
    likes = models.PositiveIntegerField(default=13)
    date_pub = models.DateTimeField(auto_now_add=True, null=True, blank=True)

class RestDetail(models.Model):
    Name = models.CharField(max_length=50)
    Desc = models.CharField(max_length=3000, null=True)
    Opening_Time = models.CharField(max_length=30,default="Always open")
    Contact_No = models.CharField(max_length=20)
    Popular_for = models.CharField(max_length=1000)
    C_Name = models.CharField(max_length=50)
    latitude = models.CharField(max_length=50)
    longitude = models.CharField(max_length=50)
    Img_Path = models.CharField(max_length=100)
    P_Name = models.CharField(max_length=300)
    District = models.CharField(max_length=50)
    Zone = models.CharField(max_length=50)
    charge=models.CharField(max_length=200)
    photo=models.FileField(upload_to='restaurant', null=True, blank=True)
   
    likes = models.PositiveIntegerField(default=13)
    date_pub = models.DateTimeField(auto_now_add=True, null=True, blank=True)