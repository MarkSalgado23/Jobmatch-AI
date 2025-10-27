import React, { useMemo } from "react";

interface MatchResultProps {
  score: number; 
  feedback: string;
}
const parseFeedback = (text: string) => {
  const sections = { matchingSkills: "", missingSkills: "", suggestions: "" };


  const regex = /Matching Skills:\s*([\s\S]*?)Missing Skills:\s*([\s\S]*?)Suggestions:\s*([\s\S]*)/;
  const match = text.match(regex);

  if (match) {
    sections.matchingSkills = match[1].trim();
    sections.missingSkills = match[2].trim();
    sections.suggestions = match[3].trim();
  }

  return sections;
};

const getProgressBarClass = (score: number): string => {
  if (score > 70) return "bg-success";
  if (score > 40) return "bg-warning";
  return "bg-danger";
};

const MatchResult: React.FC<MatchResultProps> = ({ score, feedback }) => {

  if (!feedback) return null;


  const sections = useMemo(() => {
    return parseFeedback(feedback);
  }, [feedback]); 

  return (
    <div className="card mt-4 shadow-sm match-result-card">
      <div className="card-body">
        <h5 className="card-title">Match Result</h5>

        <div className="progress mb-3 progress-bar-custom">
          <div
            className={`progress-bar ${getProgressBarClass(score)}`}
            role="progressbar"
            style={{ width: `${score}%` }}
          >
            {score}%
          </div>
        </div>

        {/*Conditional & Fallback Rendering 
         * This checks if content exists.
         * 1. If it does, it renders the content in a <p> tag.
         * 2. If it doesn't, it renders a fallback message.
         */}

        <div className="feedback-section matching-skills">
          <strong className="text-success">Matching Skills:</strong>
          {sections.matchingSkills ? (
            <p>{sections.matchingSkills}</p>
          ) : (
            <p className="text-muted fst-italic">None identified.</p>
          )}
        </div>

        <div className="feedback-section missing-skills">
          <strong className="text-danger">Missing Skills:</strong>
          {sections.missingSkills ? (
            <p>{sections.missingSkills}</p>
          ) : (
            <p className="text-muted fst-italic">None identified.</p>
          )}
        </div>

        <div className="feedback-section suggestions">
          <strong>Suggestions:</strong>
          {sections.suggestions ? (
            <p>{sections.suggestions}</p>
          ) : (
            <p className="text-muted fst-italic">No suggestions provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchResult;