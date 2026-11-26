# Lecture 29: Django student JSON endpoints

Install `pip install -r requirements.txt`, initialize with `python manage.py makemigrations students` and `python manage.py migrate`, then run `python manage.py runserver`. Endpoints: `GET/POST /api/students/` and `GET/DELETE /api/students/<id>/`. POST expects JSON with `name`, `email`, and `program`. The write handler is CSRF-exempt for simple command-line use in this classroom demo; production APIs should use deliberate authentication and CSRF protections appropriate to their client model.
