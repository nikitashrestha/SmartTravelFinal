from django import forms

from .models import BlogPost, BlogComment

class BlogPostForm(forms.ModelForm):

    title = forms.CharField(widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Write title...',
        }
    ))

    content = forms.CharField(widget=forms.Textarea(
        attrs={
            'class': 'form-control',
            'placeholder': 'Write content...',
        }
    ))
    photo=forms.FileField(widget=forms.FileInput())

    # is_public = forms.BooleanField(widget=forms.CheckboxInput(
    #     attrs={
    #
    #     }
    # ))

    class Meta:
        model = BlogPost
        fields = ['title', 'content', 'is_public', 'photo']



class BlogCommentForm(forms.ModelForm):

    content = forms.CharField(widget=forms.Textarea(
        attrs={
            'class': 'form-control',
            'placeholder': 'Write comment...',
        }
    ))

    class Meta:
        model = BlogComment
        fields = ('content',)