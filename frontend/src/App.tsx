import { useState } from "react";

import Sidebar, {
  type Page,
} from "./components/Sidebar";

import Dashboard from "./components/Dashboard";
import AssessmentWizard from "./components/AssessmentWizard";
import AssessmentHistory from "./components/AssessmentHistory";
import AssessmentDetail from "./components/AssessmentDetail";
import RiskResult from "./components/RiskResult";

import type { AssessmentResponse } from "./types";


function App() {

  const [activePage, setActivePage] =
    useState<Page>("dashboard");

  const [result, setResult] =
    useState<AssessmentResponse | null>(null);

  const [selectedAssessmentId, setSelectedAssessmentId] =
    useState<number | null>(null);


  const handleAssessmentResult = (
    assessmentResult: AssessmentResponse
  ) => {
    setResult(assessmentResult);
  };


  const renderContent = () => {

    // Show a saved assessment detail
    if (selectedAssessmentId !== null) {
      return (
        <AssessmentDetail
          assessmentId={selectedAssessmentId}
          onBack={() => {
            setSelectedAssessmentId(null);
            setActivePage("history");
          }}
        />
      );
    }


    // Show new assessment result
    if (result) {
      return (
        <RiskResult
          result={result}
          onReset={() => {
            setResult(null);
            setActivePage("assessment");
          }}
        />
      );
    }


    switch (activePage) {

      case "dashboard":
        return (
          <Dashboard
            onNewAssessment={() =>
              setActivePage("assessment")
            }
          />
        );


      case "assessment":
        return (
          <div>

            <div className="mb-8">

              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                AI Governance
              </p>

              <h1 className="text-3xl font-bold text-slate-900 mt-2">
                New AI Assessment
              </h1>

              <p className="text-slate-500 mt-2">
                Evaluate an AI system against EU AI Act risk indicators.
              </p>

            </div>


            <AssessmentWizard
              onResult={handleAssessmentResult}
            />

          </div>
        );


      case "history":
        return (
          <AssessmentHistory
            onSelectAssessment={(id) =>
              setSelectedAssessmentId(id)
            }
          />
        );


      default:
        return null;
    }
  };


  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setResult(null);
          setSelectedAssessmentId(null);
          setActivePage(page);
        }}
      />


      <main className="flex-1 p-10 overflow-auto">
        {renderContent()}
      </main>

    </div>
  );
}


export default App;