# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-07 07:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0009_user_input_highlighted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_input',
            name='Aerobic_Heart_Rate_Zone_High_Number',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user_input',
            name='Aerobic_Heart_Rate_Zone_Low_Number',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
