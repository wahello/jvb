# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-12-19 10:00
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fitbit', '0017_userapptokens'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAppSubscriptionToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_subscription_token', models.TextField(null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='User_subscription_token', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
