# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-02-13 14:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quicklook', '0004_auto_20180213_1444'),
    ]

    operations = [
        migrations.AddField(
            model_name='exerciseandreporting',
            name='highest_hr_first_minute',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='exerciseandreporting',
            name='lowest_hr_during_hrr',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
