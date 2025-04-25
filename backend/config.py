import os
from pydantic import BaseModel

class DBConfig(BaseModel):
    host: str = os.getenv("DB_HOST", "localhost")
    port: int = int(os.getenv("DB_PORT", 5432))
    user: str = os.getenv("DB_USER", "user")
    password: str = os.getenv("DB_PASSWORD", "password")
    dbname: str = os.getenv("DB_NAME", "dbname")

    def get_dsn(self) -> str:
        return f"postgresql+asyncpg://{self.user}:{self.password}@{self.host}:{self.port}/{self.dbname}"

class JWTConfig(BaseModel):
    secret_key: str = os.getenv("JWT_SECRET", "your-secret-key")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    expiration_days: int = int(os.getenv("JWT_EXPIRE_DAYS", 7))

class Settings(BaseModel):
    database: DBConfig = DBConfig()
    jwt: JWTConfig = JWTConfig()

settings = Settings()
