# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-04-20 10:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0050_auto_20180305_1347'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdailyinput',
            name='report_type',
            field=models.CharField(choices=[('quick', 'Quick Report'), ('full', 'Full Report')], default='full', max_length=10),
        ),
    ]
