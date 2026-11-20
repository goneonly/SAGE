from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import UserLevel


class SignupRequest (BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    level: UserLevel = UserLevel.beginner

    @field_validator("password")
    @classmethod
    def check_password_bytes(cls, value: str) -> str:
        # bcrypt 는 72"바이트"까지만 처리한다(bcrypt 5.0 은 넘으면 에러). 한글은 1글자 = 3바이트.
        if len(value.encode()) > 72:
            raise ValueError("비밀번호가 너무 깁니다.")
        return value


class UserOut (BaseModel):
    id: int
    email: EmailStr
    level: UserLevel

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# EmailStr 은 pip install "pydantic[email]" 필요할 수 있음.
