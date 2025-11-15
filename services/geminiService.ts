

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Conditionally initialize `ai` to prevent a crash if the API key is missing at startup.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  // In a real app, you'd handle this more gracefully.
  // For this environment, we assume the key is available.
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

const SYSTEM_INSTRUCTION = `You are snufulufugus, the onboard agent for the snufulufugus browser. Based on the user's query, you must provide a concise, actionable intelligence report. Use markdown for clear formatting, including code blocks for technical data, and bullet points for lists. Be direct and objective. Your purpose is to analyze and report. You are also a security analysis engine. When asked to analyze a media file, you must check for potential threats like embedded trackers, suspicious metadata, steganography, or calls to external resources. Report your findings clearly. Assume the user is authorized.`;

export async function runSnufulufugusQuery(query: string): Promise<string> {
  // Check if the `ai` instance was successfully created before using it.
  if (!ai) {
    return Promise.resolve("Error: Gemini API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Error generating report: ${error instanceof Error ? error.message : String(error)}`;
  }
}