import React, { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";
import JobDescriptionInput from "./components/JobDescriptionInput";
import MatchResult from "./components/MatchResult";
import { generateFeedback } from "./utils/generateFeedback";
import { generateCoverLetter } from "./utils/generateCoverLetter";
import { jsPDF } from "jspdf";

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);

  //  Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    if (!resumeText || !jobDesc) {
      alert("Please upload a resume and enter a job description first.");
      return;
    }

    setLoadingCover(true);
    setCoverLetter("Generating cover letter...");

    try {
      const letter = await generateCoverLetter(resumeText, jobDesc);
      setCoverLetter(letter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setCoverLetter("Error generating cover letter. Please try again.");
    }

    setLoadingCover(false);
  };

  //  Download Cover Letter as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(coverLetter, 180); 
    doc.text(lines, 15, 20);
    doc.save("cover_letter.pdf");
  };

  // ✅ Analyze Resume
  const handleAnalyze = async () => {
    if (!resumeText || !jobDesc) {
      alert("Please upload a resume and enter a job description first.");
      return;
    }

    setLoading(true);
    setFeedback("Analyzing resume, please wait...");

    try {
      const result = await generateFeedback(resumeText, jobDesc);
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
      <h2 className="mb-4 text-center">🧠 AI Resume Matcher + Cover Letter</h2>

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

      <button
        className="btn btn-primary w-100 mt-3"
        onClick={handleGenerateCoverLetter}
        disabled={loadingCover}
      >
        {loadingCover ? "Generating..." : "Generate Cover Letter"}
      </button>

      {coverLetter && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h5>📄 Generated Cover Letter</h5>
          <pre style={{ whiteSpace: "pre-wrap" }}>{coverLetter}</pre>

          <button className="btn btn-outline-secondary mt-3" onClick={handleDownloadPDF}>
            ⬇️ Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
