# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-11-04 11:09
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0032_auto_20171030_1800'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dailyuserinputstrong',
            old_name='prcnt_processed_food_consumed_yesterday',
            new_name='prcnt_unprocessed_food_consumed_yesterday',
        ),
    ]
