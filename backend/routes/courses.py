from fastapi import APIRouter, HTTPException
from db.courses import add_course, delete_course, get_course, get_course_students, get_courses, update_course
from db.database import db
from models.schemas import Course, CourseInfo, StudentWithScore
from utils.courses import prepare_course, prepare_courses, prepare_student_by_course

router = APIRouter()

@router.get("", response_model=list[Course])
async def get_all():
    try:
        async with db.pool.acquire() as conn:
            courses = await get_courses(conn)
            return prepare_courses(courses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/new")
async def create(course: Course):
    try:
        async with db.pool.acquire() as conn:
            await add_course(conn, course)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{course_id}", response_model=CourseInfo)
async def get(course_id: str):
    try:
        async with db.pool.acquire() as conn:
            course = await get_course(conn, course_id)
            studentsGrades = await get_course_students(conn, course_id)
            if not course:
                raise HTTPException(status_code=404, detail="Course not found")
            return prepare_course(course, studentsGrades)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{course_id}")
async def delete(course_id: str):
    try:
        async with db.pool.acquire() as conn:
            await delete_course(conn, course_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{course_id}")
async def update(course_id: str, course: Course):
    try:
        async with db.pool.acquire() as conn:
            async with conn.transaction():
                existing_course = await get_course(conn, course_id)
                if not existing_course:
                    raise HTTPException(status_code=404, detail="Course not found")
                await update_course(conn, course_id, course)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{course_id}/students", response_model=list[StudentWithScore])
async def get_students(course_id: str):
    try:
        async with db.pool.acquire() as conn:
            students = await get_course_students(conn, course_id)
            return prepare_student_by_course(students)
                        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))