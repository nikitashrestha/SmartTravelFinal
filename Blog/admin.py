from django.contrib import admin

# Register your models here.
from .models import BlogPost, BlogComment, Blog_Search, Notification

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'owner', 'date_pub', 'likes', 'is_public')
    #list_filter = ('active', 'created', 'updated')
    list_filter = ('is_public', 'date_pub', 'updated')
    search_fields = ('title', 'content',)

admin.site.register(BlogPost, BlogPostAdmin)

admin.site.register(Blog_Search)

class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'owner', 'blogPost', 'date_pub', 'active')
    list_filter = ('active', 'date_pub', 'updated')
    search_fields = ('content',)

admin.site.register(BlogComment, BlogCommentAdmin)

admin.site.register(Notification)