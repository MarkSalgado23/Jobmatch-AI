import React from "react";

interface JobDescriptionInputProps {
  onChange: (text: string) => void;
    disabled?: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onChange,disabled  }) => (
  <div className="mb-4">
    <label className="form-label fw-bold">Paste Job Description</label>
    <textarea
      className="form-control"
      rows={10}
      placeholder="Paste the job description here..."
      onChange={(e) => onChange(e.target.value)}
       disabled={disabled}
    />
  </div>
);

export default JobDescriptionInput;
