from asyncpg import Connection
from models.schemas import Teacher
from .base import fetch_one, call_proc, fetch_all

async def get_teachers(conn: Connection):
    return await fetch_all(conn, "SELECT * FROM get_teachers();")

async def get_teacher(conn: Connection, teacher_id: str):
    return await fetch_one(conn, "SELECT * FROM get_teacher($1);", teacher_id)

async def add_course_teacher(conn: Connection, course_id: str, teacher_id: str):
    await call_proc(conn, "insert_course_teacher($1, $2)", course_id, teacher_id)

async def delete_course_teacher(conn: Connection, course_id: str, teacher_id: str):
    await call_proc(conn, "delete_course_teacher($1, $2)", course_id, teacher_id)

async def add_teacher(conn: Connection, teacher: Teacher):
    return await fetch_one(conn, "SELECT * FROM insert_teacher($1);", teacher.name)

async def delete_teacher(conn: Connection, teacher_id: str):
    await call_proc(conn, "delete_teacher($1)", teacher_id)

async def update_teacher(conn: Connection, teacher_id: str, teacher: Teacher):
    await call_proc(conn, "update_teacher($1, $2)", teacher_id, teacher.name)

async def get_teacher_courses(conn: Connection, teacher_id: str):
    return await fetch_all(conn, "SELECT * FROM get_courses_by_teacher($1);", teacher_id)