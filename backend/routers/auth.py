from fastapi import APIRouter, HTTPException, status
from models.user import RegisterRequest, LoginRequest, UserOut
from database import supabase

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest):
    try:
        res = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {"data": {"full_name": data.full_name}},
        })
        if not res.user:
            raise HTTPException(status_code=400, detail="Registration failed.")
        return {"message": "Registration successful. Please verify your email."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(data: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })
        if not res.user or not res.session:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        return {
            "access_token": res.session.access_token,
            "token_type":   "bearer",
            "user": UserOut(
                id=res.user.id,
                email=res.user.email,
                full_name=res.user.user_metadata.get("full_name", ""),
            ),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout():
    supabase.auth.sign_out()
    return {"message": "Logged out successfully."}