import React from "react";

interface JobDescriptionInputProps {
  onChange: (text: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onChange }) => (
  <div className="mb-4">
    <label className="form-label fw-bold">Paste Job Description</label>
    <textarea
      className="form-control"
      rows={5}
      placeholder="Paste the job description here..."
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default JobDescriptionInput;
