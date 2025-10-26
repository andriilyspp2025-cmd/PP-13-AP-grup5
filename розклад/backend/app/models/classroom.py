from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class ClassroomType(str, enum.Enum):
    LECTURE_HALL = "lecture_hall"
    COMPUTER_LAB = "computer_lab"
    GYM = "gym"
    REGULAR = "regular"
    LAB = "lab"


class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Room 205" or "Gym A"
    type = Column(SQLEnum(ClassroomType), nullable=False)
    capacity = Column(Integer, nullable=True)
    equipment = Column(JSON, nullable=True)  # e.g., ["projector", "computers", "whiteboard"]
    building = Column(String, nullable=True)
    floor = Column(Integer, nullable=True)
    
    # Foreign keys
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    institution = relationship("Institution", back_populates="classrooms")
    schedule_entries = relationship("ScheduleEntry", back_populates="classroom")

