import { useState } from "react";
import { assessAISystem } from "../services/api";
import type {
  AssessmentRequest,
  AssessmentResponse,
} from "../types";

interface Props {
  onResult: (result: AssessmentResponse) => void;
}

type BooleanQuestion =
  | "prohibited_practice"
  | "employment"
  | "education"
  | "credit_scoring"
  | "biometric"
  | "profiling"
  | "significant_decision"
  | "chatbot"
  | "generative_ai"
  | "gpai";

const questions: { key: BooleanQuestion; label: string }[] = [
  {
    key: "prohibited_practice",
    label: "Could this system manipulate or exploit vulnerable individuals?",
  },
  {
    key: "employment",
    label: "Is this AI used for employment or recruitment decisions?",
  },
  {
    key: "education",
    label: "Is this AI used for education or student evaluation?",
  },
  {
    key: "credit_scoring",
    label: "Does it affect creditworthiness or access to essential services?",
  },
  {
    key: "biometric",
    label: "Does it process biometric information?",
  },
  {
    key: "profiling",
    label: "Does it profile or evaluate individuals?",
  },
  {
    key: "significant_decision",
    label: "Can it significantly affect decisions about individuals?",
  },
  {
    key: "chatbot",
    label: "Does the system directly interact with humans?",
  },
  {
    key: "generative_ai",
    label: "Does it generate text, images, audio, or video?",
  },
  {
    key: "gpai",
    label: "Is this a general-purpose AI model?",
  },
];

export default function AssessmentWizard({ onResult }: Props) {
  const [formData, setFormData] = useState<AssessmentRequest>({
    system_name: "",
    industry: "General",
    prohibited_practice: false,
    employment: false,
    education: false,
    credit_scoring: false,
    biometric: false,
    profiling: false,
    significant_decision: false,
    chatbot: false,
    generative_ai: false,
    gpai: false,
  });

  const [loading, setLoading] = useState(false);

  const toggleQuestion = (key: BooleanQuestion) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.system_name.trim()) {
      alert("Please enter an AI system name");
      return;
    }

    try {
      setLoading(true);
      const result = await assessAISystem(formData);
      onResult(result);
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          AI System Risk Assessment
        </h2>

        <p className="text-slate-500 mt-2">
          Answer these questions to perform an initial EU AI Act risk assessment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">
            AI System Name
          </label>

          <input
            type="text"
            value={formData.system_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                system_name: e.target.value,
              })
            }
            placeholder="e.g. TalentFilter AI"
            className="w-full border border-slate-300 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Industry
          </label>

          <input
            type="text"
            value={formData.industry}
            onChange={(e) =>
              setFormData({
                ...formData,
                industry: e.target.value,
              })
            }
            placeholder="e.g. Human Resources"
            className="w-full border border-slate-300 rounded-lg px-4 py-3"
          />
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((question) => (
          <div
            key={question.key}
            className="flex items-center justify-between gap-6 border border-slate-200 rounded-xl p-4"
          >
            <span className="text-slate-700">
              {question.label}
            </span>

            <button
              type="button"
              onClick={() => toggleQuestion(question.key)}
              className={`px-5 py-2 rounded-lg font-medium ${
                formData[question.key]
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {formData[question.key] ? "Yes" : "No"}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 w-full bg-blue-600 text-white font-semibold py-4 rounded-xl disabled:opacity-50"
      >
        {loading ? "Analyzing AI System..." : "Analyze Compliance Risk"}
      </button>
    </div>
  );
}