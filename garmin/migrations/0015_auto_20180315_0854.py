# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-15 08:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('garmin', '0014_garminfitfiles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='garminfitfiles',
            name='fit_file',
            field=models.BinaryField(blank=True),
        ),
    ]
