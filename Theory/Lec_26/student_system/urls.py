from django.urls import path
from students.views import health
urlpatterns = [path("health/", health)]
