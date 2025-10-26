from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import date

from app.database import get_db
from app.core.security import get_current_active_user, require_role
from app.models.user import User
from app.models.schedule import ScheduleEntry, ScheduleStatus
from app.schemas.schedule import ScheduleEntryCreate, ScheduleEntryUpdate, ScheduleEntryWithDetails

router = APIRouter()


@router.post("/", response_model=ScheduleEntryWithDetails)
def create_schedule_entry(
    entry: ScheduleEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Create a new schedule entry (Admin/Super Admin only)."""
    # Check for conflicts
    conflicts = db.query(ScheduleEntry).filter(
        and_(
            ScheduleEntry.day_of_week == entry.day_of_week,
            ScheduleEntry.time_slot_id == entry.time_slot_id,
            or_(
                ScheduleEntry.teacher_id == entry.teacher_id,
                ScheduleEntry.group_id == entry.group_id,
                ScheduleEntry.classroom_id == entry.classroom_id
            )
        )
    ).first()
    
    if conflicts:
        raise HTTPException(
            status_code=400,
            detail="Schedule conflict: Teacher, group, or classroom already occupied at this time"
        )
    
    db_entry = ScheduleEntry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    return get_schedule_entry_with_details(db, db_entry)


@router.get("/", response_model=List[ScheduleEntryWithDetails])
def get_schedule(
    group_id: Optional[int] = Query(None),
    teacher_id: Optional[int] = Query(None),
    classroom_id: Optional[int] = Query(None),
    specific_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get schedule entries with filters."""
    query = db.query(ScheduleEntry)
    
    # Apply filters based on user role
    if current_user.role == "student" and current_user.group_id:
        query = query.filter(ScheduleEntry.group_id == current_user.group_id)
    elif current_user.role == "teacher" and current_user.teacher_id:
        query = query.filter(
            or_(
                ScheduleEntry.teacher_id == current_user.teacher_id,
                ScheduleEntry.substitute_teacher_id == current_user.teacher_id
            )
        )
    
    # Apply additional filters
    if group_id:
        query = query.filter(ScheduleEntry.group_id == group_id)
    if teacher_id:
        query = query.filter(
            or_(
                ScheduleEntry.teacher_id == teacher_id,
                ScheduleEntry.substitute_teacher_id == teacher_id
            )
        )
    if classroom_id:
        query = query.filter(ScheduleEntry.classroom_id == classroom_id)
    if specific_date:
        query = query.filter(ScheduleEntry.specific_date == specific_date)
    
    entries = query.all()
    return [get_schedule_entry_with_details(db, entry) for entry in entries]


@router.get("/{entry_id}", response_model=ScheduleEntryWithDetails)
def get_schedule_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific schedule entry."""
    entry = db.query(ScheduleEntry).filter(ScheduleEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    
    return get_schedule_entry_with_details(db, entry)


@router.put("/{entry_id}", response_model=ScheduleEntryWithDetails)
def update_schedule_entry(
    entry_id: int,
    entry_update: ScheduleEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Update a schedule entry (Admin/Super Admin only)."""
    db_entry = db.query(ScheduleEntry).filter(ScheduleEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    
    update_data = entry_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_entry, field, value)
    
    db.commit()
    db.refresh(db_entry)
    
    return get_schedule_entry_with_details(db, db_entry)


@router.delete("/{entry_id}")
def delete_schedule_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Delete a schedule entry (Admin/Super Admin only)."""
    db_entry = db.query(ScheduleEntry).filter(ScheduleEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    
    db.delete(db_entry)
    db.commit()
    
    return {"message": "Schedule entry deleted successfully"}


def get_schedule_entry_with_details(db: Session, entry: ScheduleEntry) -> dict:
    """Helper function to get schedule entry with related details."""
    return {
        **entry.__dict__,
        "group_name": entry.group.name,
        "subject_name": entry.subject.name,
        "teacher_name": entry.teacher.full_name,
        "classroom_name": entry.classroom.name,
        "time_slot_name": entry.time_slot.name,
        "start_time": str(entry.time_slot.start_time),
        "end_time": str(entry.time_slot.end_time),
        "substitute_teacher_name": entry.substitute_teacher.full_name if entry.substitute_teacher else None
    }

