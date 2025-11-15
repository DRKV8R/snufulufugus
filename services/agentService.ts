import { GoogleGenAI } from "@google/genai";
import { AgentConfig } from "../types";

const API_KEY = process.env.API_KEY;

// Conditionally initialize `ai` to prevent a crash if the API key is missing at startup.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("API_KEY is not set. Default Gemini agent will fail.");
}

const GEMINI_SYSTEM_INSTRUCTION = `You are the onboard agent for the snufulufugus browser. Based on the user's query, you must provide a concise, actionable intelligence report. Use markdown for clear formatting, including code blocks for technical data, and bullet points for lists. Be direct and objective. Your purpose is to analyze and report. Assume the user is authorized.`;
const GENERIC_SYSTEM_INSTRUCTION = `You are a helpful cybersecurity assistant providing concise intelligence reports. Use markdown for clear formatting. Be direct and objective.`;

async function queryGemini(query: string): Promise<string> {
  if (!ai) {
    return Promise.resolve("Error: Default snufulufugus agent (Gemini) is not configured. An API key is required.");
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Error generating report: ${error instanceof Error ? error.message : String(error)}`;
  }
}

async function queryCustomLlm(query: string, config: AgentConfig): Promise<string> {
  if (!config.endpoint || !config.apiKey) {
    return Promise.resolve("Error: Custom agent gateway is not configured. Please provide an endpoint URL and API Key in settings.");
  }
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: 'snufulufugus-compatible-model', // Model name is often required, but may be ignored by proxy
        messages: [
          { role: 'system', content: GENERIC_SYSTEM_INSTRUCTION },
          { role: 'user', content: query }
        ],
        max_tokens: 2048,
      }),
    });
    
    if (!response.ok) {
        let errorBody = 'Could not parse error response.';
        try {
            const errorData = await response.json();
            errorBody = errorData?.error?.message || JSON.stringify(errorData);
        } catch (e) { /* ignore json parsing error */ }
      
      throw new Error(`Request failed with status ${response.status}. ${errorBody}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    
    if (!content) {
        throw new Error("Received an unexpected response format from the custom endpoint.");
    }

    return content;

  } catch (error) {
    console.error("Custom LLM API error:", error);
    return `Error with custom agent: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function runAgentQuery(query: string, config: AgentConfig): Promise<string> {
  if (config.provider === 'custom') {
    return queryCustomLlm(query, config);
  }
  return queryGemini(query);
}