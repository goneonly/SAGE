from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import UserLevel, UserRole


class SignupRequest (BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    level: UserLevel = UserLevel.beginner

    name: str | None = Field(default=None, max_length=50)
    phone: str | None = Field(default=None, max_length=20)
    age: int | None = Field(default=None, ge=0, le=150)  # 0 이상 150 이하, 벗어나면 422

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

    role: UserRole
    name: str | None
    phone: str | None
    age: int | None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LevelUpdate(BaseModel):
    level: UserLevel
