# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2019-01-28 11:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hrr', '0021_auto_20190102_0727'),
    ]

    operations = [
        migrations.AddField(
            model_name='hrr',
            name='include_hrr',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='hrr',
            name='use_updated_hrr',
            field=models.BooleanField(default=False),
        ),
    ]
