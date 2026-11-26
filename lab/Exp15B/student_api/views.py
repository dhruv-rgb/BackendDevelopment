import json
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen
from django.http import JsonResponse
from django.views.decorators.http import require_GET

@require_GET
def student_detail(request, student_id):
    upstream = Request(f"https://jsonplaceholder.typicode.com/users/{student_id}", headers={"Accept": "application/json"})
    try:
        with urlopen(upstream, timeout=4) as response:
            payload = json.load(response)
    except HTTPError as error:
        return JsonResponse({"error": "Student service returned an error", "status": error.code}, status=502)
    except (URLError, TimeoutError):
        return JsonResponse({"error": "Student service is unavailable"}, status=502)
    if not payload:
        return JsonResponse({"error": "Student not found"}, status=404)
    return JsonResponse({"id": payload["id"], "name": payload["name"], "email": payload["email"], "source": "JSONPlaceholder"})
