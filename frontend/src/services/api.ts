import axios from "axios";

import type {
  AssessmentRequest,
  AssessmentResponse,
} from "../types";

const API_URL = "https://aegis-ai-governance-platform.onrender.com";

export const assessAISystem = async (
  data: AssessmentRequest
): Promise<AssessmentResponse> => {
  const response = await axios.post(
    `${API_URL}/assess`,
    data
  );

  return response.data;
};

export interface AssessmentHistoryItem {
  id: number;
  system_name: string;
  industry: string;
  risk_level: string;
  confidence: number;
  created_at: string;
}

export const getAssessments = async (): Promise<
  AssessmentHistoryItem[]
> => {
  const response = await axios.get(
    `${API_URL}/assessments`
  );

  return response.data;
};

export const getAssessmentById = async (
  id: number
) => {
  const response = await axios.get(
    `${API_URL}/assessments/${id}`
  );

  return response.data;
};