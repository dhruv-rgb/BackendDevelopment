import json
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import IntegrityError
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Student

def serialize(student):
    return {"id": student.id, "name": student.name, "email": student.email, "program": student.program}

@csrf_exempt
@require_http_methods(["GET", "POST"])
def student_collection(request):
    if request.method == "GET":
        return JsonResponse([serialize(item) for item in Student.objects.order_by("id")], safe=False)
    try:
        data = json.loads(request.body)
        name, email, program = (str(data.get(key, "")).strip() for key in ("name", "email", "program"))
        if not name or not email or not program:
            return JsonResponse({"error": "name, email, and program are required"}, status=400)
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({"error": "email must be valid"}, status=400)
        try:
            student = Student.objects.create(name=name, email=email, program=program)
        except IntegrityError:
            return JsonResponse({"error": "email already exists"}, status=409)
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({"error": "Send a JSON object"}, status=400)
    return JsonResponse(serialize(student), status=201)

@require_http_methods(["GET", "DELETE"])
def student_detail(request, student_id):
    try:
        student = Student.objects.get(pk=student_id)
    except Student.DoesNotExist:
        return JsonResponse({"error": "student not found"}, status=404)
    if request.method == "DELETE":
        student.delete()
        return HttpResponse(status=204)
    return JsonResponse(serialize(student))
