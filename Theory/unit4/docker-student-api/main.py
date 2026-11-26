from fastapi import FastAPI
app = FastAPI(title="Student Microservice")
@app.get("/health")
def health(): return {"status": "ok"}
@app.get("/students/{student_id}")
def student(student_id: int): return {"id": student_id, "name": f"Student {student_id}"}
