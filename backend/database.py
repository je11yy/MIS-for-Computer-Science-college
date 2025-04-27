from asyncpg import Connection, create_pool
import os

import models

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        self.pool = await create_pool(
            user=os.getenv("DB_USER", "user"),
            password=os.getenv("DB_PASSWORD", "password"),
            database=os.getenv("DB_NAME", "dbname"),
            host=os.getenv("DB_HOST", "db"),
            port=int(os.getenv("DB_PORT", 5432))
        )
    
    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            self.pool = None

    async def get_students(self, conn: Connection):
        return await conn.fetch(
            "SELECT * FROM get_students();"
        )

    async def get_student(self, conn: Connection, student_id: str):
        result = await conn.fetch(
            "SELECT * FROM get_student($1);",
            student_id
        )
        if result:
            return result[0]
        return None

    async def add_student(self, conn: Connection, student: models.Student):
        return await conn.fetch(
            "CALL insert_student($1, $2, $3, $4, $5);",
            student.name, student.sex, student.entranceAge, student.entranceYear, student.studentClass
        )
    
    async def get_student_courses(self, conn: Connection, student_id: str):
        return await conn.fetch(
            "SELECT * FROM get_student_courses($1);",
            student_id
        )

    async def get_courses(self, conn: Connection):
        return await conn.fetch(
            "SELECT * FROM get_courses();"
        )