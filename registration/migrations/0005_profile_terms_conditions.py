# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-01-17 10:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0004_auto_20180117_0946'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='terms_conditions',
            field=models.BooleanField(default=False),
        ),
    ]
