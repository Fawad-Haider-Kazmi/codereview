from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    full_name: str      = Field(..., min_length=2, max_length=100)
    email:     EmailStr
    password:  str      = Field(..., min_length=8)

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class UserOut(BaseModel):
    id:        str
    email:     str
    full_name: str