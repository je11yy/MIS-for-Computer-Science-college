import models

def create_student(student):
    return models.Student(
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
    return models.StudentsResponse(
        students=students_result
    )

def create_course(course):
    return models.Course(
        id=course['course_id'],
        name=course['name'],
        credit=course['credit'],
        grade=course['grade'],
        canceledYear=course['canceled_year'],
    )

def prepare_courses(courses):
    result = []
    for course in courses:
        result.append(create_course(course))
    return models.CoursesResponse(
        courses=result
    )

def create_teacher(teacher):
    return models.Teacher(
        id=teacher['id'],
        name=teacher['name']
    )

def prepare_teachers(teachers):
    teachers_result = []
    for teacher in teachers:
        teachers_result.append(create_teacher(teacher))
    return models.TeachersResponse(
        teachers=teachers_result
    )

def create_course_choosing(course_choosing):
    return models.CourseChoosing(
        studentId=course_choosing['student_id'],
        courseId=course_choosing['course_id'],
        chosenYear=course_choosing['chosen_year'],
        score=course_choosing['score']
    )

def prepare_course_choosing(course_choosing):
    course_choosing_result = []
    for course_choosing_item in course_choosing:
        course_choosing_result.append(create_course_choosing(course_choosing_item))
    return models.CourseChoosingResponse(
        courseChoosing=course_choosing_result
    )

def create_chosen_course(course):
    return models.ChosenCourse(
        id=course['id'],
        name=course['name'],
        credit=course['credit'],
        chosenYear=course['chosen_year'],
        score=course['score']
    )

def compute_average_score(courses):
    total_score = 0
    count = 0
    for course in courses:
        if course['score'] is not None:
            total_score += course['score']
            count += 1
    return total_score / count if count > 0 else 0

def prepare_student(student, courses):
    return models.StudentResponse(student = models.StudentInfo(
        id=student['student_id'],
        name=student['name'],
        sex=student['sex'],
        entranceAge=student['entrance_age'],
        entranceYear=student['entrance_year'],
        studentClass=student['class'],
        averageScore=compute_average_score(courses),
        courses=[create_chosen_course(course) for course in courses]
    ))