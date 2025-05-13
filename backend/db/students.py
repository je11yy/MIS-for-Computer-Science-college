from asyncpg import Connection
from models.schemas import Student
from .base import fetch_one, call_proc, fetch_all

async def get_students(conn: Connection):
    return await fetch_all(conn, "SELECT * FROM get_students();")

async def get_student(conn: Connection, student_id: str):
    return await fetch_one(conn, "SELECT * FROM get_student($1);", student_id)

async def add_student(conn: Connection, student: Student):
    await call_proc(
        conn,
        "insert_student($1, $2, $3, $4, $5)",
        student.name,
        student.sex,
        student.entranceAge,
        student.entranceYear,
        student.studentClass
    )

async def update_student(conn: Connection, student_id: str, student: Student):
    await call_proc(
        conn,
        "update_student($1, $2, $3, $4, $5, $6)",
        student_id,
        student.name,
        student.sex,
        student.entranceAge,
        student.entranceYear,
        student.studentClass
    )

async def delete_student(conn: Connection, student_id: str):
    await call_proc(conn, "delete_student($1)", student_id)

async def get_student_courses(conn: Connection, student_id: str):
    return await fetch_all(conn, "SELECT * FROM get_student_courses($1);", student_id)

async def update_student_courses(conn: Connection, student_id: str, course_ids: list[str]):
    for course_id in course_ids:
        await call_proc(conn, "insert_course_choosing_if_not_exists($1, $2)", student_id, course_id)

async def delete_student_courses(conn: Connection, student_id: str, course_ids: list[str]):
    for course_id in course_ids:
        await call_proc(conn, "delete_course_choosing($1, $2)", student_id, course_id)

async def update_student_course_score(conn: Connection, student_id: str, course_id: str, score: float):
    await call_proc(conn, "update_student_course_score($1, $2, $3)", student_id, course_id, score)