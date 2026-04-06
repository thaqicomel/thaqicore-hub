from fastapi import APIRouter, Depends, HTTPException
import uuid
import json
import aiosqlite

from database import get_db
from models import AgentPublish, AgentUpdate, AgentResponse
from middleware.auth import get_current_user

router = APIRouter()


@router.post("/agent", response_model=AgentResponse)
async def publish_agent(
    req: AgentPublish,
    user: dict = Depends(get_current_user),
    db: aiosqlite.Connection = Depends(get_db),
):
    existing = await db.execute("SELECT id FROM agents WHERE slug = ?", (req.slug,))
    if await existing.fetchone():
        raise HTTPException(status_code=400, detail="Slug already taken")

    agent_id = str(uuid.uuid4())
    await db.execute(
        """INSERT INTO agents (id, author_id, name, slug, description, category, tags,
           version, definition, readme, provider, model, cognitive_systems)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            agent_id, user["user_id"], req.name, req.slug, req.description,
            req.category, json.dumps(req.tags), req.version, req.definition,
            req.readme, req.provider, req.model, json.dumps(req.cognitive_systems),
        ),
    )
    await db.commit()

    cursor = await db.execute(
        "SELECT a.*, u.username as author_username FROM agents a JOIN users u ON a.author_id = u.id WHERE a.id = ?",
        (agent_id,),
    )
    row = await cursor.fetchone()

    return AgentResponse(
        id=row["id"], author_id=row["author_id"], author_username=row["author_username"],
        name=row["name"], slug=row["slug"], description=row["description"],
        category=row["category"], tags=json.loads(row["tags"]), version=row["version"],
        definition=row["definition"], readme=row["readme"], provider=row["provider"],
        model=row["model"], cognitive_systems=json.loads(row["cognitive_systems"]),
        downloads=row["downloads"], rating_avg=row["rating_avg"],
        rating_count=row["rating_count"], created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


@router.put("/agent/{slug}", response_model=dict)
async def update_agent(
    slug: str,
    req: AgentUpdate,
    user: dict = Depends(get_current_user),
    db: aiosqlite.Connection = Depends(get_db),
):
    cursor = await db.execute(
        "SELECT id, author_id FROM agents WHERE slug = ?", (slug,)
    )
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Agent not found")
    if row["author_id"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not your agent")

    updates = {}
    for field in ["description", "category", "version", "definition", "readme", "provider", "model"]:
        val = getattr(req, field, None)
        if val is not None:
            updates[field] = val
    for field in ["tags", "cognitive_systems"]:
        val = getattr(req, field, None)
        if val is not None:
            updates[field] = json.dumps(val)

    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        set_clause += ", updated_at = CURRENT_TIMESTAMP"
        await db.execute(
            f"UPDATE agents SET {set_clause} WHERE id = ?",
            (*updates.values(), row["id"]),
        )
        await db.commit()

    return {"status": "updated"}


@router.delete("/agent/{slug}")
async def delete_agent(
    slug: str,
    user: dict = Depends(get_current_user),
    db: aiosqlite.Connection = Depends(get_db),
):
    cursor = await db.execute(
        "SELECT id, author_id FROM agents WHERE slug = ?", (slug,)
    )
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Agent not found")
    if row["author_id"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not your agent")

    await db.execute("DELETE FROM reviews WHERE agent_id = ?", (row["id"],))
    await db.execute("DELETE FROM agents WHERE id = ?", (row["id"],))
    await db.commit()

    return {"status": "deleted"}
