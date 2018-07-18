# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-07-16 07:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fitbit', '0013_auto_20180712_1152'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fitbitnotifications',
            name='collection_type',
            field=models.CharField(choices=[('activities', 'Activities'), ('body', 'Body'), ('foods', 'Foods'), ('sleep', 'Sleeps')], max_length=100),
        ),
    ]
