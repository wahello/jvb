# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-09 14:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quicklook', '0006_grades_alcoholic_drink_per_week_gpa'),
    ]

    operations = [
        migrations.AddField(
            model_name='exerciseandreporting',
            name='did_workout',
            field=models.CharField(blank=True, choices=[('yes', 'Yes'), ('no', 'No')], max_length=10),
        ),
    ]