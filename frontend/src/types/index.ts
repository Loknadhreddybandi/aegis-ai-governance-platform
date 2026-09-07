export interface AssessmentRequest {
  system_name: string;
  industry: string;
  prohibited_practice: boolean;
  employment: boolean;
  education: boolean;
  credit_scoring: boolean;
  biometric: boolean;
  profiling: boolean;
  significant_decision: boolean;
  chatbot: boolean;
  generative_ai: boolean;
  gpai: boolean;
}

export interface RiskAssessment {
  risk_level: string;
  confidence: number;
  reasons: string[];
  framework: string;
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  article: string;
  priority: string;
}

export interface AssessmentResponse {
  system_name: string;
  industry: string;
  assessment: RiskAssessment;
  requirements: ComplianceRequirement[];
}