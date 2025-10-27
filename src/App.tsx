import React, { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";
import JobDescriptionInput from "./components/JobDescriptionInput";
import MatchResult from "./components/MatchResult";
import SplitText from "./components/SplitText";
import { generateFeedback } from "./utils/generateFeedback";
import { generateCoverLetter } from "./utils/generateCoverLetter";
import { jsPDF } from "jspdf";
import { HashLoader } from "react-spinners";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);

  // --- Generate Cover Letter ---
  const handleGenerateCoverLetter = async () => {
    if (!resumeText || !jobDesc) {
      alert("Please upload a resume and enter a job description first.");
      return;
    }

    setLoadingCover(true);
    setCoverLetter("");

    try {
      const letter = await generateCoverLetter(resumeText, jobDesc);
      setCoverLetter(letter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setCoverLetter("❌ Error generating cover letter. Please try again.");
    }

    setLoadingCover(false);
  };

  // --- Download Cover Letter as PDF ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(coverLetter, 180);
    doc.text(lines, 15, 20);
    doc.save("cover_letter.pdf");
  };

  // --- Analyze Resume ---
  const handleAnalyze = async () => {
    if (!resumeText || !jobDesc) {
      alert("Please upload a resume and enter a job description first.");
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const result = await generateFeedback(resumeText, jobDesc);
      const scoreMatch = result.match(/Match Score:\s*(\d+)%/i);
      const parsedScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

      setScore(parsedScore);
      setFeedback(result.trim());
    } catch (error) {
      console.error("Error analyzing:", error);
      setFeedback("❌ Error analyzing resume. Please try again.");
      setScore(null);
    }

    setLoading(false);
  };

return (
  <div className="app-wrapper">
    <div className="app-container container-fluid">
      <SplitText
        text="🧠 ResuMatch AI"
        className="text-2xl fw-semibold text-center"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        tag="h2"
        onLetterAnimationComplete={() => console.log("Title animation done!")}
      />

      <section className="main-content">
        <div className="row g-4 justify-content-center align-items-start">

          {/* --- LEFT COLUMN (INPUTS & ACTIONS) --- */}
          <div className="col-lg-5 col-md-6">
            <div className="card input-card">
              <div className="card-body">
                <ResumeUploader
                  onResumeExtracted={(text) => {
                    setResumeText(text);
                    setScore(null);
                    setFeedback("");
                    setCoverLetter("");
                  }}
                  disabled={loading || loadingCover}
                />

                <JobDescriptionInput
                  onChange={(text) => {
                    setJobDesc(text);
                    setScore(null);
                    setFeedback("");
                    setCoverLetter("");
                  }}
                  disabled={loading || loadingCover}
                />

                <div className="action-buttons">
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleAnalyze}
                    disabled={loading || loadingCover}
                  >
                    {loading ? "Analyzing..." : "Analyze Match"}
                  </button>

                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleGenerateCoverLetter}
                    disabled={loading || loadingCover}
                  >
                    {loadingCover ? "Generating..." : "Generate Cover Letter"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (RESULTS) --- */}
          <div className="col-lg-7 col-md-6">
            <div className="card results-card">
              <div className="card-body position-relative">

                {/* Loading Spinner */}
                {(loading || loadingCover) && (
                  <div className="loading-overlay d-flex justify-content-center align-items-center">
                    <HashLoader
                      color={loading ? "#198754" : "#0d6efd"}
                      size={80}
                    />
                  </div>
                )}

                {/* Match Result */}
                {!loading && !loadingCover && score !== null && feedback && (
                  <MatchResult score={score} feedback={feedback} />
                )}

                {/* Cover Letter */}
                {!loading && !loadingCover && coverLetter && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5>📄 Generated Cover Letter</h5>
                    <pre className="cover-letter-output">{coverLetter}</pre>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !loadingCover && !score && !feedback && !coverLetter && (
                  <div className="empty-state text-center text-muted">
                    <p>🚀 Results will appear here after analysis.</p>
                  </div>
                )}

              </div>

              {/* Download Button */}
              {!loading && !loadingCover && coverLetter && (
                <button
                  className="btn btn-outline-secondary mt-3"
                  onClick={handleDownloadPDF}
                >
                  ⬇️ Download Cover letter as PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer text-center mt-5 py-3 border-top">
        <p className="mb-0 text-muted">
          © {new Date().getFullYear()}  ResuMatch AI — Built by{" "}
          <strong>Mark Rhoneil Salgado</strong>
        </p>
      </footer>
    </div>
  </div>
);


};

export default App;
