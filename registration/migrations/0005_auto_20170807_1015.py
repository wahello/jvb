# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-07 04:45
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('registration', '0004_user_input_other'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_input',
            name='Aerobic_Heart_Rate_Zone_High_Number',
            field=models.IntegerField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='user_input',
            name='Aerobic_Heart_Rate_Zone_Low_Number',
            field=models.IntegerField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='user_input',
            name='age',
            field=models.IntegerField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='user_input',
            name='highlighted',
            field=models.TextField(default=None),
        ),
        migrations.AddField(
            model_name='user_input',
            name='owner',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='snippets', to=settings.AUTH_USER_MODEL),
        ),
    ]
