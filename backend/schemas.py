from pydantic import BaseModel
from typing import Optional

class EntryBase(BaseModel):
    title: str
    author: Optional[str] = None
    cover_url: Optional[str] = None
    status: str
    rating: Optional[int] = None
    review: Optional[str] = None
    date_read: Optional[str] = None

class EntryCreate(EntryBase):
    pass

class EntryUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    cover_url: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[int] = None
    review: Optional[str] = None
    date_read: Optional[str] = None

class EntryOut(EntryBase):
    id: int
    class Config:
        from_attributes = True