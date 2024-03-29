# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-23 12:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hrr', '0011_remove_timeheartzones_activity_summary_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aacalculations',
            name='avg_heart_rate',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='duration_below_aerobic_range',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='duration_hrr_not_recorded',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='duration_in_aerobic_range',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='duration_in_anaerobic_range',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='max_heart_rate',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='percent_aerobic',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='percent_anaerobic',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='percent_below_aerobic',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='percent_hrr_not_recorded',
        ),
        migrations.RemoveField(
            model_name='aacalculations',
            name='total_duration',
        ),
        migrations.AddField(
            model_name='aacalculations',
            name='data',
            field=models.TextField(blank=True, null=True),
        ),
    ]
