from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class ChangeType(str, enum.Enum):
    CANCELLATION = "cancellation"
    SUBSTITUTION = "substitution"
    RESCHEDULE = "reschedule"
    CLASSROOM_CHANGE = "classroom_change"


class ChangeRequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Type of change
    change_type = Column(SQLEnum(ChangeType), nullable=False)
    
    # Status
    status = Column(SQLEnum(ChangeRequestStatus), default=ChangeRequestStatus.PENDING)
    
    # Reason for the change
    reason = Column(Text, nullable=False)
    
    # Date for which the change is requested
    requested_date = Column(Date, nullable=False)
    
    # New values (if applicable)
    new_time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=True)
    new_date = Column(Date, nullable=True)
    new_classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True)
    new_teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    
    # Admin comments
    admin_comment = Column(Text, nullable=True)
    
    # Foreign keys
    schedule_entry_id = Column(Integer, nullable=True)  # Will be set after creation
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    processed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    schedule_entry = relationship("ScheduleEntry", back_populates="change_request")
    created_by_user = relationship("User", back_populates="created_change_requests", foreign_keys=[created_by])

