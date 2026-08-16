from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

# from app.api.deps import ...  # 아직 없음 — get_db는 db.session에서 직접 import
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import SignupRequest, TokenResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut, status_code=201)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    exists = db.scalar(select(User).where(User.email == body.email))
    if exists:
        raise HTTPException(status_code=409, detail="이미 가입된 이메일입니다.")
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        level=body.level,
    )
    db.add(user)
    db.commit()
    db.refresh(user)    # DB 가 채운 id, create_at 을 다시 읽어옴
    return user


@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == form.username))
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다.")
    return TokenResponse(access_token=create_access_token(user.id))

# OAuth2 표준 폼은 username 필드를 쓴다  --  거기에 email 을 넣는 규칙
