from pydantic import BaseModel, Field
from typing import List


class AssessmentRequest(BaseModel):
    system_name: str = Field(
        ...,
        min_length=2,
        description="Name of the AI system"
    )

    industry: str = Field(
        default="General",
        description="Industry where the AI system is used"
    )

    prohibited_practice: bool = False
    employment: bool = False
    education: bool = False
    credit_scoring: bool = False
    biometric: bool = False
    profiling: bool = False
    significant_decision: bool = False
    chatbot: bool = False
    generative_ai: bool = False
    gpai: bool = False


class RiskResult(BaseModel):
    risk_level: str
    confidence: int
    reasons: List[str]
    framework: str


class ComplianceRequirement(BaseModel):
    id: str
    title: str
    description: str
    article: str
    priority: str


class AssessmentResponse(BaseModel):
    system_name: str
    industry: str
    assessment: RiskResult
    requirements: List[ComplianceRequirement]