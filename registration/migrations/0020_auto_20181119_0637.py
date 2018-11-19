# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-11-19 06:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0019_auto_20181117_1413'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='goals',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='sleep_goals',
        ),
        migrations.AlterField(
            model_name='profile',
            name='height',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='weight',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
    ]
