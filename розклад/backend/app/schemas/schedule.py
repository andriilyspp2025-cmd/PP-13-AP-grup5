from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.models.schedule import DayOfWeek, ScheduleStatus


class ScheduleEntryBase(BaseModel):
    day_of_week: DayOfWeek
    specific_date: Optional[date] = None
    group_id: int
    subject_id: int
    teacher_id: int
    classroom_id: int
    time_slot_id: int
    notes: Optional[str] = None


class ScheduleEntryCreate(ScheduleEntryBase):
    pass


class ScheduleEntryUpdate(BaseModel):
    status: Optional[ScheduleStatus] = None
    substitute_teacher_id: Optional[int] = None
    classroom_id: Optional[int] = None
    time_slot_id: Optional[int] = None
    specific_date: Optional[date] = None
    notes: Optional[str] = None


class ScheduleEntryInDB(ScheduleEntryBase):
    id: int
    status: ScheduleStatus
    substitute_teacher_id: Optional[int]
    original_classroom_id: Optional[int]
    change_request_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ScheduleEntryWithDetails(ScheduleEntryInDB):
    group_name: str
    subject_name: str
    teacher_name: str
    classroom_name: str
    time_slot_name: str
    start_time: str
    end_time: str
    substitute_teacher_name: Optional[str] = None

