import axios from "axios";

export async function generateCoverLetter(resumeText: string, jobDescription: string) {
  const prompt = `
You are a professional career assistant.
Using the following RESUME and JOB DESCRIPTION, write a personalized cover letter.
Keep it concise (150–200 words), professional, and friendly.
Format it as a real letter with greeting, body, and closing.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful AI career assistant that writes cover letters." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AI Cover Letter Generator",
        },
      }
    );

    const generatedText = response.data?.choices?.[0]?.message?.content || "No cover letter generated.";
    return generatedText.trim();
  } catch (error: any) {
    console.error("API Error:", error);
    return "Error generating cover letter.";
  }
}
