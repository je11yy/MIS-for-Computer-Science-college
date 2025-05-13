from models.schemas import UserOut

def prepare_user(user):
    return UserOut(
        username=user["username"],
        role=user["role"],
        student_id=user["student_id"],
        teacher_id=user["teacher_id"],
    )