from django.db import models
from django.db.models.fields import NullBooleanField

# Create your models here.
class Graph(models.Model):
    name=models.CharField(max_length=50,null=True)
    data=models.JSONField(default=dict)
    config=models.JSONField(default=dict)
    def __str__(self)->str:
        return self.name
