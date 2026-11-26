from fastapi import Depends, FastAPI, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import ForeignKey, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker

engine = create_engine("sqlite:///./directory.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
class Base(DeclarativeBase): pass

class Department(Base):
    __tablename__ = "departments"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    students: Mapped[list["Student"]] = relationship(back_populates="department")

class Student(Base):
    __tablename__ = "students"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    department: Mapped[Department | None] = relationship(back_populates="students")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="student", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), unique=True)
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="course", cascade="all, delete-orphan")

class Enrollment(Base):
    __tablename__ = "enrollments"
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True)
    student: Mapped[Student] = relationship(back_populates="enrollments")
    course: Mapped[Course] = relationship(back_populates="enrollments")

Base.metadata.create_all(engine)
app = FastAPI(title="Student Directory API", version="1.0.0")

def get_db():
    with SessionLocal() as session:
        yield session

class StudentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=5, max_length=255)
    department_id: int | None = None

class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    department_id: int | None

class DepartmentIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)

class DepartmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str

class CourseIn(BaseModel):
    title: str = Field(min_length=2, max_length=120)

class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str

class EnrollmentIn(BaseModel):
    student_id: int
    course_id: int

@app.get("/students", response_model=list[StudentOut])
def list_students(offset: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), q: str | None = None, db: Session = Depends(get_db)):
    statement = select(Student).order_by(Student.id).offset(offset).limit(limit)
    if q:
        statement = statement.where(Student.name.ilike(f"%{q.strip()}%"))
    return db.scalars(statement).all()

@app.post("/students", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    if db.scalar(select(Student).where(Student.email == payload.email)):
        raise HTTPException(status_code=409, detail="Email already registered")
    if payload.department_id is not None and db.get(Department, payload.department_id) is None:
        raise HTTPException(status_code=404, detail="Department not found")
    student = Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@app.get("/students/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()

@app.get("/departments", response_model=list[DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    return db.scalars(select(Department).order_by(Department.name)).all()

@app.post("/departments", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(payload: DepartmentIn, db: Session = Depends(get_db)):
    if db.scalar(select(Department).where(Department.name == payload.name)):
        raise HTTPException(status_code=409, detail="Department already exists")
    item = Department(name=payload.name)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.get("/courses", response_model=list[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.scalars(select(Course).order_by(Course.title)).all()

@app.post("/courses", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseIn, db: Session = Depends(get_db)):
    if db.scalar(select(Course).where(Course.title == payload.title)):
        raise HTTPException(status_code=409, detail="Course already exists")
    item = Course(title=payload.title)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.post("/enrollments", status_code=status.HTTP_201_CREATED)
def create_enrollment(payload: EnrollmentIn, db: Session = Depends(get_db)):
    student = db.get(Student, payload.student_id)
    course = db.get(Course, payload.course_id)
    if student is None or course is None:
        raise HTTPException(status_code=404, detail="Student or course not found")
    if db.get(Enrollment, (payload.student_id, payload.course_id)):
        raise HTTPException(status_code=409, detail="Enrollment already exists")
    db.add(Enrollment(student=student, course=course))
    db.commit()
    return {"student_id": student.id, "course_id": course.id}
