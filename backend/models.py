from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database import Base

class Entry(Base):
    __tablename__= 'entries'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String)
    cover_url = Column(String)
    status = Column(String, nullable=False)   # 'read' or 'want'
    rating = Column(Integer, nullable=True)
    review = Column(Text, nullable=True)
    date_read = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())