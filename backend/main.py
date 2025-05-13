from asyncpg import Connection
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth import AuthService
from db.user import add_user, get_admin_users
from models.schemas import Statistics, User
from routes import classes, courses, students, teachers, user
from db.database import db, get_statistic
from contextlib import asynccontextmanager

auth_service = AuthService(config_path="config.json", db=db)

async def check_if_admin_exist(conn: Connection):
    admin = await get_admin_users(conn)
    if not admin:
       await add_user(conn, User(
            username="admin",
            password=auth_service.hash_password("admin"),
            role="admin"
        ))

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    async with db.pool.acquire() as conn:
        await check_if_admin_exist(conn)
    yield
    await db.disconnect()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000", 
    "https://improved-space-chainsaw-p4w65qgqgr7frwq7-3000.githubpreview.dev",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router, prefix="/students")
app.include_router(courses.router, prefix="/courses")
app.include_router(teachers.router, prefix="/teachers")
app.include_router(classes.router, prefix="/class")
app.include_router(user.router, prefix="/auth")

@app.get("/statistics", response_model=Statistics)
async def get():
    try:
        async with db.pool.acquire() as conn:
            statistic = await get_statistic(conn)
            return Statistics(
                totalStudents=statistic["total_students"],
                totalTeachers=statistic["total_teachers"],
                totalCourses=statistic["total_courses"],
                totalClasses=statistic["total_classes"],
                averageScore=statistic["average_score"]
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))