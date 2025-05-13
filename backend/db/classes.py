from asyncpg import Connection
from .base import fetch_row

async def get_students_average_score_by_class(conn: Connection, student_class: str):
    row = await fetch_row(conn, "SELECT get_students_average_score_by_class($1);", student_class)
    return row[0] if row else None