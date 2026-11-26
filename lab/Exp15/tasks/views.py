from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from .models import Task

def task_list(request):
    return render(request, "tasks/list.html", {"tasks": Task.objects.all()})

@require_POST
def add_task(request):
    title = request.POST.get("title", "").strip()
    if title:
        Task.objects.create(title=title, notes=request.POST.get("notes", "").strip())
    return redirect("task-list")

@require_POST
def toggle_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    task.complete = not task.complete
    task.save(update_fields=["complete"])
    return redirect("task-list")

@require_POST
def delete_task(request, task_id):
    get_object_or_404(Task, pk=task_id).delete()
    return redirect("task-list")
