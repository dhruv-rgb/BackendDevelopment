from pydantic import BaseModel, ConfigDict, EmailStr, Field


class Student(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str = Field(min_length=2, max_length=80, examples=["Mira Sen"])
    email: EmailStr
    age: int = Field(ge=16, le=100)
    skills: list[str] = Field(default_factory=list, max_length=12)


if __name__ == "__main__":
    sample = Student(name="  Mira Sen ", email="mira@example.com", age=20, skills=["Python", "SQL"])
    print(sample.model_dump())
