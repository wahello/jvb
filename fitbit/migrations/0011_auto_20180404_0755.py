# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-04-04 07:55
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fitbit', '0010_auto_20180404_0653'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userfitbitdataactivities',
            old_name='data',
            new_name='activities_data',
        ),
        migrations.RenameField(
            model_name='userfitbitdataheartrate',
            old_name='data',
            new_name='heartrate_data',
        ),
        migrations.RenameField(
            model_name='userfitbitdatasleep',
            old_name='data',
            new_name='sleep_data',
        ),
    ]
