# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-11-21 13:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quicklook', '0013_auto_20171121_1310'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grades',
            name='overall_truth_health_gpa',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='grades',
            name='penalty',
            field=models.FloatField(),
        ),
    ]
