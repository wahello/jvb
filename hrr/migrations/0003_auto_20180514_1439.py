# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-05-14 14:39
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hrr', '0002_auto_20180514_1410'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hrr',
            old_name='did_heartrate_reach_99',
            new_name='Did_heartrate_reach_99',
        ),
        migrations.RenameField(
            model_name='hrr',
            old_name='did_you_measure_HRR',
            new_name='Did_you_measure_HRR',
        ),
        migrations.RenameField(
            model_name='hrr',
            old_name='hrr_activity_start_time',
            new_name='HRR_activity_start_time',
        ),
        migrations.RenameField(
            model_name='hrr',
            old_name='hrr_start_beat',
            new_name='HRR_start_beat',
        ),
        migrations.RenameField(
            model_name='hrr',
            old_name='no_beats_recovered',
            new_name='No_beats_recovered',
        ),
    ]
