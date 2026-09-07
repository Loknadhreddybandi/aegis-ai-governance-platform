import { useEffect, useState } from "react";

import {
  getAssessments,
  type AssessmentHistoryItem,
} from "../services/api";

interface Props {
  onNewAssessment: () => void;
}

export default function Dashboard({
  onNewAssessment,
}: Props) {
  const [assessments, setAssessments] = useState<
    AssessmentHistoryItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const data = await getAssessments();
      setAssessments(data);
    } catch (error) {
      console.error("Failed to load assessments", error);
    } finally {
      setLoading(false);
    }
  };

  const total = assessments.length;

  const highRisk = assessments.filter(
    (item) => item.risk_level === "HIGH"
  ).length;

  const limitedRisk = assessments.filter(
    (item) => item.risk_level === "LIMITED"
  ).length;

  const minimalRisk = assessments.filter(
    (item) => item.risk_level === "MINIMAL"
  ).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Overview
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            AI Governance Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor and manage your AI system compliance assessments.
          </p>
        </div>

        <button
          onClick={onNewAssessment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + New Assessment
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-5 mb-8">
            <StatCard
              title="Total Assessments"
              value={total}
              description="AI systems assessed"
            />

            <StatCard
              title="High Risk"
              value={highRisk}
              description="Require strict controls"
            />

            <StatCard
              title="Limited Risk"
              value={limitedRisk}
              description="Transparency obligations"
            />

            <StatCard
              title="Minimal Risk"
              value={minimalRisk}
              description="Low compliance burden"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Recent Assessments
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest AI systems analyzed by Aegis.
              </p>
            </div>

            {assessments.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-slate-500">
                  No assessments yet.
                </p>

                <button
                  onClick={onNewAssessment}
                  className="mt-4 text-blue-600 font-medium"
                >
                  Create your first assessment →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {assessments.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.system_name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {item.industry}
                      </p>
                    </div>

                    <div className="text-right">
                      <RiskBadge level={item.risk_level} />

                      <p className="text-xs text-slate-400 mt-2">
                        {item.confidence}% confidence
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="text-3xl font-bold text-slate-900 mt-2">
        {value}
      </p>

      <p className="text-xs text-slate-400 mt-2">
        {description}
      </p>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    PROHIBITED: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    LIMITED: "bg-yellow-100 text-yellow-700",
    MINIMAL: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[level] || "bg-slate-100 text-slate-600"
      }`}
    >
      {level}
    </span>
  );
}