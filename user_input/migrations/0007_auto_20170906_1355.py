# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-09-06 13:55
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0006_auto_20170904_1006'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyuserinputencouraged',
            name='pain_area',
            field=models.CharField(choices=[('neck', 'Neck'), ('leg', 'Leg')], default='leg', max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dailyuserinputoptional',
            name='percent_breath_nose_all_day_not_exercising',
            field=models.FloatField(default=90, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dailyuserinputoptional',
            name='percent_breath_nose_last_night',
            field=models.FloatField(default=90, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dailyuserinputoptional',
            name='sick',
            field=models.CharField(choices=[('Yes', 'Yes'), ('No', 'No')], default='Yes', max_length=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dailyuserinputoptional',
            name='sick_comment',
            field=models.CharField(blank=True, max_length=250),
        ),
        migrations.AddField(
            model_name='dailyuserinputoptional',
            name='stand_for_three_hours',
            field=models.CharField(choices=[('Yes', 'Yes'), ('No', 'No')], default='Yes', max_length=3),
            preserve_default=False,
        ),
    ]
