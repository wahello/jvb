# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-12-05 14:18
from __future__ import unicode_literals

from django.db import migrations, models
import user_input.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0040_auto_20171205_1123'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyuserinputstrong',
            name='temperature_feels_like',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(-20), user_input.models.CharMaxValueValidator(120)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputstrong',
            name='wind',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(0), user_input.models.CharMaxValueValidator(350)]),
        ),
    ]
