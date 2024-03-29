# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-27 14:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('progress_analyzer', '0011_metacumulative_cum_hrr_to_99_days_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='metacumulative',
            name='cum_highest_hr_in_first_min_days_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='metacumulative',
            name='cum_hrr_beats_lowered_in_first_min_days_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='metacumulative',
            name='cum_hrr_lowest_hr_point_days_count',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
