from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine
from app.db import models  # noqa: F401

from app.api import auth
from app.api.codebase import router as codebase_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CodeUtil API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "frontend-production-d68b.up.railway.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(codebase_router)

# Print all registered routes (debug)
print("\n========== REGISTERED ROUTES ==========")
for route in app.routes:
    if hasattr(route, "methods"):
        print(f"{list(route.methods)}\t{route.path}")
print("=======================================\n")
