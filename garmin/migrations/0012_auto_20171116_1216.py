# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-11-16 12:16
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('garmin', '0011_garminconnecttoken'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='garminconnecttoken',
            name='user',
        ),
        migrations.DeleteModel(
            name='GarminConnectToken',
        ),
    ]