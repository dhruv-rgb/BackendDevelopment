from sqlalchemy import ForeignKey, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker

engine = create_engine("sqlite:///./learning.db")
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


class Enrollment(Base):
    __tablename__ = "enrollments"
    learner_id: Mapped[int] = mapped_column(ForeignKey("learners.id"), primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), primary_key=True)
    learner: Mapped["Learner"] = relationship(back_populates="enrollments")
    course: Mapped["Course"] = relationship(back_populates="enrollments")


class Learner(Base):
    __tablename__ = "learners"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="learner", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="course", cascade="all, delete-orphan")


def main():
    Base.metadata.create_all(engine)
    with SessionLocal.begin() as session:
        learner = session.query(Learner).filter_by(name="Mira Sen").first()
        course = session.query(Course).filter_by(title="Backend Development").first()
        if learner is None:
            learner = Learner(name="Mira Sen")
            session.add(learner)
        if course is None:
            course = Course(title="Backend Development")
            session.add(course)
        if not any(link.course is course for link in learner.enrollments):
            learner.enrollments.append(Enrollment(course=course))
    with SessionLocal() as session:
        learner = session.query(Learner).filter_by(name="Mira Sen").one()
        print(f"{learner.name}: {[link.course.title for link in learner.enrollments]}")


if __name__ == "__main__":
    main()
