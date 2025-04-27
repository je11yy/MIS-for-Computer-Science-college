import base64
from fastapi import Depends, FastAPI, HTTPException, Response, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
import functional, models
from database import Database
from auth import AuthService
from asyncpg.exceptions import PostgresError
import os
import subprocess
from datetime import datetime

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

db = Database()
auth_service = AuthService(config_path="config.json", db=db)
auth_scheme = HTTPBearer()

@app.on_event("startup")
async def startup():
    await db.connect()

class HiResponse(BaseModel):
    message: str

@app.get("/hi", response_model = HiResponse)
async def sayHi():
    return {"message": "Hi from the backend!"}

@app.get("/")
def read_root():
    return {"message": "Backend is alive!"}

@app.get("/students", response_model=models.StudentsResponse)
async def get_students():
    try:
        async with db.pool.acquire() as conn:
            students = await db.get_students(conn)
            return functional.prepare_students(students)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/student")
async def create_student(student: models.Student):
    try:
        async with db.pool.acquire() as conn:
            await db.add_student(conn, student)
            return {"message": "Product added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/students/{student_id}", response_model=models.StudentResponse)
async def get_student(student_id: str):
    try:
        async with db.pool.acquire() as conn:
            student = await db.get_student(conn, student_id)
            courses = await db.get_student_courses(conn, student_id)
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")
            return functional.prepare_student(student, courses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/courses", response_model=models.CoursesResponse)
async def get_courses():
    try:
        async with db.pool.acquire() as conn:
            courses = await db.get_courses(conn)
            return functional.prepare_courses(courses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/teachers", response_model=models.TeachersResponse)
async def get_teachers():
    try:
        async with db.pool.acquire() as conn:
            teachers = await db.get_teachers(conn)
            return functional.prepare_teachers(teachers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/courseChoosing", response_model=models.CourseChoosingResponse)
async def get_course_choosing():
    try:
        async with db.pool.acquire() as conn:
            course_choosing = await db.get_course_choosing(conn)
            return functional.prepare_course_choosing(course_choosing)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))