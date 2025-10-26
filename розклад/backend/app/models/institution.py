from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # school, university, course
    address = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="institution")
    groups = relationship("Group", back_populates="institution", cascade="all, delete-orphan")
    teachers = relationship("Teacher", back_populates="institution", cascade="all, delete-orphan")
    classrooms = relationship("Classroom", back_populates="institution", cascade="all, delete-orphan")
    time_slots = relationship("TimeSlot", back_populates="institution", cascade="all, delete-orphan")
    subjects = relationship("Subject", back_populates="institution", cascade="all, delete-orphan")

