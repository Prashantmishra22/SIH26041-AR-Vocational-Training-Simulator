"""Assessment question model."""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    question_type = Column(String(30), nullable=False)  # mcq, true_false, sequence, ar_select
    question = Column(Text, nullable=False)
    question_hi = Column(Text, nullable=True)
    question_sat = Column(Text, nullable=True)
    options = Column(JSON, nullable=False)  # List of option strings
    options_hi = Column(JSON, nullable=True)
    options_sat = Column(JSON, nullable=True)
    correct_answer = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=True)
    explanation_hi = Column(Text, nullable=True)
    points = Column(Integer, default=10)

    # Relationships
    module = relationship("Module", back_populates="questions")
