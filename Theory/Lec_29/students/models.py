from django.db import models
class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    program = models.CharField(max_length=80)
    def __str__(self):
        return self.name
