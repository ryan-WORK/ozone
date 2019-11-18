# Generated by Django 2.2.1 on 2019-11-13 05:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('owf_groups', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='owfgrouppeople',
            unique_together=set(),
        ),
        migrations.AddConstraint(
            model_name='owfgrouppeople',
            constraint=models.UniqueConstraint(fields=('group', 'person'), name='unique_owfgroup_people'),
        ),
    ]
