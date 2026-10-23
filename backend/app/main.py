from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from .config import settings
from .database import engine
from .logging_config import configure_logging
from .middleware.request_logging import LoggingMiddleware
from .routers import health, tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

    await engine.dispose()

configure_logging()

app = FastAPI(title="Task Tracker API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.cors_origins.split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

app.include_router(health.router)
app.include_router(tasks.router)

Instrumentator(
    excluded_handlers=["/metrics"],
).instrument(app).expose(app, include_in_schema=False)
