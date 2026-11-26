# Experiment 15: Django task manager

This server-rendered Django MVT project stores tasks in SQLite and supports create, complete/reopen, and delete actions. From this directory, install `pip install -r requirements.txt`, then run `python manage.py makemigrations tasks`, `python manage.py migrate`, and `python manage.py runserver`. Visit `http://127.0.0.1:8000/`. All state-changing forms use POST and include CSRF tokens.
