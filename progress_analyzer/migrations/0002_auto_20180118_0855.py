# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-01-18 08:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('progress_analyzer', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movementconsistencycumulative',
            name='cum_movement_consistency_score',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='overallhealthgradecumulative',
            name='cum_total_gpa_point',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='penaltycumulative',
            name='cum_sleep_aid_penalty',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
