from django.contrib import admin
from django.urls import include, path
urlpatterns = [path("admin/", admin.site.urls), path("", include("todo.urls")), path("api/tasks/", include("tasks.urls")), path("api/students/", include("student_api.urls"))]
