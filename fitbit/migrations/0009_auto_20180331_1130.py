# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-31 11:30
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fitbit', '0008_userfitbitdatasleep_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfitbitdataactivities',
            name='created_at',
            field=models.DateField(blank=True, default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='userfitbitdataheartrate',
            name='created_at',
            field=models.DateField(blank=True, default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='userfitbitdatasleep',
            name='created_at',
            field=models.DateField(blank=True, default=datetime.datetime.now),
        ),
    ]
