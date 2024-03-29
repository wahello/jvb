# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-14 15:30
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('garmin', '0013_garminconnecttoken'),
    ]

    operations = [
        migrations.CreateModel(
            name='GarminFitFiles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('fit_file', models.TextField()),
                ('meta_data_fitfile', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='garmin_fit_files', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
