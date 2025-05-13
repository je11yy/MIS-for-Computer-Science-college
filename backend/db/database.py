from asyncpg import Connection, create_pool
import os
from .base import fetch_one

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

db = Database()

async def get_statistic(conn: Connection):
    return await fetch_one(conn, "SELECT * FROM get_statistics();")