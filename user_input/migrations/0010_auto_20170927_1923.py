# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-09-27 19:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0009_auto_20170925_1814'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dailyuserinputencouraged',
            name='stress_level_yesterday',
            field=models.CharField(choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')], max_length=6),
        ),
    ]
