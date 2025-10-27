import React, { useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const validateResume = (text: string): boolean => {
  const keywords = [
    "education",
    "experience",
    "skills",
    "summary",
    "projects",
    "certifications",
    "contact",
  ];
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

interface ResumeUploaderProps {
  onResumeExtracted: (text: string) => void;
   disabled?: boolean;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeExtracted,disabled  }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await extractText(file);

      if (!validateResume(text)) {
        alert("⚠️ This file doesn’t look like a resume. Please upload a valid one.");
     
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      onResumeExtracted(text);
    } catch (error) {
      console.error("Error reading PDF:", error);
      alert("❌ Failed to read PDF file. Please try another one.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const extractText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ");
    }

    return text;
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">Upload Resume (PDF)</label>
      <input
        type="file"
        className="form-control"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
         disabled={disabled}
      />
    </div>
  );
};

export default ResumeUploader;
