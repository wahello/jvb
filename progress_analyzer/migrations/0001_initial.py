# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-01-17 09:58
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AlcoholCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_average_drink_per_week', models.FloatField(blank=True, null=True)),
                ('cum_alcohol_drink_per_week_gpa', models.FloatField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CumulativeSum',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseConsistencyCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_avg_exercise_day', models.FloatField(blank=True, null=True)),
                ('cum_exercise_consistency_gpa', models.FloatField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_consistency_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseStatsCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_workout_duration_in_hours', models.FloatField(blank=True, null=True)),
                ('cum_workout_effort_level', models.FloatField(blank=True, null=True)),
                ('cum_avg_exercise_hr', models.BigIntegerField(blank=True, null=True)),
                ('cum_overall_exercise_gpa', models.FloatField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_stats_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.CreateModel(
            name='MovementConsistencyCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_movement_consistency_gpa', models.FloatField(blank=True, null=True)),
                ('cum_movement_consistency_score', models.BigIntegerField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='movement_consistency_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.CreateModel(
            name='NonExerciseStepsCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_non_exercise_steps', models.BigIntegerField(blank=True, null=True)),
                ('cum_non_exercise_steps_gpa', models.FloatField(blank=True, null=True)),
                ('cum_total_steps', models.BigIntegerField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='non_exercise_steps_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.CreateModel(
            name='NutritionCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_prcnt_unprocessed_food_consumed', models.BigIntegerField(blank=True, null=True)),
                ('cum_prcnt_processed_food_consumed_gpa', models.FloatField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='nutrition_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.CreateModel(
            name='OverallHealthGradeCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_total_gpa_point', models.BigIntegerField(blank=True, null=True)),
                ('cum_overall_health_gpa_point', models.FloatField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='overall_health_grade_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.CreateModel(
            name='PenaltyCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_sleep_aid_penalty', models.BigIntegerField(blank=True, null=True)),
                ('cum_controlled_subs_penalty', models.FloatField(blank=True, null=True)),
                ('cum_smoking_penalty', models.FloatField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='penalty_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.CreateModel(
            name='SleepPerNightCumulative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cum_total_sleep_in_hours', models.FloatField(blank=True, null=True)),
                ('cum_overall_sleep_gpa', models.FloatField(blank=True, null=True)),
                ('rank', models.BigIntegerField(blank=True, null=True)),
                ('user_cum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='sleep_per_night_cum', to='progress_analyzer.CumulativeSum')),
            ],
        ),
        migrations.AddField(
            model_name='alcoholcumulative',
            name='user_cum',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='alcohol_cum', to='progress_analyzer.CumulativeSum'),
        ),
        migrations.AddIndex(
            model_name='cumulativesum',
            index=models.Index(fields=['user', '-created_at'], name='progress_an_user_id_59c3a6_idx'),
        ),
        migrations.AddIndex(
            model_name='cumulativesum',
            index=models.Index(fields=['created_at'], name='progress_an_created_ccb04d_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='cumulativesum',
            unique_together=set([('user', 'created_at')]),
        ),
    ]
