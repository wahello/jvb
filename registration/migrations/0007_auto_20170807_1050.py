# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-07 05:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0006_auto_20170807_1017'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_input',
            name='highlighted',
            field=models.TextField(blank=True, null=True),
        ),
    ]