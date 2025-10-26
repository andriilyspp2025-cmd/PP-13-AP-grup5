from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.core.security import get_current_active_user, require_role
from app.models.user import User
from app.models.group import Group

router = APIRouter()


class GroupBase(BaseModel):
    name: str
    profile: str = None
    student_count: int = None
    year: int = None


class GroupCreate(GroupBase):
    institution_id: int


class GroupInDB(GroupBase):
    id: int
    institution_id: int
    
    class Config:
        from_attributes = True


@router.post("/", response_model=GroupInDB)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Create a new group."""
    db_group = Group(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


@router.get("/", response_model=List[GroupInDB])
def get_groups(
    institution_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all groups."""
    query = db.query(Group)
    if institution_id:
        query = query.filter(Group.institution_id == institution_id)
    elif current_user.institution_id:
        query = query.filter(Group.institution_id == current_user.institution_id)
    
    return query.all()


@router.get("/{group_id}", response_model=GroupInDB)
def get_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific group."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group


@router.put("/{group_id}", response_model=GroupInDB)
def update_group(
    group_id: int,
    group_update: GroupBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Update a group."""
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    for field, value in group_update.dict(exclude_unset=True).items():
        setattr(db_group, field, value)
    
    db.commit()
    db.refresh(db_group)
    return db_group


@router.delete("/{group_id}")
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Delete a group."""
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    db.delete(db_group)
    db.commit()
    return {"message": "Group deleted successfully"}

