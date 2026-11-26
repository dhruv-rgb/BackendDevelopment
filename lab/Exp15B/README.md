# Experiment 15B: Multi-app Django and external API proxy

The project separates a simple home page, task JSON API, and student API proxy into three Django apps. Install [uv](https://docs.astral.sh/uv/), run `uv sync`, then `uv run python manage.py makemigrations tasks`, `uv run python manage.py migrate`, and `uv run python manage.py runserver`.

- `/` — project overview
- `/api/tasks/` — GET or POST tasks
- `/api/tasks/<id>/` — PATCH `{"done": true}` or DELETE
- `/api/students/<id>/` — fetch a limited public profile from JSONPlaceholder

The proxy has a short timeout and converts upstream failures into a 502 response. It needs network access at request time. The task demo disables CSRF for curl-based classroom requests; production clients require deliberate authentication and CSRF protections.
