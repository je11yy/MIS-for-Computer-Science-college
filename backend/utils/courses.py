from models.schemas import ChosenCourse, Course, CourseChoosing, CourseInfo, StudentWithScore

def create_course(course):
    return Course(
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
    return result

def create_chosen_course(course):
    return ChosenCourse(
        id=course['course_id'],
        name=course['name'],
        credit=course['credit'],
        chosenYear=course['chosen_year'],
        score=course['score']
    )

def prepare_chosen_courses(courses):
    result = []
    for course in courses:
        result.append(create_chosen_course(course))
    return result

def get_course_average_score(studentsGrades):
    total_score = 0
    count = 0
    for grade in studentsGrades:
        if grade['score'] is not None:
            total_score += grade['score']
            count += 1
    return total_score / count if count > 0 else 0

def prepare_course(course, studentsGrades):
    return CourseInfo(
            id=course['course_id'],
            name=course['name'],
            credit=course['credit'],
            grade=course['grade'],
            canceledYear=course['canceled_year'],
            averageScore=get_course_average_score(studentsGrades)
        )

def prepare_student_by_course(students):
    result = []
    for student in students:
        result.append(StudentWithScore(
            id=student["student_id"],
            name=student["student_name"],
            score=student["score"],
            chosenYear=student["chosen_year"]
        ))
    return result

def create_course_choosing(course_choosing):
    return CourseChoosing(
        studentId=course_choosing['student_id'],
        courseId=course_choosing['course_id'],
        chosenYear=course_choosing['chosen_year'],
        score=course_choosing['score']
    )

def prepare_course_choosing(course_choosing):
    course_choosing_result = []
    for course_choosing_item in course_choosing:
        course_choosing_result.append(create_course_choosing(course_choosing_item))
    return course_choosing_result

def create_chosen_course(course):
    return ChosenCourse(
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