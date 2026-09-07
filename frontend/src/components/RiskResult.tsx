import type { AssessmentResponse } from "../types";

interface Props {
  result: AssessmentResponse;
  onReset: () => void;
}

export default function RiskResult({ result, onReset }: Props) {
  const riskColors: Record<string, string> = {
    PROHIBITED: "bg-red-100 text-red-700 border-red-300",
    HIGH: "bg-orange-100 text-orange-700 border-orange-300",
    LIMITED: "bg-yellow-100 text-yellow-700 border-yellow-300",
    MINIMAL: "bg-green-100 text-green-700 border-green-300",
  };

  const color =
    riskColors[result.assessment.risk_level] ||
    "bg-slate-100 text-slate-700 border-slate-300";

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        <div className="flex justify-between items-start gap-6">

          <div>
            <p className="text-sm text-slate-500 mb-2">
              AI SYSTEM
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              {result.system_name}
            </h1>

            <p className="text-slate-500 mt-2">
              {result.industry}
            </p>
          </div>

          <div className={`border px-5 py-3 rounded-xl font-bold ${color}`}>
            {result.assessment.risk_level} RISK
          </div>

        </div>

        <div className="mt-8 border-t pt-6">

          <div className="flex justify-between mb-2">
            <span className="font-medium text-slate-700">
              Assessment Confidence
            </span>

            <span className="font-bold">
              {result.assessment.confidence}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${result.assessment.confidence}%`,
              }}
            />
          </div>

        </div>

      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Why this classification?
        </h2>

        <ul className="space-y-3">

          {result.assessment.reasons.map((reason, index) => (
            <li
              key={index}
              className="flex gap-3 text-slate-600"
            >
              <span className="text-blue-600 font-bold">✓</span>
              {reason}
            </li>
          ))}

        </ul>

      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Compliance Requirements
            </h2>

            <p className="text-slate-500 mt-1">
              Recommended obligations based on the assessment.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {result.requirements.length} requirements
          </span>

        </div>

        <div className="space-y-4">

          {result.requirements.map((requirement) => (

            <div
              key={requirement.id}
              className="border border-slate-200 rounded-xl p-5"
            >

              <div className="flex justify-between gap-4">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {requirement.title}
                  </h3>

                  <p className="text-slate-600 mt-2">
                    {requirement.description}
                  </p>
                </div>

                <span className="text-sm font-medium whitespace-nowrap text-slate-500">
                  {requirement.article}
                </span>

              </div>

              <div className="mt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  {requirement.priority}
                </span>
              </div>

            </div>

          ))}

        </div>

      </div>

      <button
        onClick={onReset}
        className="w-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-4 rounded-xl transition"
      >
        Start New Assessment
      </button>

    </div>
  );
}