from pydantic import BaseModel, EmailStr, Field
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

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str