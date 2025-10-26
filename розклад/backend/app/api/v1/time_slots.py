from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import time

from app.database import get_db
from app.core.security import get_current_active_user, require_role
from app.models.user import User
from app.models.time_slot import TimeSlot

router = APIRouter()


class TimeSlotBase(BaseModel):
    name: str
    period_number: int
    start_time: time
    end_time: time


class TimeSlotCreate(TimeSlotBase):
    institution_id: int


class TimeSlotInDB(TimeSlotBase):
    id: int
    institution_id: int
    
    class Config:
        from_attributes = True


@router.post("/", response_model=TimeSlotInDB)
def create_time_slot(
    time_slot: TimeSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Create a new time slot."""
    db_time_slot = TimeSlot(**time_slot.dict())
    db.add(db_time_slot)
    db.commit()
    db.refresh(db_time_slot)
    return db_time_slot


@router.get("/", response_model=List[TimeSlotInDB])
def get_time_slots(
    institution_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all time slots."""
    query = db.query(TimeSlot)
    if institution_id:
        query = query.filter(TimeSlot.institution_id == institution_id)
    elif current_user.institution_id:
        query = query.filter(TimeSlot.institution_id == current_user.institution_id)
    
    return query.order_by(TimeSlot.period_number).all()


@router.get("/{time_slot_id}", response_model=TimeSlotInDB)
def get_time_slot(
    time_slot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific time slot."""
    time_slot = db.query(TimeSlot).filter(TimeSlot.id == time_slot_id).first()
    if not time_slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    return time_slot


@router.put("/{time_slot_id}", response_model=TimeSlotInDB)
def update_time_slot(
    time_slot_id: int,
    time_slot_update: TimeSlotBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Update a time slot."""
    db_time_slot = db.query(TimeSlot).filter(TimeSlot.id == time_slot_id).first()
    if not db_time_slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    
    for field, value in time_slot_update.dict(exclude_unset=True).items():
        setattr(db_time_slot, field, value)
    
    db.commit()
    db.refresh(db_time_slot)
    return db_time_slot


@router.delete("/{time_slot_id}")
def delete_time_slot(
    time_slot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Delete a time slot."""
    db_time_slot = db.query(TimeSlot).filter(TimeSlot.id == time_slot_id).first()
    if not db_time_slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    
    db.delete(db_time_slot)
    db.commit()
    return {"message": "Time slot deleted successfully"}

