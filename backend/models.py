from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Auth
class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: str
    password: str = Field(min_length=6)
    display_name: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user_id: str
    username: str


# Agents
class AgentPublish(BaseModel):
    name: str
    slug: str
    description: str
    category: str
    tags: list[str] = []
    version: str = "1.0.0"
    definition: str  # The full markdown agent definition
    readme: Optional[str] = None
    provider: str = "anthropic"
    model: Optional[str] = None
    cognitive_systems: list[str] = []


class AgentUpdate(BaseModel):
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[list[str]] = None
    version: Optional[str] = None
    definition: Optional[str] = None
    readme: Optional[str] = None
    provider: Optional[str] = None
    model: Optional[str] = None
    cognitive_systems: Optional[list[str]] = None


class AgentResponse(BaseModel):
    id: str
    author_id: str
    author_username: Optional[str] = None
    name: str
    slug: str
    description: str
    category: str
    tags: list[str]
    version: str
    definition: str
    readme: Optional[str]
    provider: str
    model: Optional[str]
    cognitive_systems: list[str]
    downloads: int
    rating_avg: float
    rating_count: int
    created_at: str
    updated_at: str


class AgentListItem(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    category: str
    tags: list[str]
    author_username: Optional[str] = None
    downloads: int
    rating_avg: float
    rating_count: int
    version: str


# Reviews
class ReviewCreate(BaseModel):
    agent_id: str
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str
    agent_id: str
    user_id: str
    username: Optional[str] = None
    rating: int
    comment: Optional[str]
    created_at: str
