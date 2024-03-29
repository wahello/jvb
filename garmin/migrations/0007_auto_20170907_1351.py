# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-09-07 13:51
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('garmin', '0006_auto_20170907_0934'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergarmindataactivity',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(),
        ),
        migrations.AlterField(
            model_name='usergarmindatabodycomposition',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(),
        ),
        migrations.AlterField(
            model_name='usergarmindatadaily',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(),
        ),
        migrations.AlterField(
            model_name='usergarmindataepoch',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(),
        ),
        migrations.AlterField(
            model_name='usergarmindatamanuallyupdated',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(),
        ),
        migrations.AlterField(
            model_name='usergarmindatasleep',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(),
        ),
    ]
