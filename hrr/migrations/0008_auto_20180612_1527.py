# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-12 15:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hrr', '0007_hrr_time_heart_rate_reached_99'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hrr',
            name='Did_you_measure_HRR',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
