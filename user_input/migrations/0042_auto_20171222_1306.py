# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-12-22 13:06
from __future__ import unicode_literals

from django.db import migrations, models
import user_input.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0041_auto_20171205_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='hr_down_99',
            field=models.CharField(blank=True, choices=[('', '-'), ('yes', 'Yes'), ('no', 'No')], max_length=4),
        ),
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='hr_level',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(70), user_input.models.CharMaxValueValidator(220)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='lowest_hr_during_hrr',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(70), user_input.models.CharMaxValueValidator(220)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='lowest_hr_first_minute',
            field=models.CharField(blank=True, max_length=10, validators=[user_input.models.CharMinValueValidator(70), user_input.models.CharMaxValueValidator(220)]),
        ),
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='measured_hr',
            field=models.CharField(blank=True, choices=[('', '-'), ('yes', 'Yes'), ('no', 'No')], max_length=4),
        ),
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='time_to_99',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='time_to_lowest_point',
            field=models.CharField(blank=True, max_length=10),
        ),
    ]