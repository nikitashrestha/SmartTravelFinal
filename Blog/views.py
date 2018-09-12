from django.shortcuts import render, HttpResponse, HttpResponseRedirect, redirect
from django.urls import reverse
from django.http import Http404, JsonResponse
import os
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import *
from .forms import BlogPostForm, BlogCommentForm
from .simple_search import get_query

# Create your views here.

def settings(request):
    template_path = "Blog/settings.html"
    return render(request, template_path)

# Create your views here.
def index(request):

    blogPosts = BlogPost.objects.order_by('-date_pub')

    page = request.GET.get('page', 1)

    paginator = Paginator(blogPosts, 5)
    try:
        blogs = paginator.page(page)
    except PageNotAnInteger:
        blogs = paginator.page(1)
    except EmptyPage:
        blogs = paginator.page(paginator.num_pages)

    context = {'blogPosts': blogs}

    template_path="Blog/index.html"
    return render(request, template_path, context)


def blogDetail(request, blogId):

    blog = BlogPost.objects.get(id=blogId)

    comments = blog.comments.filter(active=True).order_by('-date_pub')

    if request.method != 'POST':
        comment_form = BlogCommentForm()
    else:
        comment_form = BlogCommentForm(data = request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.blogPost = blog
            new_comment.owner = request.user
            new_comment.save()

            #notification
            content = "commented on your blogpost"
            new_notification = Notification(owner=blog.owner, content=content, client=request.user, blogPost=blog)
            new_notification.save()

    context = {'blog': blog, 'comment_form': comment_form, 'comments': comments}
    return render(request, 'Blog/blogDetail.html', context)


@login_required()
def new_post(request):
    '''Create a new post'''
    if(request.method != 'POST'):
        form = BlogPostForm()
    else:
        form = BlogPostForm(request.POST, request.FILES)
        if(form.is_valid()):
            new_post = form.save(commit=False)
            new_post.owner = request.user
            new_post.save()

            # notification
            content = "created a new blogpost"
            new_notification = Notification(owner=new_post.owner, content=content, client=request.user,
                                            blogPost=new_post)
            new_notification.save()

            return HttpResponseRedirect(reverse('Blog:index'))

    context = {'form': form}
    return render(request, 'Blog/new_post.html', context)

@login_required
def edit_post(request, blogpost_id):
    '''Edit an existing post'''
    blogpost = BlogPost.objects.get(id=blogpost_id)
    if(blogpost.owner != request.user):
        raise Http404

    title = blogpost.title
    content = blogpost.content
    is_public = blogpost.is_public
    photo = blogpost.photo

    if request.method != 'POST': #get http request ...occurs when loading edit mode
        form = BlogPostForm(instance=blogpost)
        
    else: #when submitting the edited form 
        form = BlogPostForm(instance=blogpost, data=request.POST)
        if form.is_valid():
            form.save()

            # notification
            content = "edited your blogpost"
            new_notification = Notification(owner=blogpost.owner, content=content, client=request.user,
                                            blogPost=blogpost)
            new_notification.save()

            return HttpResponseRedirect(reverse('Blog:index'))

    context = {'form': form, 'blogpost': blogpost}
    return render(request, 'Blog/edit_post.html', context)


@login_required
def delete_post(request, blogpost_id):

    blogpost = BlogPost.objects.get(id=blogpost_id)

    if(blogpost.owner != request.user):
        raise Http404
    else:
        # notification
        content = "deleted your blogpost \"%s\"" % (blogpost.title)
        new_notification = Notification(owner=request.user, content=content, client=request.user, blogPost=None)
        new_notification.save()

        blogpost.delete()

    return redirect('Blog:index')


def simple_search(request):
    query_string = ''
    found_entries = None
    if ('q' in request.GET) and request.GET['q'].strip():
        query_string = request.GET['q']

        entry_query = get_query(query_string, ['title', 'content', ])

        found_entries = BlogPost.objects.filter(entry_query).order_by('-date_pub')

        context = {'query_string': query_string, 'found_entries': found_entries}
    return render(request, 'Blog/search_results.html', context)


@login_required()
def like_post(request):
    blogpost_id = None
    if(request.method == 'GET'):
        blogpost_id = request.GET['blogpost_id']

    likes=0;    dislikes = 0;
    if(blogpost_id):
        blogpost = BlogPost.objects.get(id=int(blogpost_id))
        if(blogpost):
            if(request.user.bloglike_set.filter(blogPost=blogpost).count()<1):  #Like
                blogLike = BlogLike(blogPost=blogpost, user=request.user)
                blogLike.save()
                likes = blogpost.bloglike_set.all().count()
                request.user.blogdislike_set.filter(blogPost=blogpost).delete()

                # notification
                content = "liked your blogpost"
                new_notification = Notification(owner=blogpost.owner, content=content, client=request.user,
                                                blogPost=blogpost)
                new_notification.save()

            else:   #Unlike
                request.user.bloglike_set.filter(blogPost=blogpost).delete()
                likes = blogpost.bloglike_set.all().count();

                # notification
                content = "unliked your blogpost"
                new_notification = Notification(owner=blogpost.owner, content=content, client=request.user,
                                                blogPost=blogpost)
                new_notification.save()

            dislikes = blogpost.blogdislike_set.all().count();

    '''Return JSON'''
    data = {'likes': likes, 'dislikes': dislikes}
    return JsonResponse(data);

@login_required()
def dislike_post(request):
    blogpost_id = None
    if (request.method == 'GET'):
        blogpost_id = request.GET['blogpost_id']

    dislikes = 0
    likes = 0
    if (blogpost_id):
        blogpost = BlogPost.objects.get(id=int(blogpost_id))
        if (blogpost):
            if (request.user.blogdislike_set.filter(blogPost=blogpost).count()<1):
                blogDislike = BlogDislike(blogPost=blogpost, user=request.user)
                blogDislike.save()
                dislikes = blogpost.blogdislike_set.all().count()
                request.user.bloglike_set.filter(blogPost=blogpost).delete()

            else:
                request.user.blogdislike_set.filter(blogPost=blogpost).delete()
                dislikes = blogpost.blogdislike_set.all().count()
            likes = blogpost.bloglike_set.all().count()

    data = {'likes': likes, 'dislikes': dislikes}
    return JsonResponse(data);


@login_required()
def notifications(request):

    #notis = request.user.notification_set.filter(is_read=False).order_by('-created')
    notis = Notification.objects.filter(owner=request.user).order_by('-created')

    context = {'notifications': notis}
    return render(request, 'Blog/notifications.html', context)