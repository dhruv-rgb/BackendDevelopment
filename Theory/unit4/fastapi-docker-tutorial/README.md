# Unit 4: FastAPI, Docker Compose, and Nginx

Build two API containers behind an Nginx reverse proxy. Run `docker compose up --build`, then visit `http://localhost:8080/health` or `/docs`. Nginx distributes requests across the two service instances and forwards client headers. The API exposes a simple health route and adds request timing. Stop with `docker compose down`.
