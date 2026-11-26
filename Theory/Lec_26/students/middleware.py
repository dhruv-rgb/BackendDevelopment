import logging
from time import perf_counter

logger = logging.getLogger("request_timing")

class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        started = perf_counter()
        response = self.get_response(request)
        elapsed_ms = (perf_counter() - started) * 1000
        response["X-Request-Duration-Ms"] = f"{elapsed_ms:.2f}"
        logger.info("%s %s -> %s (%.2f ms)", request.method, request.path, response.status_code, elapsed_ms)
        return response
