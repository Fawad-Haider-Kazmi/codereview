from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import auth, review, history

app = FastAPI(
    title="CodeReview AI API",
    description="AI-powered code review and bug detection platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,    prefix="/api/auth",    tags=["Authentication"])
app.include_router(review.router,  prefix="/api/review",  tags=["Code Review"])
app.include_router(history.router, prefix="/api/history", tags=["History"])

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "CodeReview AI API", "version": "1.0.0"}