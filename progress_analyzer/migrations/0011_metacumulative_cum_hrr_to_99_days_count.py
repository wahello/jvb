# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-26 09:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('progress_analyzer', '0010_metacumulative_cum_avg_exercise_hr_days_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='metacumulative',
            name='cum_hrr_to_99_days_count',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]