from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "complete", "created_at")
    list_filter = ("complete",)
    search_fields = ("title", "notes")
