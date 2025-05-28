from asyncpg import Connection
from models.schemas import Course
from .base import fetch_one, call_proc, fetch_all

async def get_course_students(conn: Connection, course_id: str):
    return await fetch_all(conn, "SELECT * FROM get_course_scores($1);", course_id)

async def get_courses(conn: Connection):
    return await fetch_all(conn, "SELECT * FROM get_courses();")

async def get_course(conn: Connection, course_id: str):
    return await fetch_one(conn, "SELECT * FROM get_course($1);", course_id)


async def add_course(conn: Connection, course: Course):
    await call_proc(conn, "insert_course($1, $2, $3, $4)", course.name, course.credit, course.grade, course.canceledYear)


async def delete_course(conn: Connection, course_id: str):
    await call_proc(conn, "delete_course($1)", course_id)


async def update_course(conn: Connection, course_id: str, course: Course):
    await call_proc(conn, "update_course($1, $2, $3, $4, $5)", course_id, course.name, course.credit, course.grade, course.canceledYear)

