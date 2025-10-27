from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Union
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    role: Union[UserRole, str]  # Приймаємо і enum і string
    phone: Optional[str] = None
    
    @field_validator('role', mode='before')
    @classmethod
    def validate_role(cls, v):
        """Convert string to UserRole enum if needed."""
        if isinstance(v, str):
            try:
                return UserRole(v)
            except ValueError:
                raise ValueError(f"Invalid role. Must be one of: {', '.join([r.value for r in UserRole])}")
        return v


class UserCreate(UserBase):
    password: str
    institution_id: Optional[int] = None
    teacher_id: Optional[int] = None
    group_id: Optional[int] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    institution_id: Optional[int]
    teacher_id: Optional[int]
    group_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


class EmailVerification(BaseModel):
    token: str


class EmailVerificationResponse(BaseModel):
    message: str
    email: str
