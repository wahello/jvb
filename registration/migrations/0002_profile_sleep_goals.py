# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-01-04 09:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='sleep_goals',
            field=models.CharField(default='7:00', max_length=10),
            preserve_default=False,
        ),
    ]
