import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import AssessmentRequest, AssessmentResponse
from app.core.classifier import classify_ai_system
from app.core.compliance_engine import get_requirements

from app.database import Base, engine, SessionLocal
from app.models.assessment import Assessment


# Create SQLite tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="Aegis AI Governance Platform",
    description="AI Governance and Compliance Assessment API",
    version="0.1.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",

        # Production frontend
        "https://aegis-ai-governance-platform.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Aegis AI Governance Platform",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/assess", response_model=AssessmentResponse)
def assess_ai_system(data: AssessmentRequest):

    assessment = classify_ai_system(data)

    requirements = get_requirements(
        assessment["risk_level"]
    )

    # Open database session
    db = SessionLocal()

    try:
        # Save assessment
        db_assessment = Assessment(
            system_name=data.system_name,
            industry=data.industry,
            risk_level=assessment["risk_level"],
            confidence=assessment["confidence"],
            reasons=json.dumps(assessment["reasons"]),
            requirements=json.dumps(requirements)
        )

        db.add(db_assessment)
        db.commit()
        db.refresh(db_assessment)

    finally:
        db.close()

    return {
        "system_name": data.system_name,
        "industry": data.industry,
        "assessment": assessment,
        "requirements": requirements
    }


@app.get("/assessments")
def get_assessments():

    db = SessionLocal()

    try:

        assessments = (
            db.query(Assessment)
            .order_by(Assessment.created_at.desc())
            .all()
        )

        return [
            {
                "id": item.id,
                "system_name": item.system_name,
                "industry": item.industry,
                "risk_level": item.risk_level,
                "confidence": item.confidence,
                "created_at": item.created_at
            }
            for item in assessments
        ]

    finally:
        db.close()


@app.get("/assessments/{assessment_id}")
def get_assessment_by_id(assessment_id: int):

    db = SessionLocal()

    try:

        assessment = (
            db.query(Assessment)
            .filter(Assessment.id == assessment_id)
            .first()
        )

        if not assessment:
            return {
                "error": "Assessment not found"
            }

        return {
            "id": assessment.id,
            "system_name": assessment.system_name,
            "industry": assessment.industry,

            "assessment": {
                "risk_level": assessment.risk_level,
                "confidence": assessment.confidence,
                "reasons": json.loads(assessment.reasons)
            },

            "requirements": json.loads(
                assessment.requirements
            ),

            "created_at": assessment.created_at
        }

    finally:
        db.close()