from fastapi import APIRouter, HTTPException, Depends, status
from models.review import ReviewRequest, ReviewOut
from middleware.auth_middleware import get_current_user
from services.ai_service import analyze_code
from database import supabase
import uuid

router = APIRouter()

@router.post("/", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def create_review(
    data: ReviewRequest,
    current_user: dict = Depends(get_current_user),
):
    """Submit code for AI-powered review and bug detection."""
    review_id = str(uuid.uuid4())

    review_insert = supabase.table("reviews").insert({
        "id":           review_id,
        "user_id":      current_user["id"],
        "title":        data.title,
        "language":     data.language.value,
        "code_snippet": data.code_snippet,
        "status":       "pending",
    }).execute()

    if not review_insert.data:
        raise HTTPException(status_code=500, detail="Failed to create review.")

    try:
        analysis = analyze_code(data.language.value, data.code_snippet)
    except Exception as e:
        supabase.table("reviews").update({"status": "failed"}).eq("id", review_id).execute()
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    issues       = analysis["issues"]
    critical_cnt = sum(1 for i in issues if i.get("severity") == "critical")
    warning_cnt  = sum(1 for i in issues if i.get("severity") == "warning")
    info_cnt     = sum(1 for i in issues if i.get("severity") == "info")

    supabase.table("reviews").update({
        "ai_summary":     analysis["summary"],
        "score":          analysis["score"],
        "total_issues":   len(issues),
        "critical_count": critical_cnt,
        "warning_count":  warning_cnt,
        "info_count":     info_cnt,
        "status":         "completed",
    }).eq("id", review_id).execute()

    if issues:
        issue_rows = [
            {
                "id":          str(uuid.uuid4()),
                "review_id":   review_id,
                "severity":    i.get("severity", "info"),
                "category":    i.get("category", "General"),
                "line_number": i.get("line_number"),
                "title":       i.get("title", ""),
                "description": i.get("description", ""),
                "suggestion":  i.get("suggestion"),
            }
            for i in issues
        ]
        supabase.table("issues").insert(issue_rows).execute()

    return await get_review(review_id, current_user)


@router.get("/{review_id}", response_model=ReviewOut)
async def get_review(
    review_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Fetch a single review with all its issues."""
    review_res = (
        supabase.table("reviews")
        .select("*")
        .eq("id", review_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not review_res.data:
        raise HTTPException(status_code=404, detail="Review not found.")

    issues_res = (
        supabase.table("issues")
        .select("*")
        .eq("review_id", review_id)
        .order("severity")
        .execute()
    )

    review           = review_res.data
    review["issues"] = issues_res.data or []
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a review — cascades to issues via DB constraint."""
    res = (
        supabase.table("reviews")
        .delete()
        .eq("id", review_id)
        .eq("user_id", current_user["id"])
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Review not found.")