# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-07-07 14:58
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('hrr', '0013_auto_20180707_1113'),
    ]

    operations = [
        migrations.CreateModel(
            name='AA',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField()),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('total_time', models.FloatField(blank=True, null=True)),
                ('aerobic_zone', models.FloatField(blank=True, null=True)),
                ('anaerobic_zone', models.FloatField(blank=True, null=True)),
                ('below_aerobic_zone', models.FloatField(blank=True, null=True)),
                ('aerobic_range', models.FloatField(blank=True, null=True)),
                ('anaerobic_range', models.FloatField(blank=True, null=True)),
                ('below_aerobic_range', models.FloatField(blank=True, null=True)),
                ('hrr_not_recorded', models.FloatField(blank=True, null=True)),
                ('percent_hrr_not_recorded', models.FloatField(blank=True, null=True)),
                ('percent_aerobic', models.FloatField(blank=True, null=True)),
                ('percent_below_aerobic', models.FloatField(blank=True, null=True)),
                ('percent_anaerobic', models.FloatField(blank=True, null=True)),
                ('total_percent', models.FloatField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name='aa',
            index=models.Index(fields=['user', '-created_at'], name='hrr_aa_user_id_3a825e_idx'),
        ),
        migrations.AddIndex(
            model_name='aa',
            index=models.Index(fields=['created_at'], name='hrr_aa_created_4df8af_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='aa',
            unique_together=set([('user', 'created_at')]),
        ),
    ]
