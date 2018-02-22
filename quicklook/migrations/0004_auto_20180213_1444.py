# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-02-13 14:44
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quicklook', '0003_grades_prcnt_unprocessed_food_consumed_gpa'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exerciseandreporting',
            old_name='hrr_beats_lowered',
            new_name='hrr_beats_lowered_first_minute',
        ),
        migrations.RenameField(
            model_name='exerciseandreporting',
            old_name='hrr_start_point',
            new_name='hrr_starting_point',
        ),
        migrations.RenameField(
            model_name='exerciseandreporting',
            old_name='hrr',
            new_name='hrr_time_to_99',
        ),
        migrations.RenameField(
            model_name='exerciseandreporting',
            old_name='sleep_resting_hr_last_night',
            new_name='resting_hr_last_night',
        ),
    ]
