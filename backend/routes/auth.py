from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timedelta, timezone
import uuid
import jwt
import bcrypt
import aiosqlite

from database import get_db
from models import RegisterRequest, LoginRequest, AuthResponse
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRE_HOURS

router = APIRouter()


@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest, db: aiosqlite.Connection = Depends(get_db)):
    existing = await db.execute(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        (req.username, req.email),
    )
    if await existing.fetchone():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    user_id = str(uuid.uuid4())
    password_hash = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()

    await db.execute(
        "INSERT INTO users (id, username, email, password_hash, display_name) VALUES (?, ?, ?, ?, ?)",
        (user_id, req.username, req.email, password_hash, req.display_name or req.username),
    )
    await db.commit()

    token = _create_token(user_id, req.username)
    return AuthResponse(token=token, user_id=user_id, username=req.username)


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute(
        "SELECT id, username, password_hash FROM users WHERE username = ?",
        (req.username,),
    )
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(req.password.encode(), row["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = _create_token(row["id"], row["username"])
    return AuthResponse(token=token, user_id=row["id"], username=row["username"])


def _create_token(user_id: str, username: str) -> str:
    payload = {
        "sub": user_id,
        "username": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
