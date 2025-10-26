from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.core.security import get_current_active_user, require_role
from app.models.user import User
from app.models.change_request import ChangeRequest, ChangeRequestStatus
from app.models.schedule import ScheduleEntry
from app.models.notification import Notification, NotificationType
from app.schemas.change_request import ChangeRequestCreate, ChangeRequestUpdate, ChangeRequestInDB

router = APIRouter()


@router.post("/", response_model=ChangeRequestInDB)
def create_change_request(
    request: ChangeRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new change request."""
    # Verify schedule entry exists
    schedule_entry = db.query(ScheduleEntry).filter(
        ScheduleEntry.id == request.schedule_entry_id
    ).first()
    
    if not schedule_entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    
    # Teachers can only request changes for their own classes
    if current_user.role == "teacher" and schedule_entry.teacher_id != current_user.teacher_id:
        raise HTTPException(status_code=403, detail="Not authorized to request changes for this class")
    
    db_request = ChangeRequest(
        **request.dict(),
        created_by=current_user.id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    # Notify admins
    notify_admins_of_new_request(db, db_request)
    
    return db_request


@router.get("/", response_model=List[ChangeRequestInDB])
def get_change_requests(
    status: ChangeRequestStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get change requests. Admins see all, teachers see their own."""
    query = db.query(ChangeRequest)
    
    if current_user.role == "teacher":
        query = query.filter(ChangeRequest.created_by == current_user.id)
    
    if status:
        query = query.filter(ChangeRequest.status == status)
    
    return query.order_by(ChangeRequest.created_at.desc()).all()


@router.get("/{request_id}", response_model=ChangeRequestInDB)
def get_change_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific change request."""
    db_request = db.query(ChangeRequest).filter(ChangeRequest.id == request_id).first()
    
    if not db_request:
        raise HTTPException(status_code=404, detail="Change request not found")
    
    # Teachers can only view their own requests
    if current_user.role == "teacher" and db_request.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return db_request


@router.put("/{request_id}", response_model=ChangeRequestInDB)
def update_change_request(
    request_id: int,
    request_update: ChangeRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin", "admin"))
):
    """Process a change request (Admin/Super Admin only)."""
    db_request = db.query(ChangeRequest).filter(ChangeRequest.id == request_id).first()
    
    if not db_request:
        raise HTTPException(status_code=404, detail="Change request not found")
    
    # Update request
    update_data = request_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_request, field, value)
    
    db_request.processed_by = current_user.id
    db_request.processed_at = datetime.utcnow()
    
    # If approved, apply changes to schedule
    if request_update.status == ChangeRequestStatus.APPROVED:
        apply_change_to_schedule(db, db_request)
    
    db.commit()
    db.refresh(db_request)
    
    # Notify relevant users
    notify_users_of_change(db, db_request)
    
    return db_request


def apply_change_to_schedule(db: Session, change_request: ChangeRequest):
    """Apply approved change to the schedule entry."""
    schedule_entry = db.query(ScheduleEntry).filter(
        ScheduleEntry.id == change_request.schedule_entry_id
    ).first()
    
    if not schedule_entry:
        return
    
    if change_request.change_type == "cancellation":
        schedule_entry.status = "cancelled"
    elif change_request.change_type == "substitution":
        schedule_entry.status = "substituted"
        schedule_entry.substitute_teacher_id = change_request.new_teacher_id
    elif change_request.change_type == "reschedule":
        schedule_entry.status = "rescheduled"
        if change_request.new_time_slot_id:
            schedule_entry.time_slot_id = change_request.new_time_slot_id
        if change_request.new_date:
            schedule_entry.specific_date = change_request.new_date
    elif change_request.change_type == "classroom_change":
        schedule_entry.original_classroom_id = schedule_entry.classroom_id
        schedule_entry.classroom_id = change_request.new_classroom_id
    
    schedule_entry.change_request_id = change_request.id
    schedule_entry.notes = change_request.reason


def notify_admins_of_new_request(db: Session, change_request: ChangeRequest):
    """Notify all admins of a new change request."""
    admins = db.query(User).filter(User.role.in_(["super_admin", "admin"])).all()
    
    for admin in admins:
        notification = Notification(
            user_id=admin.id,
            title="New Change Request",
            message=f"A new change request has been submitted: {change_request.change_type}",
            type=NotificationType.CHANGE_REQUEST_UPDATE,
            change_request_id=change_request.id
        )
        db.add(notification)


def notify_users_of_change(db: Session, change_request: ChangeRequest):
    """Notify relevant users when a change request is processed."""
    schedule_entry = db.query(ScheduleEntry).filter(
        ScheduleEntry.id == change_request.schedule_entry_id
    ).first()
    
    if not schedule_entry:
        return
    
    # Notify the requester
    requester = db.query(User).filter(User.id == change_request.created_by).first()
    if requester:
        notification = Notification(
            user_id=requester.id,
            title=f"Change Request {change_request.status.value.title()}",
            message=f"Your change request has been {change_request.status.value}",
            type=NotificationType.CHANGE_REQUEST_UPDATE,
            change_request_id=change_request.id
        )
        db.add(notification)
    
    # If approved, notify students in the group
    if change_request.status == ChangeRequestStatus.APPROVED:
        students = db.query(User).filter(
            User.role == "student",
            User.group_id == schedule_entry.group_id
        ).all()
        
        for student in students:
            notification = Notification(
                user_id=student.id,
                title="Schedule Change",
                message=f"Your {schedule_entry.subject.name} class has been {change_request.change_type.value}",
                type=NotificationType.SCHEDULE_CHANGE,
                schedule_entry_id=schedule_entry.id
            )
            db.add(notification)

