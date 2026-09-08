"""Training module and question routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.module import Module
from app.models.question import Question
from app.schemas.module import ModuleResponse, QuestionResponse

router = APIRouter(prefix="/api/modules", tags=["Modules"])


@router.get("/", response_model=list[ModuleResponse])
def get_modules(db: Session = Depends(get_db)):
    """Get all training modules."""
    modules = db.query(Module).filter(Module.active == True).all()
    return modules


@router.get("/{module_id}", response_model=ModuleResponse)
def get_module(module_id: str, db: Session = Depends(get_db)):
    """Get a specific module by its module_id (e.g. FIRE-001)."""
    module = db.query(Module).filter(Module.module_id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module


@router.get("/{module_id}/questions", response_model=list[QuestionResponse])
def get_module_questions(module_id: str, db: Session = Depends(get_db)):
    """Get all questions for a specific module."""
    module = db.query(Module).filter(Module.module_id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    questions = db.query(Question).filter(Question.module_id == module.id).all()
    return questions
