# Lecture 08: Server-rendered pages with FastAPI and Jinja2

Install `pip install -r requirements.txt`, then run `uvicorn main:app --reload` from this folder. Visit `/` and `/students`; `/students?program=Computer%20Science` demonstrates a query parameter passed to a template. FastAPI receives the request, prepares template context, and Jinja2 renders HTML on the server.
