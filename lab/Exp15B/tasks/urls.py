from django.urls import path
from . import views
urlpatterns = [path("", views.collection), path("<int:task_id>/", views.detail)]
