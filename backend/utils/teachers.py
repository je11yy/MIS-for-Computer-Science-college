from models import schemas
from .courses import create_course

def create_teacher(teacher):
    return schemas.Teacher(
        id=teacher['teacher_id'],
        name=teacher['name'],
        courses=[create_course(course) for course in teacher['courses']] if 'courses' in teacher else None
    )

def prepare_teachers(teachers):
    teachers_result = []
    for teacher in teachers:
        teachers_result.append(create_teacher(teacher))
    return teachers_result

def prepare_teacher_courses(courses):
    courses_result = []
    for course in courses:
        courses_result.append(create_course(course))
    return courses_result

def prepare_teacher_details(teacher, courses):
    return schemas.TeacherDetails(
        id=teacher["teacher_id"],
        name=teacher["name"],
        courses=courses
    )