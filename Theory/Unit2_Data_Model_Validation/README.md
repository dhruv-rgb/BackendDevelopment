# Unit 2: Pydantic validation

Install `pip install -r requirements.txt` and run `python validation.py`. The model strips surrounding whitespace, validates email format, constrains age and list size, and rejects undeclared fields. To inspect error behavior, construct `Student` with an invalid email or age and review the resulting `ValidationError`.
