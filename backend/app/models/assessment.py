from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text
)

from datetime import datetime

from app.database import Base


class Assessment(Base):

    __tablename__ = "assessments"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    system_name = Column(
        String,
        nullable=False
    )


    industry = Column(
        String,
        nullable=False
    )


    risk_level = Column(
        String,
        nullable=False
    )


    confidence = Column(
        Float,
        nullable=False
    )


    reasons = Column(
        Text,
        nullable=False
    )


    requirements = Column(
        Text,
        nullable=False
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )