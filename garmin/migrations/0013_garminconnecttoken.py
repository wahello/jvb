# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-11-29 09:43
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('garmin', '0012_auto_20171116_1216'),
    ]

    operations = [
        migrations.CreateModel(
            name='GarminConnectToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=250)),
                ('token_secret', models.CharField(max_length=250)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='garmin_connect_token', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
