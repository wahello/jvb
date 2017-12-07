# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-12-05 11:23
from __future__ import unicode_literals

from django.db import migrations, models
import user_input.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0039_auto_20171204_1538'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyuserinputstrong',
            name='dewpoint',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(-20), user_input.models.CharMaxValueValidator(120)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputstrong',
            name='humidity',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(1), user_input.models.CharMaxValueValidator(100)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputstrong',
            name='indoor_temperature',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(-20), user_input.models.CharMaxValueValidator(120)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputstrong',
            name='outdoor_temperature',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(-20), user_input.models.CharMaxValueValidator(120)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputstrong',
            name='weather_comment',
            field=models.TextField(blank=True),
        ),
    ]