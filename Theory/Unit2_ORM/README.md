# Unit 2: SQLAlchemy ORM relationships

Install `pip install -r requirements.txt` and run `python main.py`. The example uses a SQLite database and an explicit `Enrollment` association model. Both sides use `back_populates`, and deleting a learner or course removes its enrollment links. Repeated runs reuse the same sample learner and course.
