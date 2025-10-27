from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import EmailStr

from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.email import create_verification_token, verify_token, send_verification_email
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB, Token, EmailVerification, EmailVerificationResponse

router = APIRouter()


@router.post("/register", response_model=UserInDB)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user (не активний до верифікації email)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        hashed_password=get_password_hash(user.password),
        institution_id=user.institution_id,
        teacher_id=user.teacher_id,
        group_id=user.group_id,
        is_active=False,  # Неактивний до верифікації
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Відправити email для верифікації
    verification_token = create_verification_token(db_user.email)
    send_verification_email(db_user.email, verification_token)
    
    return db_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email not verified. Please check your email for verification link."
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive. Please contact administrator."
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/verify-email", response_model=EmailVerificationResponse)
def verify_email(verification: EmailVerification, db: Session = Depends(get_db)):
    """Verify user email with token."""
    email = verify_token(verification.token)
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_verified:
        return {
            "message": "Email already verified",
            "email": email
        }
    
    # Активувати користувача
    user.is_verified = True
    user.is_active = True
    db.commit()
    
    return {
        "message": "Email successfully verified! You can now login.",
        "email": email
    }


@router.post("/resend-verification")
def resend_verification(email: EmailStr, db: Session = Depends(get_db)):
    """Resend verification email."""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Не показуємо чи існує користувач (безпека)
        return {"message": "If this email is registered, verification link has been sent."}
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Відправити новий токен
    verification_token = create_verification_token(user.email)
    send_verification_email(user.email, verification_token)
    
    return {"message": "Verification email sent successfully"}

