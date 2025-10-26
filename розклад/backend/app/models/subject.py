from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class SubjectType(str, enum.Enum):
    LECTURE = "lecture"
    SEMINAR = "seminar"
    PRACTICAL = "practical"
    LAB = "lab"
    GYM = "gym"


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(SQLEnum(SubjectType), nullable=False)
    description = Column(String, nullable=True)
    
    # Foreign keys
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    institution = relationship("Institution", back_populates="subjects")
    schedule_entries = relationship("ScheduleEntry", back_populates="subject")

