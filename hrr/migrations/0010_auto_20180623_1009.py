# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-23 10:09
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hrr', '0009_auto_20180616_1003'),
    ]

    operations = [
        migrations.RenameField(
            model_name='timeheartzones',
            old_name='heart_rate_zone_high_end',
            new_name='activity_summary_id',
        ),
        migrations.RenameField(
            model_name='timeheartzones',
            old_name='heart_rate_zone_low_end',
            new_name='data',
        ),
        migrations.RemoveField(
            model_name='timeheartzones',
            name='prcnt_total_duration_in_zone',
        ),
        migrations.RemoveField(
            model_name='timeheartzones',
            name='time_in_zone_for_last_7_days',
        ),
    ]
