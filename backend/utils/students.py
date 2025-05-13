from models import schemas
from .courses import compute_average_score, create_chosen_course

def create_student(student):
    return schemas.Student(
        id=student['student_id'],
        name=student['name'],
        sex=student['sex'],
        entranceAge=student['entrance_age'],
        entranceYear=student['entrance_year'],
        studentClass=student['class']
    )

def prepare_students(students):
    students_result = []
    for student in students:
        students_result.append(create_student(student))
    return students_result

def prepare_student(student, courses):
    return schemas.StudentInfo(
        id=student['student_id'],
        name=student['name'],
        sex=student['sex'],
        entranceAge=student['entrance_age'],
        entranceYear=student['entrance_year'],
        studentClass=student['class'],
        averageScore=compute_average_score(courses),
        courses=[create_chosen_course(course) for course in courses]
    )