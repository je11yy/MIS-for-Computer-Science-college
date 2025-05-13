from asyncpg import Connection
from .base import call_proc, fetch_one
from models.schemas import User

async def add_user(conn: Connection, user: User):
    await call_proc(
        conn,
        "insert_user($1, $2, $3, $4, $5)",
        user.username,
        user.password,
        user.role,
        user.student_id,
        user.teacher_id
    )

async def get_user(conn: Connection, username: str):
    return await conn.fetchrow("SELECT * FROM get_user($1);", username)

async def get_admin_users(conn: Connection):
    return await fetch_one(conn, "SELECT * FROM get_admin_users()")