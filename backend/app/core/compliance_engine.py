from app.frameworks.eu_ai_act.requirements import REQUIREMENTS


def get_requirements(risk_level: str):
    return REQUIREMENTS.get(risk_level, [])