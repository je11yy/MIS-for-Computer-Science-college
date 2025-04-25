import base64
from fastapi import Depends, FastAPI, HTTPException, Response, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
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

# @app.on_event("startup")
# async def startup():
#     await db.connect()

class HiResponse(BaseModel):
    message: str

@app.get("/hi", response_model = HiResponse)
async def sayHi():
    return {"message": "Hi from the backend!"}