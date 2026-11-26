from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

app = FastAPI(title="Course Directory")
templates = Jinja2Templates(directory="templates")
students = [
    {"id": 1, "name": "Mira Sen", "program": "Computer Science"},
    {"id": 2, "name": "Arjun Rao", "program": "Information Technology"},
    {"id": 3, "name": "Leena Das", "program": "Computer Science"},
]


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(request, "home.html", {"title": "Course Directory", "count": len(students)})


@app.get("/students")
def student_list(request: Request, program: str | None = None):
    visible = [student for student in students if not program or student["program"].casefold() == program.casefold()]
    return templates.TemplateResponse(request, "students.html", {"students": visible, "program": program or ""})
