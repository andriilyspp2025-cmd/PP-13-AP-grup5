from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class DayOfWeek(str, enum.Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"


class ScheduleStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"
    SUBSTITUTED = "substituted"


class ScheduleEntry(Base):
    __tablename__ = "schedule_entries"

    id = Column(Integer, primary_key=True, index=True)
    
    # Day of week for recurring schedule
    day_of_week = Column(SQLEnum(DayOfWeek), nullable=False)
    
    # Optional specific date (for one-time or changed classes)
    specific_date = Column(Date, nullable=True)
    
    # Status
    status = Column(SQLEnum(ScheduleStatus), default=ScheduleStatus.SCHEDULED)
    
    # Notes for changes
    notes = Column(Text, nullable=True)
    
    # Foreign keys
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    
    # For substitutions
    substitute_teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    original_classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True)
    
    # Link to change request if this entry was modified
    change_request_id = Column(Integer, ForeignKey("change_requests.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    group = relationship("Group", back_populates="schedule_entries")
    subject = relationship("Subject", back_populates="schedule_entries")
    teacher = relationship("Teacher", back_populates="schedule_entries", foreign_keys=[teacher_id])
    classroom = relationship("Classroom", back_populates="schedule_entries")
    time_slot = relationship("TimeSlot", back_populates="schedule_entries")
    substitute_teacher = relationship("Teacher", back_populates="substituted_entries", foreign_keys=[substitute_teacher_id])
    change_request = relationship("ChangeRequest", back_populates="schedule_entry")

