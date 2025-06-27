import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Get number of questions from env, default to 5 if not set or invalid
const numQuestions = parseInt(process.env.NEXT_PUBLIC_NUM_QUESTIONS, 10) || 5;

export const generateInterviewQA = async (jobPosition, jobDescription, yearsOfExperience, difficulty) => {
  const prompt = `
You are a helpful assistant generating mock interview questions.

Return ONLY a valid JSON array with ${numQuestions} objects. Each object should include:
- "question": the interview question
- "answer": the corresponding answer

Use this format:

[
  {
    "question": "What is JavaScript?",
    "answer": "JavaScript is a high-level, interpreted programming language..."
  }
]

Do not include any explanation, markdown, or text outside the JSON.
Job Position: ${jobPosition}
Job Description: ${jobDescription}
Years of Experience: ${yearsOfExperience}
Difficulty: ${difficulty}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const match = text.match(/\[.*\]/s);
    if (!match) throw new Error("No valid JSON found in response");

    const json = match[0];
    return JSON.parse(json);
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    throw error;
  }
};

export const generateAnswerFeedback = async (question, userAnswer) => {
  const prompt = `
You are an interview coach.

Provide constructive feedback on the user's answer to the given interview question.

Return ONLY a valid JSON object in the following format:
{
  "feedback": "Your feedback text here...",
  "rating": 1-10
}

Do not include any markdown or explanation outside the JSON.
Be honest, concise, and helpful.

Question: "${question}"
User's Answer: "${userAnswer}"
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract and parse JSON object
    const match = text.match(/\{[\s\S]*\}/); // Match everything between first { and last }
    if (!match) throw new Error("No valid JSON object found in Gemini response");

    const parsed = JSON.parse(match[0]);

    return {
      feedback: parsed.feedback?.trim() || "No feedback provided.",
      rating: Number(parsed.rating) || 0,
    };
  } catch (error) {
    console.error("Error generating feedback from Gemini:", error);
    throw error;
  }
};

