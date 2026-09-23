from sqlalchemy import Column, Integer, String

from database import Base


class Student(Base):
    __tablename__ = "Students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    course = Column(String(100))
    email = Column(String(100))
