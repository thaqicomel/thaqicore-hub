from fastapi import APIRouter, Depends, HTTPException
import uuid
import aiosqlite

from database import get_db
from models import ReviewCreate, ReviewResponse
from middleware.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ReviewResponse)
async def create_review(
    req: ReviewCreate,
    user: dict = Depends(get_current_user),
    db: aiosqlite.Connection = Depends(get_db),
):
    agent = await db.execute("SELECT id FROM agents WHERE id = ?", (req.agent_id,))
    if not await agent.fetchone():
        raise HTTPException(status_code=404, detail="Agent not found")

    review_id = str(uuid.uuid4())
    try:
        await db.execute(
            "INSERT INTO reviews (id, agent_id, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
            (review_id, req.agent_id, user["user_id"], req.rating, req.comment),
        )
    except aiosqlite.IntegrityError:
        raise HTTPException(status_code=400, detail="You already reviewed this agent")

    # Update agent rating
    cursor = await db.execute(
        "SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE agent_id = ?",
        (req.agent_id,),
    )
    stats = await cursor.fetchone()
    await db.execute(
        "UPDATE agents SET rating_avg = ?, rating_count = ? WHERE id = ?",
        (stats["avg"], stats["cnt"], req.agent_id),
    )
    await db.commit()

    return ReviewResponse(
        id=review_id, agent_id=req.agent_id, user_id=user["user_id"],
        username=user["username"], rating=req.rating, comment=req.comment,
        created_at="",
    )


@router.get("/agent/{agent_id}", response_model=list[ReviewResponse])
async def get_reviews(agent_id: str, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute(
        """
        SELECT r.*, u.username FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.agent_id = ?
        ORDER BY r.created_at DESC
        """,
        (agent_id,),
    )
    rows = await cursor.fetchall()
    return [
        ReviewResponse(
            id=r["id"], agent_id=r["agent_id"], user_id=r["user_id"],
            username=r["username"], rating=r["rating"], comment=r["comment"],
            created_at=r["created_at"],
        )
        for r in rows
    ]
