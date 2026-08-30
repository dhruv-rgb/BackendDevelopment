"""
Theory Task 4: Database Integration & Persistent CRUD API
Student: Dhruv Mehta | SAP ID: 590016903 | Batch 4
Course: Backend Development
"""

from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uvicorn

# ==========================================
# 1. DATABASE CONFIGURATION (SQLite)
# ==========================================
DATABASE_URL = "sqlite:///./students.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ==========================================
# 2. SQLALCHEMY DATABASE MODEL
# ==========================================
class StudentDB(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    sap_id = Column(String, unique=True, index=True, nullable=False)
    branch = Column(String, nullable=False)
    batch = Column(String, default="Batch 4")
    email = Column(String, unique=True, nullable=True)


# Create tables in the database
Base.metadata.create_all(bind=engine)


# ==========================================
# 3. PYDANTIC SCHEMAS (Data Validation)
# ==========================================
class StudentBase(BaseModel):
    name: str
    sap_id: str
    branch: str
    batch: Optional[str] = "Batch 4"
    email: Optional[str] = None


class StudentCreate(StudentBase):
    pass


class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True


# ==========================================
# 4. DEPENDENCY FOR DB SESSION
# ==========================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================================
# 5. FASTAPI APPLICATION & ROUTES
# ==========================================
app = FastAPI(
    title="Student Database Management API - Dhruv Mehta",
    description="Task 4: Persistent SQLite Database with SQLAlchemy ORM",
    version="1.0.0"
)


# Seed initial student record on startup
@app.on_event("startup")
def startup_populate_db():
    db = SessionLocal()
    if not db.query(StudentDB).filter(StudentDB.sap_id == "590016903").first():
        dhruv = StudentDB(
            name="Dhruv Mehta",
            sap_id="590016903",
            branch="CSE",
            batch="Batch 4",
            email="dhruvmehta357@gmail.com"
        )
        db.add(dhruv)
        db.commit()
    db.close()


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Task 4: Persistent Database API with SQLite & SQLAlchemy",
        "author": "Dhruv Mehta",
        "sap_id": "590016903",
        "batch": "Batch 4",
        "docs_url": "/docs"
    }


# GET: Read all students from database
@app.get("/students", response_model=List[StudentResponse], tags=["Students"])
def get_all_students(db: Session = Depends(get_db)):
    return db.query(StudentDB).all()


# GET: Read student by ID
@app.get("/students/{student_id}", response_model=StudentResponse, tags=["Students"])
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found in database")
    return student


# POST: Create a new student in database
@app.post("/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED, tags=["Students"])
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(StudentDB).filter(StudentDB.sap_id == student.sap_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student with this SAP ID already exists")

    new_student = StudentDB(**student.model_dump())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


# PUT: Update an existing student
@app.put("/students/{student_id}", response_model=StudentResponse, tags=["Students"])
def update_student(student_id: int, updated_data: StudentCreate, db: Session = Depends(get_db)):
    student = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    for key, value in updated_data.model_dump().items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student


# DELETE: Remove a student from database
@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Students"])
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return None


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
