from pydantic import BaseModel, EmailStr

from app.models.user import UserLevel


class SignupRequest (BaseModel):
    email: EmailStr
    password: str
    level: UserLevel = UserLevel.beginner


class UserOut (BaseModel):
    id: int
    email: EmailStr
    level: UserLevel

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# EmailStr 은 pip install "pydantic[email]" 필요할 수 있음.
