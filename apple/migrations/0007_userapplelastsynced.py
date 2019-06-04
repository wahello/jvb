# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2019-06-04 13:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('apple', '0006_remove_appleuser_created_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAppleLastSynced',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_synced_apple', models.DateTimeField()),
                ('offset', models.IntegerField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='last_synced_apple', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
