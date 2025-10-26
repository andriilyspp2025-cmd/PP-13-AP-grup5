from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_active_user, require_role
from app.models.user import User
from app.models.classroom import Classroom, ClassroomType

router = APIRouter()


class ClassroomBase(BaseModel):
    name: str
    type: ClassroomType
    capacity: int = None
    equipment: list = None
    building: str = None
    floor: int = None


class ClassroomCreate(ClassroomBase):
    institution_id: int


class ClassroomInDB(ClassroomBase):
    id: int
    institution_id: int
    
    class Config:
        from_attributes = True


@router.post("/", response_model=ClassroomInDB)
def create_classroom(
    classroom: ClassroomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Create a new classroom."""
    db_classroom = Classroom(**classroom.dict())
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom


@router.get("/", response_model=List[ClassroomInDB])
def get_classrooms(
    institution_id: int = None,
    type: ClassroomType = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all classrooms."""
    query = db.query(Classroom)
    if institution_id:
        query = query.filter(Classroom.institution_id == institution_id)
    elif current_user.institution_id:
        query = query.filter(Classroom.institution_id == current_user.institution_id)
    
    if type:
        query = query.filter(Classroom.type == type)
    
    return query.all()


@router.get("/{classroom_id}", response_model=ClassroomInDB)
def get_classroom(
    classroom_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific classroom."""
    classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    return classroom


@router.put("/{classroom_id}", response_model=ClassroomInDB)
def update_classroom(
    classroom_id: int,
    classroom_update: ClassroomBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Update a classroom."""
    db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not db_classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    for field, value in classroom_update.dict(exclude_unset=True).items():
        setattr(db_classroom, field, value)
    
    db.commit()
    db.refresh(db_classroom)
    return db_classroom


@router.delete("/{classroom_id}")
def delete_classroom(
    classroom_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Delete a classroom."""
    db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not db_classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    db.delete(db_classroom)
    db.commit()
    return {"message": "Classroom deleted successfully"}

