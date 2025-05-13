from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from models.schemas import Statistics
from routes import classes, courses, students, teachers, user
from auth import AuthService
from db.database import db, get_statistic

app = FastAPI()

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
# app.include_router(courseChoosing.router, prefix="/courseChoosing")
app.include_router(user.router, prefix="/auth")

@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

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