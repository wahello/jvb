# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-23 10:16
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hrr', '0010_auto_20180623_1009'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='timeheartzones',
            name='activity_summary_id',
        ),
    ]
