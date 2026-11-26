from django.urls import path
from . import views

urlpatterns = [path("", views.task_list, name="task-list"), path("add/", views.add_task, name="task-add"), path("<int:task_id>/toggle/", views.toggle_task, name="task-toggle"), path("<int:task_id>/delete/", views.delete_task, name="task-delete")]
