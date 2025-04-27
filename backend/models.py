from typing import Optional
from pydantic import BaseModel

class Student(BaseModel):
    id: str
    name: str
    sex: str
    entranceAge: int
    entranceYear: int
    studentClass: str

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

class StudentResponse(BaseModel):
    student: StudentInfo

class Teacher(BaseModel):
    id: str
    name: str

class Course(BaseModel):
    id: str
    name: str
    credit: float
    grade: float
    canceledYear: Optional[int]

class CourseChoosing(BaseModel):
    studentId: str
    courseId: str
    chosenYear: int
    score: float

class StudentsResponse(BaseModel):
    students: list[Student]
    
class TeachersResponse(BaseModel):
    teachers: list[Teacher]

class CoursesResponse(BaseModel):
    courses: list[Course]

class CourseChoosingResponse(BaseModel):
    courseChoosing: list[CourseChoosing]