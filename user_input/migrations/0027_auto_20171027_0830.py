# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-10-27 08:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0026_auto_20171026_1315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dailyuserinputstrong',
            name='workout',
            field=models.CharField(blank=True, choices=[('yes', 'Yes'), ('no', 'No'), ('not yet', 'Not Yet')], max_length=10),
        ),
    ]
