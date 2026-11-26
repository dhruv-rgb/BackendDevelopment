import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Task

def encode(task):
    return {"id": task.id, "title": task.title, "done": task.done}

@csrf_exempt
@require_http_methods(["GET", "POST"])
def collection(request):
    if request.method == "GET":
        return JsonResponse([encode(task) for task in Task.objects.order_by("id")], safe=False)
    try:
        payload = json.loads(request.body)
        title = payload.get("title", "").strip()
        if not title:
            return JsonResponse({"error": "title is required"}, status=400)
        task = Task.objects.create(title=title)
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({"error": "Send a JSON object with a title"}, status=400)
    return JsonResponse(encode(task), status=201)

@csrf_exempt
@require_http_methods(["PATCH", "DELETE"])
def detail(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"error": "task not found"}, status=404)
    if request.method == "DELETE":
        task.delete()
        return JsonResponse({}, status=204)
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Send valid JSON"}, status=400)
    if "done" in payload:
        task.done = bool(payload["done"])
        task.save(update_fields=["done"])
    return JsonResponse(encode(task))
