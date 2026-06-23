from fastapi import APIRouter, Depends, Query
from middleware.auth_middleware import get_current_user
from database import supabase
from typing import Optional

router = APIRouter()

@router.get("/")
async def get_history(
    current_user: dict   = Depends(get_current_user),
    page:     int        = Query(default=1, ge=1),
    limit:    int        = Query(default=10, ge=1, le=50),
    language: Optional[str] = Query(default=None),
    status:   Optional[str] = Query(default=None),
):
    """Return paginated review history for the authenticated user."""
    offset = (page - 1) * limit

    query = (
        supabase.table("reviews")
        .select("id, title, language, total_issues, critical_count, score, status, created_at")
        .eq("user_id", current_user["id"])
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
    )

    if language: query = query.eq("language", language)
    if status:   query = query.eq("status",   status)

    res = query.execute()
    return {"page": page, "limit": limit, "reviews": res.data or []}


@router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    """Return aggregate statistics for the user dashboard."""
    res = (
        supabase.table("reviews")
        .select("score, total_issues, critical_count, status, language")
        .eq("user_id", current_user["id"])
        .execute()
    )
    rows      = res.data or []
    completed = [r for r in rows if r["status"] == "completed"]
    avg_score = round(sum(r["score"] for r in completed) / len(completed), 1) if completed else 0

    lang_counts: dict = {}
    for r in rows:
        lang_counts[r["language"]] = lang_counts.get(r["language"], 0) + 1

    return {
        "total_reviews":     len(rows),
        "completed_reviews": len(completed),
        "avg_score":         avg_score,
        "total_issues":      sum(r["total_issues"]   for r in completed),
        "critical_issues":   sum(r["critical_count"] for r in completed),
        "top_language":      max(lang_counts, key=lang_counts.get) if lang_counts else None,
        "language_counts":   lang_counts,
    }