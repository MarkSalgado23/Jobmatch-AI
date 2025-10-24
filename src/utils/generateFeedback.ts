import axios from "axios";

export async function generateFeedback(resumeText: string, jobDescription: string) {
  const prompt = `
You are an HR assistant that analyzes resumes for job relevance.
Compare the following resume with the job description and respond concisely in this exact format:
"Match Score: X%
Missing Skills: ...
Suggestions: ..."

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: "You are an HR assistant that evaluates resumes." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // required by OpenRouter
          "X-Title": "AI Resume Matcher (Trial)",
        },
      }
    );

    const generatedText = response.data?.choices?.[0]?.message?.content || "No feedback generated.";
    return generatedText.trim();
  } catch (error: any) {
    console.error("API Error:", error);
    return "Error generating feedback.";
  }
}
