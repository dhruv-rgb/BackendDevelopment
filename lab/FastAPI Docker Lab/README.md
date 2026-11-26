# FastAPI Docker Lab

Containerize a small FastAPI service, run it locally or in Docker, and inspect its health and request timing header.

## Local run

```bash
python -m venv .venv
# Activate the environment, then:
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000/docs`.

## Docker

```bash
docker build -t course-api .
docker run --rm -p 8000:8000 course-api
```

Visit `/health`; successful responses include `X-Process-Time-Ms`. The image runs as an unprivileged user and excludes local environment files.
