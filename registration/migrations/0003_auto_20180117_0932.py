# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-01-17 09:32
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('registration', '0002_profile_sleep_goals'),
    ]

    operations = [
        migrations.CreateModel(
            name='TermsConditions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accepted_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='TermsConditionsText',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('context', models.TextField()),
                ('version', models.CharField(max_length=50, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddField(
            model_name='termsconditions',
            name='terms_conditions_text',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='registration.TermsConditionsText'),
        ),
        migrations.AddField(
            model_name='termsconditions',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='terms', to=settings.AUTH_USER_MODEL),
        ),
    ]
