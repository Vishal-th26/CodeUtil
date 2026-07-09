from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from jose import jwt
from app.core.config import settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Extracting token directly
def get_token(token: str = Depends(oauth2_scheme)):
    return token


# Verify token
def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# Get current user
def get_current_user(token: str = Depends(get_token)):
    payload = verify_token(token)

    email = payload.get("sub")

    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return email