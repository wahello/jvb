# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-15 15:30
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('progress_analyzer', '0008_otherstatscumulative_cum_resting_hr'),
    ]

    operations = [
        migrations.CreateModel(
            name='MetaCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_workout_days_count', models.IntegerField(blank=True, null=True)),
                ('cum_resting_hr_days_count', models.IntegerField(blank=True, null=True)),
                ('cum_effort_level_days_count', models.IntegerField(blank=True, null=True)),
                ('cum_vo2_max_days_count', models.IntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='meta_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.AddField(
            model_name='sleeppernightcumulative',
            name='cum_awake_duration_in_hours',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sleeppernightcumulative',
            name='cum_deep_sleep_in_hours',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
