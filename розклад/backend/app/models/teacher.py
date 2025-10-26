from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    specialization = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    preferences = Column(JSON, nullable=True)  # e.g., {"no_classes_before": "10:00", "preferred_days": ["Mon", "Wed"]}
    
    # Foreign keys
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    institution = relationship("Institution", back_populates="teachers")
    user = relationship("User", back_populates="teacher")
    schedule_entries = relationship("ScheduleEntry", back_populates="teacher")
    substituted_entries = relationship("ScheduleEntry", back_populates="substitute_teacher", foreign_keys="ScheduleEntry.substitute_teacher_id")

