import { useEffect, useState } from "react";
import {
  getAssessments,
  type AssessmentHistoryItem,
} from "../services/api";

interface Props {
  onSelectAssessment: (id: number) => void;
}

export default function AssessmentHistory({
  onSelectAssessment,
}: Props) {
  const [assessments, setAssessments] = useState<
    AssessmentHistoryItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);

        const data = await getAssessments();

        setAssessments(data);
      } catch (error) {
        console.error(error);
        setError(
          "Could not load assessment history. Make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "unacceptable":
        return "bg-red-100 text-red-700";

      case "high":
        return "bg-orange-100 text-orange-700";

      case "limited":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <p className="text-slate-500">
          Loading assessment history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Assessment History
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Previously analyzed AI systems
        </p>
      </div>

      {assessments.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No assessments found.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {assessments.map((assessment) => (
            <button
              key={assessment.id}
              onClick={() =>
                onSelectAssessment(assessment.id)
              }
              className="w-full text-left p-6 hover:bg-slate-50 transition"
            >
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {assessment.system_name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {assessment.industry}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(
                      assessment.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                      assessment.risk_level
                    )}`}
                  >
                    {assessment.risk_level} Risk
                  </span>

                  <p className="text-sm text-slate-500 mt-2">
                    {assessment.confidence}% confidence
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}