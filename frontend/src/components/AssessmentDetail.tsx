import { useEffect, useState } from "react";

import { getAssessmentById } from "../services/api";


interface Props {
  assessmentId: number;
  onBack: () => void;
}


interface AssessmentDetailData {
  id: number;
  system_name: string;
  industry: string;

  assessment: {
    risk_level: string;
    confidence: number;
    reasons: string[];
  };

  requirements: Array<{
    title?: string;
    description?: string;
    requirement?: string;
  }>;

  created_at: string;
}


export default function AssessmentDetail({
  assessmentId,
  onBack,
}: Props) {

  const [data, setData] =
    useState<AssessmentDetailData | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const loadAssessment = async () => {
      try {

        const result =
          await getAssessmentById(assessmentId);

        setData(result);

      } catch (error) {

        console.error(
          "Failed to load assessment",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    loadAssessment();

  }, [assessmentId]);


  if (loading) {
    return (
      <div className="text-slate-500">
        Loading assessment report...
      </div>
    );
  }


  if (!data) {
    return (
      <div>
        <p className="text-red-600">
          Assessment could not be loaded.
        </p>

        <button
          onClick={onBack}
          className="mt-4 text-blue-600"
        >
          ← Back to History
        </button>
      </div>
    );
  }


  const riskStyles: Record<string, string> = {
    PROHIBITED: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    LIMITED: "bg-yellow-100 text-yellow-700",
    MINIMAL: "bg-green-100 text-green-700",
  };


  return (

    <div className="max-w-5xl mx-auto">

      <button
        onClick={onBack}
        className="text-blue-600 font-medium mb-6"
      >
        ← Back to Assessment History
      </button>


      <div className="bg-white border border-slate-200 rounded-xl p-8">

        <div className="flex justify-between items-start">

          <div>

            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
              Assessment Report
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              {data.system_name}
            </h1>

            <p className="text-slate-500 mt-2">
              {data.industry}
            </p>

          </div>


          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              riskStyles[data.assessment.risk_level]
            }`}
          >
            {data.assessment.risk_level} RISK
          </span>

        </div>


        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="border border-slate-200 rounded-xl p-6">

            <p className="text-sm text-slate-500">
              Classification Confidence
            </p>

            <p className="text-4xl font-bold text-slate-900 mt-2">
              {data.assessment.confidence}%
            </p>

          </div>


          <div className="border border-slate-200 rounded-xl p-6">

            <p className="text-sm text-slate-500">
              Assessment Date
            </p>

            <p className="text-lg font-semibold text-slate-900 mt-3">
              {new Date(
                data.created_at
              ).toLocaleString()}
            </p>

          </div>

        </div>


        <div className="mt-8">

          <h2 className="text-xl font-bold text-slate-900">
            Why was this classification assigned?
          </h2>


          <div className="mt-4 space-y-3">

            {data.assessment.reasons.map(
              (reason, index) => (

                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 text-slate-700"
                >
                  ✓ {reason}
                </div>

              )
            )}

          </div>

        </div>


        <div className="mt-10">

          <h2 className="text-xl font-bold text-slate-900">
            Compliance Requirements
          </h2>

          <p className="text-slate-500 mt-2">
            Recommended obligations based on the risk classification.
          </p>


          <div className="mt-5 space-y-4">

            {data.requirements.map(
              (requirement, index) => (

                <div
                  key={index}
                  className="border border-slate-200 rounded-xl p-5"
                >

                  <h3 className="font-semibold text-slate-900">

                    {requirement.title ||
                      requirement.requirement ||
                      `Requirement ${index + 1}`}

                  </h3>


                  {requirement.description && (

                    <p className="text-slate-600 mt-2">
                      {requirement.description}
                    </p>

                  )}

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );
}