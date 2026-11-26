from django.urls import path
from . import views
urlpatterns = [path("students/", views.student_collection), path("students/<int:student_id>/", views.student_detail)]
