# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2019-01-21 09:58
from __future__ import unicode_literals
from datetime import date

from django.db import migrations


class Migration(migrations.Migration):

	def calculate_age(apps, schema_editor):
		Profile = apps.get_model('registration', 'Profile')
		for profile in Profile.objects.all():
			today = date.today()
			dob = profile.date_of_birth
			age = (today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)))
			profile.user_age = age
			profile.save()

	dependencies = [
	    ('registration', '0008_auto_20190121_0957'),
	]

	operations = [
		migrations.RunPython(calculate_age),
	]