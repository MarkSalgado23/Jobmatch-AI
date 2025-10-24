import React from "react";

interface MatchResultProps {
  score: number;
  feedback: string;
}

const MatchResult: React.FC<MatchResultProps> = ({ score, feedback }) => {
  if (!feedback) return null; 

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Match Result</h5>

        <div className="progress mb-3" style={{ height: "25px" }}>
          <div
            className={`progress-bar ${score > 70 ? "bg-success" : score > 40 ? "bg-warning" : "bg-danger"}`}
            role="progressbar"
            style={{ width: `${score}%` }}
          >
            {score}%
          </div>
        </div>

        <p className="card-text">{feedback}</p>
      </div>
    </div>
  );
};

export default MatchResult;
