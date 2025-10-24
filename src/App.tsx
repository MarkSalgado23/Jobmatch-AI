import React, { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";
import JobDescriptionInput from "./components/JobDescriptionInput";
import MatchResult from "./components/MatchResult";
import { generateFeedback } from "./utils/generateFeedback";

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDesc) {
      alert("Please upload a resume and enter a job description first.");
      return;
    }

    setLoading(true);
    setFeedback("Analyzing resume, please wait...");

    try {
      // Call the generateFeedback function directly
      const result = await generateFeedback(resumeText, jobDesc);

      // Extract match score from AI response
      const scoreMatch = result.match(/Match Score:\s*(\d+)%/i);
      const parsedScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

      setScore(parsedScore);
      setFeedback(result.trim());
    } catch (error) {
      console.error("Error analyzing:", error);
      setFeedback("Error analyzing resume. Please try again.");
      setScore(null);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🧠 AI Resume Matcher</h2>

      <ResumeUploader onResumeExtracted={setResumeText} />
      <JobDescriptionInput onChange={setJobDesc} />

      <button
        className="btn btn-success w-100 mt-3"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {score !== null && feedback && <MatchResult score={score} feedback={feedback} />}
    </div>
  );
};

export default App;