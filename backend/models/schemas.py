from typing import List, Optional
from pydantic import BaseModel

class Student(BaseModel):
    id: str
    name: str
    sex: str
    entranceAge: int
    entranceYear: int
    studentClass: str

class StudentWithScore(BaseModel):
    id: str
    name: str
    score: float
    chosenYear: int

class ChosenCourse(BaseModel):
    id: str
    name: str
    credit: int
    chosenYear: int
    score: Optional[float]

class StudentInfo(BaseModel):
    id: str
    name: str
    sex: str
    entranceAge: int
    entranceYear: int
    studentClass: str
    averageScore: float
    courses: Optional[list[ChosenCourse]]

class Course(BaseModel):
    id: str
    name: str
    credit: float
    grade: float
    canceledYear: Optional[int]

class Teacher(BaseModel):
    id: str
    name: str
    courses: Optional[list[Course]]

class TeacherCourses(BaseModel):
    courses: list[Course]

class CourseInfo(BaseModel):
    id: str
    name: str
    credit: float
    grade: float
    canceledYear: Optional[int]
    averageScore: float

class CourseChoosing(BaseModel):
    studentId: str
    courseId: str
    chosenYear: int
    score: float

class CourseChoosingResponse(BaseModel):
    courseChoosing: list[CourseChoosing]

class ClassInfo(BaseModel):
    className: str
    students: list[Student]
    averageScore: float

class User(BaseModel):
    username: str
    password: str
    role: str
    student_id: str | None = None
    teacher_id: str | None = None

class UserOut(BaseModel):
    username: str
    role: str
    student_id: str | None = None
    teacher_id: str | None = None

class Login(BaseModel):
    username: str
    password: str
    student_id: str | None = None
    teacher_id: str | None = None

class Statistics(BaseModel):
    totalStudents: int
    totalTeachers: int
    totalCourses: int
    totalClasses: int
    averageScore: float

class TeacherDetails(BaseModel):
    id: str
    name: str
    courses: list[Course]