from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_active_user, require_role
from app.models.user import User
from app.models.subject import Subject, SubjectType

router = APIRouter()


class SubjectBase(BaseModel):
    name: str
    type: SubjectType
    description: str = None


class SubjectCreate(SubjectBase):
    institution_id: int


class SubjectInDB(SubjectBase):
    id: int
    institution_id: int
    
    class Config:
        from_attributes = True


@router.post("/", response_model=SubjectInDB)
def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Create a new subject."""
    db_subject = Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


@router.get("/", response_model=List[SubjectInDB])
def get_subjects(
    institution_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all subjects."""
    query = db.query(Subject)
    if institution_id:
        query = query.filter(Subject.institution_id == institution_id)
    elif current_user.institution_id:
        query = query.filter(Subject.institution_id == current_user.institution_id)
    
    return query.all()


@router.get("/{subject_id}", response_model=SubjectInDB)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific subject."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


@router.put("/{subject_id}", response_model=SubjectInDB)
def update_subject(
    subject_id: int,
    subject_update: SubjectBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Update a subject."""
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    for field, value in subject_update.dict(exclude_unset=True).items():
        setattr(db_subject, field, value)
    
    db.commit()
    db.refresh(db_subject)
    return db_subject


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Delete a subject."""
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.delete(db_subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

