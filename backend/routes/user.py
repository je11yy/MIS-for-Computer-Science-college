from fastapi import APIRouter, HTTPException
from fastapi.security import HTTPBearer
from utils.user import prepare_user
from db.user import add_user, get_user
from db.database import db
from models.schemas import Login, User, UserOut
from auth import AuthService

router = APIRouter()

auth_service = AuthService(config_path="config.json", db=db)
auth_scheme = HTTPBearer()

@router.post("/register", response_model=UserOut)
async def register_user(user: User):
    try:
        async with db.pool.acquire() as conn:
            existing_user = await get_user(conn, user.username)
            if existing_user:
                raise HTTPException(status_code=400, detail="Username already exists")
            user.password = auth_service.hash_password(user.password)
            if len(user.student_id) == 0:
                user.student_id = None
            if len(user.teacher_id) == 0:
                user.teacher_id = None

            if (user.student_id == None and user.teacher_id == None) or (user.student_id != None and user.teacher_id != None):
                raise HTTPException(status_code=404, detail="Fill in student id OR teacher id!")
        
            await add_user(conn, user)
            return UserOut(
                username=user.username,
                role=user.role,
                student_id=user.student_id,
                teacher_id=user.teacher_id
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/login")
async def login_user(user: Login):
    try:
        async with db.pool.acquire() as conn:
            db_user = await get_user(conn, user.username)
            if not db_user or not auth_service.verify_password(user.password, db_user["password"]):
                raise HTTPException(status_code=401, detail="Invalid username or password")
            token = auth_service.create_jwt(user.username, db_user["role"], db_user["student_id"], db_user["teacher_id"])
            return {"token": token, "token_type": "bearer"}
    except Exception as e:      
        raise HTTPException(status_code=500, detail=str(e))