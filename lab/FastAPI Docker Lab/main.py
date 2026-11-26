from fastapi import FastAPI, Request
from time import perf_counter

app = FastAPI(title="Containerized Course API", version="1.0.0")


@app.middleware("http")
async def measure_request(request: Request, call_next):
    started = perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time-Ms"] = f"{(perf_counter() - started) * 1000:.2f}"
    return response


@app.get("/")
def home():
    return {"service": "course-api", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/courses")
def courses():
    return [{"id": 1, "name": "Backend Development"}, {"id": 2, "name": "Web APIs"}]
