from db.database import Database
import json
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

class AuthService:
    def __init__(self, config_path: str, db: Database):
        with open(config_path, "r") as config_file:
            self.config = json.load(config_file)['jwt']
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def create_jwt(self, username: str, user_role: str, student_id: str = None, teacher_id: str = None) -> str:
        expiration = datetime.now(timezone.utc) + timedelta(days=self.config["jwt_expiration_days"])
        token_data = {"username": username, "role": user_role, "exp": expiration}
        if student_id:
            token_data["student_id"] = student_id
        if teacher_id:
            token_data["teacher_id"] = teacher_id
        return jwt.encode(token_data, self.config["jwt_secret_key"], algorithm=self.config["jwt_algorithm"])

    def decode_token(self, token: str) -> dict:
        payload = jwt.decode(token, self.config["jwt_secret_key"], algorithms=[self.config["jwt_algorithm"]])
        return payload