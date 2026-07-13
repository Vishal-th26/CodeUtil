import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

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

print("========== APP STARTED ==========")
print(__file__)

print("\n========== IMPORT CHECK ==========")
print("Auth module:", auth.__file__)
print("Auth router:", auth.router)
print("Auth router routes:")
for r in auth.router.routes:
    print(f"  {type(r).__name__:<20} {getattr(r, 'path', 'NO PATH')}")

print("\nCodebase router routes:")
for r in codebase_router.routes:
    print(f"  {type(r).__name__:<20} {getattr(r, 'path', 'NO PATH')}")
print("==================================\n")


def _parse_origins(raw_value: str | None) -> list[str]:
    if not raw_value:
        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


frontend_origins = _parse_origins(os.getenv("FRONTEND_URL"))

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("========== BEFORE INCLUDE ==========")
print("Route count:", len(app.routes))
print()

print("Including auth router...")
app.include_router(auth.router)

print("Route count:", len(app.routes))
for r in app.routes:
    print(f"{type(r).__name__:<25} {getattr(r, 'path', 'NO PATH')}")

print("\nIncluding codebase router...")
app.include_router(codebase_router)

print("Route count:", len(app.routes))
for r in app.routes:
    print(f"{type(r).__name__:<25} {getattr(r, 'path', 'NO PATH')}")

print("\n========== APP INFO ==========")
print("App type:", type(app))
print("include_router:", app.include_router)
print("==============================")

print("\n========== FINAL REGISTERED ROUTES ==========")
for route in app.routes:
    print("-" * 60)
    print("Type:", type(route).__name__)
    print("Path:", getattr(route, "path", "NO PATH"))
    print("Methods:", getattr(route, "methods", "NO METHODS"))
    print("Name:", getattr(route, "name", "NO NAME"))
print("=============================================")
