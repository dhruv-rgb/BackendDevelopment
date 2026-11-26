# Lecture 19: Relational student API

Install `pip install -r requirements.txt`, then start with `uvicorn main:app --reload`. The SQLite schema has departments, students, courses, and an explicit enrollment join table. The API demonstrates validated request models, response models, pagination, name filtering, duplicate handling, and 404 responses. Interactive API docs are at `/docs`. Tables are created automatically on startup; this teaching example uses `create_all`, while production schema changes should use migrations.
