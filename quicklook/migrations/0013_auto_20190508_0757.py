# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2019-05-08 07:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quicklook', '0012_auto_20190316_1536'),
    ]

    operations = [
        migrations.AddField(
            model_name='food',
            name='list_of_pants_consumed_ql',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='food',
            name='no_plants_consumed_ql',
            field=models.CharField(blank=True, max_length=5),
        ),
    ]
