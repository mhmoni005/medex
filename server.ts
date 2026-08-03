import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI instance setup
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Medical Explanation Route
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { questionText, options, correctAnswer, userContext, specialty } = req.body;
    
    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
        explanation: "This is a high-yield medical question. For full AI-powered reasoning, configure GEMINI_API_KEY in Secrets."
      });
    }

    const prompt = `
You are a distinguished Senior Medical Faculty Supervisor for Postgraduate Medical Examinations in Bangladesh (FCPS Part I/II, MS Residency, MD, MRCS, MRCP, MBBS Final Prof).

Candidate Specialty Target: ${specialty || "Postgraduate Medicine/Surgery"}
Question: ${questionText}
Options: ${JSON.stringify(options)}
Correct Answer: ${correctAnswer || "Not specified"}
User Query/Context: ${userContext || "Detailed High-Yield Rationale Request"}

Provide a comprehensive, high-yield explanation for postgraduate examinees following standard medical textbooks (Bailey & Love, Davidson's Medicine, Berek & Novak, Nelson Pediatrics, Guyton & Hall).

Format your response clearly as JSON with the following structure:
{
  "rationale": "Clear, step-by-step breakdown explaining why the correct answer is right and why other options are incorrect or distractor choices.",
  "highYieldKeyPoints": ["Point 1", "Point 2", "Point 3"],
  "textbookCitation": "e.g., Davidson's Principles & Practice of Medicine, 24th Ed, Chapter 18 or Bailey & Love's Surgery 28th Ed",
  "examTip": "A crucial exam tip or trick to remember this concept under high-pressure exam conditions."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Explain Error:", error);
    return res.status(500).json({
      error: "Failed to generate explanation.",
      details: error?.message || "Unknown error"
    });
  }
});

// AI Recall Question Generator Route
app.post("/api/gemini/generate-question", async (req, res) => {
  try {
    const { faculty, topic, questionType, specialty } = req.body;
    const ai = getAIClient();
    
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured." });
    }

    const prompt = `
Generate a high-yield postgraduate medical examination question for Bangladeshi candidates (${specialty || "FCPS Part 1 / MS / MRCS"}).
Faculty: ${faculty || "Surgery"}
Topic: ${topic || "General Surgery & Fluid Management"}
Question Type: ${questionType || "SBA"} (Single Best Answer with 5 options or Multiple True/False with 5 stems A-E).

Respond ONLY with JSON matching this structure:
For SBA:
{
  "type": "SBA",
  "question": "Clear clinical vignette or direct question...",
  "options": ["Option A", "Option B", "Option C", "Option D", "Option E"],
  "correctOptionIndex": 0,
  "explanation": "Detailed clinical reasoning...",
  "highYieldKeyPoints": ["Key point 1", "Key point 2"],
  "textbookReference": "Bailey & Love 28th Ed, Ch 4",
  "faculty": "${faculty}",
  "topic": "${topic}"
}

For MCQ (Multiple True/False):
{
  "type": "MCQ",
  "stem": "Regarding acute appendicitis, true or false:",
  "stems": [
    { "text": "A. Anorexia is a nearly constant symptom", "isTrue": true },
    { "text": "B. McBurney point tenderness is present in retrocecal appendicitis", "isTrue": false },
    { "text": "C. Alvarado score >= 7 warrants surgical exploration", "isTrue": true },
    { "text": "D. Neutrophilic leukocytosis is typically absent", "isTrue": false },
    { "text": "E. Ultrasound sensitivity exceeds CT scan in adults", "isTrue": false }
  ],
  "explanation": "Detailed stem-by-stem explanation...",
  "highYieldKeyPoints": ["Point 1", "Point 2"],
  "textbookReference": "Bailey & Love 28th Ed, Ch 68",
  "faculty": "${faculty}",
  "topic": "${topic}"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Question Generator Error:", error);
    return res.status(500).json({ error: "Failed to generate question.", details: error?.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MedExam Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
