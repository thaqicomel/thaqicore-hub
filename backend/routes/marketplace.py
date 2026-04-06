from fastapi import APIRouter, Depends, Query
from typing import Optional
import json
import aiosqlite

from database import get_db
from models import AgentListItem, AgentResponse

router = APIRouter()


@router.get("/agents", response_model=list[AgentListItem])
async def list_agents(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = Query("downloads", enum=["downloads", "rating", "newest"]),
    limit: int = Query(20, le=100),
    offset: int = 0,
    db: aiosqlite.Connection = Depends(get_db),
):
    query = """
        SELECT a.id, a.name, a.slug, a.description, a.category, a.tags,
               a.downloads, a.rating_avg, a.rating_count, a.version,
               u.username as author_username
        FROM agents a
        JOIN users u ON a.author_id = u.id
        WHERE a.published = 1
    """
    params = []

    if category:
        query += " AND a.category = ?"
        params.append(category)

    if search:
        query += " AND (a.name LIKE ? OR a.description LIKE ? OR a.tags LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    sort_map = {
        "downloads": "a.downloads DESC",
        "rating": "a.rating_avg DESC",
        "newest": "a.created_at DESC",
    }
    query += f" ORDER BY {sort_map[sort]} LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor = await db.execute(query, params)
    rows = await cursor.fetchall()

    return [
        AgentListItem(
            id=r["id"],
            name=r["name"],
            slug=r["slug"],
            description=r["description"],
            category=r["category"],
            tags=json.loads(r["tags"]),
            author_username=r["author_username"],
            downloads=r["downloads"],
            rating_avg=r["rating_avg"],
            rating_count=r["rating_count"],
            version=r["version"],
        )
        for r in rows
    ]


@router.get("/agents/{slug}", response_model=AgentResponse)
async def get_agent(slug: str, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute(
        """
        SELECT a.*, u.username as author_username
        FROM agents a
        JOIN users u ON a.author_id = u.id
        WHERE a.slug = ? AND a.published = 1
        """,
        (slug,),
    )
    row = await cursor.fetchone()
    if not row:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Agent not found")

    return AgentResponse(
        id=row["id"],
        author_id=row["author_id"],
        author_username=row["author_username"],
        name=row["name"],
        slug=row["slug"],
        description=row["description"],
        category=row["category"],
        tags=json.loads(row["tags"]),
        version=row["version"],
        definition=row["definition"],
        readme=row["readme"],
        provider=row["provider"],
        model=row["model"],
        cognitive_systems=json.loads(row["cognitive_systems"]),
        downloads=row["downloads"],
        rating_avg=row["rating_avg"],
        rating_count=row["rating_count"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


@router.post("/agents/{slug}/install")
async def install_agent(slug: str, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT id, definition FROM agents WHERE slug = ?", (slug,))
    row = await cursor.fetchone()
    if not row:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Agent not found")

    await db.execute("UPDATE agents SET downloads = downloads + 1 WHERE id = ?", (row["id"],))
    await db.commit()

    return {"definition": row["definition"], "message": f"Save this as agents/{slug}.md"}
