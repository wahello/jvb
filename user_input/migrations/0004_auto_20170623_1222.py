# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-23 06:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_input', '0003_goals_other'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goals',
            name='other',
            field=models.CharField(blank=True, max_length=264, null=True),
        ),
    ]
