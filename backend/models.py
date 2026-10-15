from sqlalchemy import Column, Integer, String, Text
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