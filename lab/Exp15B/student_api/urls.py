from django.urls import path
from .views import student_detail
urlpatterns = [path("<int:student_id>/", student_detail)]
