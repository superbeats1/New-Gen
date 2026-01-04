
import { GoogleGenAI, Type } from "@google/genai";
import { WorkflowMode, AnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeQuery = async (query: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the following user query for a platform called "Signal". 
    Determine if the user is looking for "Business Opportunities" (Opportunity Mode) or "Active Client Leads" (Lead Mode).
    
    Query: "${query}"

    If it's Opportunity Mode: Generate 5 realistic business opportunities found by "scanning" Reddit/forums (simulate this research). 
    Provide scores for Demand (1-10), Market Readiness (1-10), Competition (Saturated/Moderate/Underserved), and Entry Difficulty (Low/Medium/High).
    
    If it's Lead Mode: Generate 5-8 active leads that might exist on Reddit, Upwork, or Twitter for the requested service.
    Provide Fit Score (1-10), Budget (High/Medium/Low/Unknown), and Urgency (High/Medium/Low).

    Return the results in the specified JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING, enum: [WorkflowMode.OPPORTUNITY, WorkflowMode.LEAD] },
          query: { type: Type.STRING },
          summary: { type: Type.STRING },
          opportunities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                problemStatement: { type: Type.STRING },
                overallScore: { type: Type.NUMBER },
                demandSignal: { type: Type.NUMBER },
                marketReadiness: { type: Type.NUMBER },
                competition: { type: Type.STRING },
                entryDifficulty: { type: Type.STRING },
                evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                whyItMatters: { type: Type.STRING },
                redFlags: { type: Type.STRING },
                nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "problemStatement", "overallScore"]
            }
          },
          leads: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                prospectName: { type: Type.STRING },
                username: { type: Type.STRING },
                requestSummary: { type: Type.STRING },
                postedAt: { type: Type.STRING },
                source: { type: Type.STRING },
                location: { type: Type.STRING },
                fitScore: { type: Type.NUMBER },
                budget: { type: Type.STRING },
                urgency: { type: Type.STRING },
                contactInfo: { type: Type.STRING },
                sourceUrl: { type: Type.STRING }
              }
            }
          }
        },
        required: ["mode", "query", "summary"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return {
    ...result,
    timestamp: new Date().toISOString()
  };
};

export const generateOutreach = async (lead: any, myProfile: string = ""): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Generate a personalized, high-converting outreach message for the following lead.
    Lead Name: ${lead.prospectName}
    Request: ${lead.requestSummary}
    Platform: ${lead.source}
    Budget: ${lead.budget}
    Urgency: ${lead.urgency}
    
    My Info: ${myProfile}

    Requirements:
    - Subject line (if applicable)
    - Tone: Matches the lead's posting style (casual or professional)
    - Opening: Strong hook referencing their specific need
    - Value Prop: Briefly explain how I can solve their pain point
    - CTA: Clear next step
    - Length: Keep it concise.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  return response.text || "Failed to generate message.";
};

export const enrichContact = async (lead: any): Promise<any> => {
  // Mocking enrichment logic for the prototype
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Based on the prospect name "${lead.prospectName}" and platform "${lead.source}", 
    simulate realistic contact enrichment data. Find a likely LinkedIn URL, professional email format, 
    and recent activity summary.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          email: { type: Type.STRING },
          linkedIn: { type: Type.STRING },
          company: { type: Type.STRING },
          recentActivity: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text);
};
