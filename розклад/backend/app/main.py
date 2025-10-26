from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import engine, Base
from app.api.v1 import auth, schedule, change_requests
from app.api.v1 import groups, teachers, classrooms, subjects, time_slots, notifications

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(schedule.router, prefix=f"{settings.API_V1_STR}/schedule", tags=["Schedule"])
app.include_router(change_requests.router, prefix=f"{settings.API_V1_STR}/change-requests", tags=["Change Requests"])
app.include_router(groups.router, prefix=f"{settings.API_V1_STR}/groups", tags=["Groups"])
app.include_router(teachers.router, prefix=f"{settings.API_V1_STR}/teachers", tags=["Teachers"])
app.include_router(classrooms.router, prefix=f"{settings.API_V1_STR}/classrooms", tags=["Classrooms"])
app.include_router(subjects.router, prefix=f"{settings.API_V1_STR}/subjects", tags=["Subjects"])
app.include_router(time_slots.router, prefix=f"{settings.API_V1_STR}/time-slots", tags=["Time Slots"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications"])


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Rozklad API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

