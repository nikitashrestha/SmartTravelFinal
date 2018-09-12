from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class BlogPost(models.Model):

    title = models.CharField(max_length=100)
    content = models.TextField()
    date_pub = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_public=models.BooleanField(default=True)
    photo=models.FileField( null=True, blank=True)

    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)

    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('date_pub',)

    def __str__(self):
        '''Returns string representation of BlogPost model'''
        return self.title[:50]

class BlogLike(models.Model):
    ''''''
    blogPost = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class BlogDislike(models.Model):
    ''''''
    blogPost = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class BlogComment(models.Model):
    ''''''
    content = models.TextField()
    date_pub = models.DateTimeField(auto_now_add=True)
    blogPost = models.ForeignKey(BlogPost, related_name='comments', on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    active = models.BooleanField(default=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('date_pub',)

    def __str__(self):
        '''Returns string representation of BlogComment model'''
        return "Comment by {} on {}".format(self.owner, self.blogPost)


class Notification(models.Model):
    owner = models.ForeignKey(User, related_name='owner', on_delete=models.CASCADE, null=True)
    content = models.CharField(max_length=200)
    blogPost = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)
    client = models.ForeignKey(User, related_name='client', on_delete=models.CASCADE, null=True )
    created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.content[:50]


class Blog_Search(models.Model):
    search_name=models.CharField(max_length=30) # kaslai search gareko
    viewer_id=models.IntegerField() # kasle search gareko
    searched_date = models.DateTimeField(auto_now_add=True)