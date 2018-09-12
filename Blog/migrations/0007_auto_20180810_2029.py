# Generated by Django 2.0.5 on 2018-08-10 14:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Blog', '0006_blogpost_photo'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='blogcomment',
            options={'ordering': ('date_pub',)},
        ),
        migrations.AlterModelOptions(
            name='blogpost',
            options={'ordering': ('date_pub',)},
        ),
        migrations.AddField(
            model_name='blogcomment',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='blogcomment',
            name='oowner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='blogcomment',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='blogcomment',
            name='blogPost',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='Blog.BlogPost'),
        ),
        migrations.AlterField(
            model_name='blogcomment',
            name='content',
            field=models.TextField(),
        ),
    ]
