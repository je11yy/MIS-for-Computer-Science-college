from asyncpg import create_pool
import os

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        self.pool = await create_pool(
            user=os.getenv("DB_USER", "user"),
            password=os.getenv("DB_PASSWORD", "password"),
            database=os.getenv("DB_NAME", "dbname"),
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", 5432))
        )