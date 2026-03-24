import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type AnalysisType = 'pros-cons' | 'comparison' | 'swot';

export interface AnalysisResult {
  title: string;
  summary: string;
  data: any; // Structure depends on AnalysisType
}

export async function analyzeDecision(decision: string, type: AnalysisType): Promise<AnalysisResult> {
  const model = "gemini-3.1-flash-lite-preview";
  
  let prompt = "";
  let responseSchema: any = {};

  if (type === 'pros-cons') {
    prompt = `Analyze the following decision: "${decision}". Provide a list of pros and cons.`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        data: {
          type: Type.OBJECT,
          properties: {
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["pros", "cons"]
        }
      },
      required: ["title", "summary", "data"]
    };
  } else if (type === 'comparison') {
    prompt = `Analyze the following decision/options: "${decision}". Provide a comparison table with key criteria.`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        data: {
          type: Type.OBJECT,
          properties: {
            headers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Criteria and Option names" },
            rows: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              description: "Each row represents a criterion and its values for each option"
            }
          },
          required: ["headers", "rows"]
        }
      },
      required: ["title", "summary", "data"]
    };
  } else if (type === 'swot') {
    prompt = `Analyze the following decision/scenario: "${decision}". Provide a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        data: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["strengths", "weaknesses", "opportunities", "threats"]
        }
      },
      required: ["title", "summary", "data"]
    };
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema
    }
  });

  return JSON.parse(response.text || "{}");
}
