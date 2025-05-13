from fastapi import APIRouter, HTTPException
from db.database import db
from db.teachers import add_course_teacher, add_teacher, delete_course_teacher, delete_teacher, get_teacher, get_teacher_courses, get_teachers, update_teacher
from models.schemas import Course, Teacher, TeacherDetails
from utils.teachers import prepare_teacher_courses, prepare_teacher_details, prepare_teachers

router = APIRouter()

@router.get("", response_model=list[Teacher])
async def get_all():
    try:
        async with db.pool.acquire() as conn:
            teachers = await get_teachers(conn)
            return prepare_teachers(teachers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{teacher_id}", response_model=list[Course])
async def get(teacher_id: str):
    try:
        async with db.pool.acquire() as conn:
            courses = await get_teacher_courses(conn, teacher_id)
            if not courses:
                courses = []
            return prepare_teacher_courses(courses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/details/{teacher_id}", response_model=TeacherDetails)
async def get_details(teacher_id: str):
    try:
        async with db.pool.acquire() as conn:
            async with conn.transaction():
                teacher = await get_teacher(conn, teacher_id)
                courses = await get_teacher_courses(conn, teacher_id)
                if not courses:
                    courses = []
                courses = prepare_teacher_courses(courses)
                return prepare_teacher_details(teacher, courses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/new")
async def create(teacher: Teacher):
    try:
        async with db.pool.acquire() as conn:
            async with conn.transaction():
                teacher_id = await add_teacher(conn, teacher)
                for course in teacher.courses:
                    await add_course_teacher(conn, course.id, teacher_id['insert_teacher'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/{teacher_id}")
async def delete(teacher_id: str):
    try:
        async with db.pool.acquire() as conn:
            await delete_teacher(conn, teacher_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{teacher_id}")
async def update(teacher_id: str, teacher: Teacher):
    try:
        async with db.pool.acquire() as conn:
            async with conn.transaction():
                await update_teacher(conn, teacher_id, teacher)
                unprepared_courses = await get_teacher_courses(conn, teacher_id)
                courses = prepare_teacher_courses(unprepared_courses)
                for course in teacher.courses:
                    if course not in courses:
                        await add_course_teacher(conn, course.id, teacher_id)
                for course in courses:
                    if course not in teacher.courses:
                        await delete_course_teacher(conn, course.id, teacher_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))