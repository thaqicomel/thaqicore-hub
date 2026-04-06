from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import init_db
from routes import auth, marketplace, reviews, publish


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="thaqicore Hub",
    description="Agent Marketplace — discover, share, and install cognitive agents",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(marketplace.router, prefix="/marketplace", tags=["marketplace"])
app.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
app.include_router(publish.router, prefix="/publish", tags=["publish"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "thaqicore-hub"}
