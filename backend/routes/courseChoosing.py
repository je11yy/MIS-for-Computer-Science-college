# from fastapi import APIRouter, HTTPException
# from models.schemas import CourseChoosing
# from utils.courses import prepare_course_choosing
# from db.database import db
# from db.courses import get_course_choosing

# router = APIRouter()

# @router.get("", response_model=list[CourseChoosing])
# async def get_all_course_choosing():
#     try:
#         async with db.pool.acquire() as conn:
#             course_choosing = await get_course_choosing(conn)
#             return prepare_course_choosing(course_choosing)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))