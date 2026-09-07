from app.models.schemas import AssessmentRequest


def classify_ai_system(data: AssessmentRequest):

    reasons = []

    # PROHIBITED PRACTICES
    if data.prohibited_practice:
        return {
            "risk_level": "PROHIBITED",
            "confidence": 95,
            "reasons": [
                "The assessment indicates a potentially prohibited AI practice.",
                "This system requires immediate legal and compliance review."
            ],
            "framework": "EU AI Act"
        }

    # HIGH RISK INDICATORS
    high_risk_indicators = {
        "employment": "Used in employment or recruitment decisions",
        "education": "Used in education or vocational assessment",
        "credit_scoring": "Affects creditworthiness or access to essential services",
        "biometric": "Processes biometric information"
    }

    for field, reason in high_risk_indicators.items():
        if getattr(data, field):
            reasons.append(reason)

    # Significant profiling
    if data.profiling and data.significant_decision:
        reasons.append(
            "Profiles individuals and contributes to significant decisions"
        )

    if reasons:
        return {
            "risk_level": "HIGH",
            "confidence": min(85 + len(reasons) * 3, 98),
            "reasons": reasons,
            "framework": "EU AI Act"
        }

    # LIMITED RISK
    limited_reasons = []

    if data.chatbot:
        limited_reasons.append(
            "System directly interacts with humans and may require transparency"
        )

    if data.generative_ai:
        limited_reasons.append(
            "System generates synthetic content and may require transparency measures"
        )

    if data.gpai:
        limited_reasons.append(
            "System is identified as a general-purpose AI model"
        )

    if limited_reasons:
        return {
            "risk_level": "LIMITED",
            "confidence": 82,
            "reasons": limited_reasons,
            "framework": "EU AI Act"
        }

    # MINIMAL RISK
    return {
        "risk_level": "MINIMAL",
        "confidence": 80,
        "reasons": [
            "No major high-risk indicators were identified during the initial assessment."
        ],
        "framework": "EU AI Act"
    }