from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_active_user, require_role
from app.models.user import User
from app.models.teacher import Teacher

router = APIRouter()


class TeacherBase(BaseModel):
    full_name: str
    specialization: str = None
    contact_email: str = None
    contact_phone: str = None
    preferences: dict = None


class TeacherCreate(TeacherBase):
    institution_id: int


class TeacherInDB(TeacherBase):
    id: int
    institution_id: int
    
    class Config:
        from_attributes = True


@router.post("/", response_model=TeacherInDB)
def create_teacher(
    teacher: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Create a new teacher."""
    db_teacher = Teacher(**teacher.dict())
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


@router.get("/", response_model=List[TeacherInDB])
def get_teachers(
    institution_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all teachers."""
    query = db.query(Teacher)
    if institution_id:
        query = query.filter(Teacher.institution_id == institution_id)
    elif current_user.institution_id:
        query = query.filter(Teacher.institution_id == current_user.institution_id)
    
    return query.all()


@router.get("/{teacher_id}", response_model=TeacherInDB)
def get_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific teacher."""
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@router.put("/{teacher_id}", response_model=TeacherInDB)
def update_teacher(
    teacher_id: int,
    teacher_update: TeacherBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Update a teacher."""
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    for field, value in teacher_update.dict(exclude_unset=True).items():
        setattr(db_teacher, field, value)
    
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


@router.delete("/{teacher_id}")
def delete_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Delete a teacher."""
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    db.delete(db_teacher)
    db.commit()
    return {"message": "Teacher deleted successfully"}

