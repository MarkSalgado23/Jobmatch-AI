import axios from "axios";

export async function generateFeedback(resumeText: string, jobDescription: string) {
  const prompt = `
You are an HR assistant that analyzes resumes for job relevance.
Compare the resume with the job description and respond in this exact format:

Match Score: X%
Matching Skills: ...
Missing Skills: ...
Suggestions: ...

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const body = {
    model: "deepseek/deepseek-chat",
    messages: [
      { role: "system", content: "You are an HR assistant that evaluates resumes." },
      { role: "user", content: prompt },
    ],
  };

  try {
    const { data } = await axios.post("https://openrouter.ai/api/v1/chat/completions", body, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Resume Matcher",
      },
    });
    return data?.choices?.[0]?.message?.content?.trim() ?? "No feedback generated.";
  } catch {
    return "Error generating feedback.";
  }
}
