import { GoogleGenAI } from "@google/genai";
import { WorkflowMode, AnalysisResult } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file or Vercel environment variables.');
}

const genAI = new GoogleGenAI({ apiKey });

export const analyzeQuery = async (query: string): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Analyze the following user query for a platform called "Signal". 
Determine if the user is looking for "Business Opportunities" (Opportunity Mode) or "Active Client Leads" (Lead Mode).

Query: "${query}"

If it's Opportunity Mode: Generate 3-5 realistic business opportunities found by "scanning" Reddit/forums (simulate this research). 
Provide scores for Demand (1-10), Market Readiness (1-10), Competition (Saturated/Moderate/Underserved), and Entry Difficulty (Low/Medium/High).

If it's Lead Mode: Generate 5-8 active leads that might exist on Reddit, Upwork, or Twitter for the requested service.
Provide Fit Score (1-10), Budget (High/Medium/Low/Unknown), and Urgency (High/Medium/Low).

Return ONLY valid JSON in this exact format:
{
  "mode": "OPPORTUNITY" or "LEAD",
  "query": "${query}",
  "summary": "Brief summary of findings",
  "opportunities": [
    {
      "id": "opp-1",
      "problemStatement": "Clear problem description",
      "overallScore": 8,
      "demandSignal": 9,
      "marketReadiness": 7,
      "competition": "Underserved",
      "entryDifficulty": "Medium",
      "evidence": ["Evidence 1", "Evidence 2"],
      "whyItMatters": "Why this opportunity matters",
      "redFlags": "Potential concerns",
      "nextSteps": ["Step 1", "Step 2"]
    }
  ],
  "leads": [
    {
      "id": "lead-1",
      "prospectName": "John Doe",
      "username": "@johndoe",
      "requestSummary": "Looking for help with...",
      "postedAt": "2 hours ago",
      "source": "Reddit",
      "location": "Austin, TX",
      "fitScore": 8,
      "budget": "Medium",
      "urgency": "High",
      "contactInfo": "Contact through platform",
      "sourceUrl": "https://example.com/post"
    }
  ]
}

Return either "opportunities" array (for Opportunity Mode) OR "leads" array (for Lead Mode), not both.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResult = JSON.parse(cleanText);
    
    return {
      ...parsedResult,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze query. Please check your API key and try again.');
  }
};

export const generateOutreach = async (lead: any, myProfile: string = ""): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
- Length: Keep it concise (2-3 paragraphs max)

Return only the message text, no extra formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate outreach message.');
  }
};

export const enrichContact = async (lead: any): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
Based on the following lead information, generate realistic contact enrichment data:

Lead Name: ${lead.prospectName}
Company/Context: ${lead.requestSummary}
Location: ${lead.location}
Platform: ${lead.source}

Generate realistic professional contact information that might be found through LinkedIn/social research:
- Email (format: firstname.lastname@company.com or similar)
- LinkedIn URL
- Company name
- Job title
- Phone number (format: +1-XXX-XXX-XXXX)

Return ONLY valid JSON in this format:
{
  "email": "john.doe@company.com",
  "linkedin": "https://linkedin.com/in/johndoe",
  "company": "Company Name",
  "jobTitle": "Job Title",
  "phone": "+1-555-123-4567"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to enrich contact information.');
  }
};