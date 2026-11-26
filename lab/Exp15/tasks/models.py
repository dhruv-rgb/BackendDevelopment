from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=120)
    notes = models.TextField(blank=True)
    complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["complete", "-created_at"]

    def __str__(self):
        return self.title
