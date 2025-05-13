from fastapi import APIRouter, HTTPException
from utils.courses import prepare_chosen_courses
from db.students import add_student, delete_student, delete_student_courses, get_student, get_student_courses, get_students, update_student, update_student_course_score, update_student_courses
from models.schemas import ChosenCourse, Course, Student, StudentInfo
from db.database import db
from utils.students import prepare_student, prepare_students

router = APIRouter()

@router.get("", response_model=list[Student])
async def get_all():
    try:
        async with db.pool.acquire() as conn:
            students = await get_students(conn)
            return prepare_students(students)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}", response_model=StudentInfo)
async def get(student_id: str):
    try:
        async with db.pool.acquire() as conn:
            student = await get_student(conn, student_id)
            courses = await get_student_courses(conn, student_id)
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")
            return prepare_student(student, courses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/new")
async def create(student: Student):
    try:
        async with db.pool.acquire() as conn:
            await add_student(conn, student)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{student_id}")
async def delete(student_id: str):
    try:
        async with db.pool.acquire() as conn:
            await delete_student(conn, student_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{student_id}")
async def update(student_id: str, student: Student):
    try:
        async with db.pool.acquire() as conn:
            existing_student = await get_student(conn, student_id)
            if not existing_student:
                raise HTTPException(status_code=404, detail="Student not found")
            await update_student(conn, student_id, student)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/course-choice/{student_id}", response_model=list[ChosenCourse])
async def get_course_choice(student_id: str):
    try:
        async with db.pool.acquire() as conn:
            courses = await get_student_courses(conn, student_id)
            return prepare_chosen_courses(courses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/course-choice/{student_id}")
async def update_course_choice(student_id: str, courses_ids: list[str]):
    try:
        async with db.pool.acquire() as conn:
            student_courses = await get_student_courses(conn, student_id)
            for course in student_courses:
                if course['id'] not in courses_ids:
                    await delete_student_courses(conn, student_id, [course['id']])
            await update_student_courses(conn, student_id, courses_ids)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/course-choice/{student_id}/{course_id}/{score}")
async def update_course_choice(student_id: str, course_id: str, score: float):
    try:
        async with db.pool.acquire() as conn:
            await update_student_course_score(conn, student_id, course_id, score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))