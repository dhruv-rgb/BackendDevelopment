from time import perf_counter
from fastapi import FastAPI, Request

app = FastAPI(title="Unit 4 Service")

@app.middleware("http")
async def timing(request: Request, call_next):
    started = perf_counter()
    response = await call_next(request)
    response.headers["X-Request-Time-Ms"] = f"{(perf_counter() - started) * 1000:.2f}"
    return response

@app.get("/")
def root(): return {"service": "unit4-api", "docs": "/docs"}

@app.get("/health")
def health(): return {"status": "ok"}
