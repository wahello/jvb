# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-09-05 11:06
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('garmin', '0002_auto_20170904_1528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergarmindataactivity',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activity_data', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='usergarmindatabodycomposition',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='body_composition_data', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='usergarmindatadaily',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='daily_data', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='usergarmindataepoch',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='epoch_data', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='usergarmindatamanuallyupdated',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='manually_updated_data', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='usergarmindatasleep',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sleep_data', to=settings.AUTH_USER_MODEL),
        ),
    ]
