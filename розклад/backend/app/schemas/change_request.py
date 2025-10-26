from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.models.change_request import ChangeType, ChangeRequestStatus


class ChangeRequestBase(BaseModel):
    change_type: ChangeType
    reason: str
    requested_date: date
    schedule_entry_id: int
    new_time_slot_id: Optional[int] = None
    new_date: Optional[date] = None
    new_classroom_id: Optional[int] = None
    new_teacher_id: Optional[int] = None


class ChangeRequestCreate(ChangeRequestBase):
    pass


class ChangeRequestUpdate(BaseModel):
    status: Optional[ChangeRequestStatus] = None
    admin_comment: Optional[str] = None
    new_time_slot_id: Optional[int] = None
    new_date: Optional[date] = None
    new_classroom_id: Optional[int] = None
    new_teacher_id: Optional[int] = None


class ChangeRequestInDB(ChangeRequestBase):
    id: int
    status: ChangeRequestStatus
    admin_comment: Optional[str]
    created_by: int
    processed_by: Optional[int]
    created_at: datetime
    processed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

