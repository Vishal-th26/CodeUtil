from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.db.models import User
from backend.app.schemas.user import UserCreate, UserResponse, Token
from backend.app.services.auth_service import register_user, login_user
from backend.app.auth.deps import get_current_user

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        user = register_user(db, payload.email, payload.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        token = login_user(db, form_data.username, form_data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    return {"access_token": token, "token_type": "bearer"}
"""

@router.get("/me", response_model=UserResponse)
def read_current_user(email: str = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

    """