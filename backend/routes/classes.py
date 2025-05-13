from fastapi import APIRouter, HTTPException
from db.classes import get_students_average_score_by_class
from db.database import db

router = APIRouter()

@router.get("/{class_name}", response_model=float)
async def get_class_average_score(class_name: str):
    try:
        async with db.pool.acquire() as conn:
            return await get_students_average_score_by_class(conn, class_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))