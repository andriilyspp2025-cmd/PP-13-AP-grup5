from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class NotificationType(str, enum.Enum):
    SCHEDULE_CHANGE = "schedule_change"
    SUBSTITUTION = "substitution"
    CANCELLATION = "cancellation"
    RESCHEDULE = "reschedule"
    CLASSROOM_CHANGE = "classroom_change"
    CHANGE_REQUEST_UPDATE = "change_request_update"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    
    # Notification content
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(SQLEnum(NotificationType), nullable=False)
    
    # Status
    is_read = Column(Boolean, default=False)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    schedule_entry_id = Column(Integer, ForeignKey("schedule_entries.id"), nullable=True)
    change_request_id = Column(Integer, ForeignKey("change_requests.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

