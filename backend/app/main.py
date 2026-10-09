from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import game_router
from app.db import Base, engine
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game_router.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Duolingo Clone API"}
