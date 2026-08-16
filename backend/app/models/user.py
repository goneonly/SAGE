# 비밀번호는 암호화가 아니라 해싱한다. 암호화는 되돌릴 수 있고(복호화), 해싱은 못 되돌린다. DB가 털려도 원문을 모르게 하려고 일부러 못 되돌리는 방식을 쓴다. 로그인 검증은 "입력값을 같은 방식으로 해시해서 저장된 해시와 비교"로 한다. bcrypt는 느리게 설계된 해시라 무차별 대입도 어렵다.

import enum
from datetime import datetime

from sqlalchemy import Enum, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserLevel (str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    level: Mapped[UserLevel] = mapped_column(
        Enum(UserLevel, name="user_level"), default=UserLevel.beginner
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
