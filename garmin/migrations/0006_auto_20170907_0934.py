# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-09-07 09:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('garmin', '0005_auto_20170907_0920'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergarmindataactivity',
            name='start_time_duration_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindataactivity',
            name='start_time_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatabodycomposition',
            name='start_time_duration_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatabodycomposition',
            name='start_time_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatadaily',
            name='start_time_duration_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatadaily',
            name='start_time_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindataepoch',
            name='start_time_duration_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindataepoch',
            name='start_time_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatamanuallyupdated',
            name='start_time_duration_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatamanuallyupdated',
            name='start_time_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatasleep',
            name='start_time_duration_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usergarmindatasleep',
            name='start_time_in_seconds',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]