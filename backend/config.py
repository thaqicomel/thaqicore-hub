import os

DB_PATH = os.getenv("DB_PATH", "thaqicore_hub.db")
JWT_SECRET = os.getenv("JWT_SECRET", "hub-dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24

AGENT_CATEGORIES = [
    "cognitive",
    "coding",
    "research",
    "devops",
    "writing",
    "data",
    "creative",
    "productivity",
    "security",
    "other",
]

COGNITIVE_SYSTEMS = [
    "identity", "working-memory", "episodic", "semantic",
    "procedural", "prospective", "emotional", "consolidation",
    "forgetting", "metacognition",
]
