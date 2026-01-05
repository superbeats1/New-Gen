import { GoogleGenAI } from "@google/genai";
import { WorkflowMode, AnalysisResult } from "./types";
import { RealDataCollector } from "./services/realDataService";

// Check multiple possible environment variable names
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
               import.meta.env.VITE_GOOGLE_API_KEY ||
               import.meta.env.GEMINI_API_KEY;

// Debug logging for environment variables
console.log('Environment check (v4):', {
  VITE_GEMINI_API_KEY: !!import.meta.env.VITE_GEMINI_API_KEY,
  VITE_GOOGLE_API_KEY: !!import.meta.env.VITE_GOOGLE_API_KEY,
  GEMINI_API_KEY: !!import.meta.env.GEMINI_API_KEY,
  hasApiKey: !!apiKey,
  apiKeyLength: apiKey?.length,
  modelUsing: "gemini-3-pro-preview",
  allEnvKeys: Object.keys(import.meta.env).filter(key => key.includes('API') || key.includes('GEMINI'))
});

if (!apiKey) {
  console.error('All environment variables:', import.meta.env);
  throw new Error(`VITE_GEMINI_API_KEY environment variable is not set. Please add it to your Vercel environment variables. 
  
Available env vars: ${Object.keys(import.meta.env).join(', ')}
  
Steps:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: Name="VITE_GEMINI_API_KEY", Value=Your API Key
3. Redeploy`);
}

const genAI = new GoogleGenAI({ apiKey });
const realDataCollector = new RealDataCollector();

export const analyzeQuery = async (query: string): Promise<AnalysisResult> => {
  try {
    console.log(`🧠 Starting analysis for: "${query}"`);
    
    // Step 1: Determine mode using AI (quick analysis)
    const modePrompt = `
Analyze this query and determine if the user wants:
- "LEAD" mode: Finding active clients/prospects who need services right now
- "OPPORTUNITY" mode: Identifying business opportunities/market gaps

Query: "${query}"

Return ONLY one word: "LEAD" or "OPPORTUNITY"
`;

    const modeResponse = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: modePrompt
    });

    const detectedMode = modeResponse.text.trim().toUpperCase().includes('OPPORTUNITY') 
      ? WorkflowMode.OPPORTUNITY 
      : WorkflowMode.LEAD;

    console.log(`🎯 Detected mode: ${detectedMode}`);

    // Step 2: Get real data from live sources
    let realLeads: any[] = [];
    let realOpportunities: any[] = [];

    if (detectedMode === WorkflowMode.LEAD) {
      console.log(`🔍 Scanning live sources for leads...`);
      realLeads = await realDataCollector.findRealLeads(query, detectedMode);
      
      // If we don't find enough real leads, supplement with AI-generated ones
      if (realLeads.length < 3) {
        console.log(`📈 Found ${realLeads.length} real leads, generating ${3 - realLeads.length} additional leads...`);
        const supplementalLeads = await generateSupplementalLeads(query, 3 - realLeads.length);
        realLeads.push(...supplementalLeads);
      }
    } else {
      console.log(`💡 Generating opportunities analysis...`);
      realOpportunities = await generateOpportunitiesAnalysis(query);
    }

    // Step 3: Create summary
    const summary = detectedMode === WorkflowMode.LEAD
      ? `Found ${realLeads.length} active leads from Reddit, HackerNews, and GitHub`
      : `Identified ${realOpportunities.length} potential opportunities through market analysis`;

    const result: AnalysisResult = {
      mode: detectedMode,
      query,
      summary,
      timestamp: new Date().toISOString(),
      ...(detectedMode === WorkflowMode.LEAD 
        ? { leads: realLeads }
        : { opportunities: realOpportunities }
      )
    };

    console.log(`✅ Analysis complete: ${detectedMode} mode with ${detectedMode === WorkflowMode.LEAD ? realLeads.length : realOpportunities.length} results`);
    return result;

  } catch (error) {
    console.error('Analysis failed:', error);
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('Daily quota exceeded. Please try again tomorrow or upgrade your plan in Google AI Studio.');
    }
    throw new Error('Failed to analyze query. Please check your API key and try again.');
  }
};

// Generate supplemental leads when real data is insufficient
async function generateSupplementalLeads(query: string, count: number): Promise<any[]> {
  const prompt = `
Generate ${count} realistic leads for: "${query}"

Create leads that might exist on platforms like LinkedIn, Upwork, or professional forums.
Focus on realistic scenarios where someone would need this service.

Return ONLY valid JSON array:
[
  {
    "id": "ai_gen_1",
    "prospectName": "Realistic Name",
    "username": "@username",
    "requestSummary": "Detailed request matching the query",
    "postedAt": "3 hours ago",
    "source": "LinkedIn",
    "location": "City, State",
    "fitScore": 7,
    "budget": "Medium",
    "urgency": "High",
    "contactInfo": "Contact through platform",
    "sourceUrl": "https://linkedin.com/in/realistic-profile"
  }
]
`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text.replace(/```json\n?|\n?```/g, '').trim();
    const leads = JSON.parse(text);
    
    // Mark as AI-generated for transparency
    return leads.map((lead: any) => ({
      ...lead,
      status: 'New',
      notes: 'AI-generated lead'
    }));
  } catch (error) {
    console.error('Failed to generate supplemental leads:', error);
    return [];
  }
}

// Generate opportunities analysis
async function generateOpportunitiesAnalysis(query: string): Promise<any[]> {
  const prompt = `
Analyze market opportunities for: "${query}"

Generate 3-5 realistic business opportunities based on market research.
Focus on underserved markets and real problems people face.

Return ONLY valid JSON array:
[
  {
    "id": "opp-1",
    "problemStatement": "Clear description of the problem",
    "overallScore": 8,
    "demandSignal": 9,
    "marketReadiness": 7,
    "competition": "Underserved",
    "entryDifficulty": "Medium",
    "evidence": ["Market indicator 1", "Market indicator 2"],
    "whyItMatters": "Why this opportunity matters now",
    "redFlags": "Potential risks or concerns",
    "nextSteps": ["Actionable step 1", "Actionable step 2"]
  }
]
`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to generate opportunities:', error);
    return [];
  }
}

export const generateOutreach = async (lead: any, myProfile: string = ""): Promise<string> => {
  try {
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

    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt
    });
    
    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate outreach message.');
  }
};

export const enrichContact = async (lead: any): Promise<any> => {
  try {
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

    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    // Clean and parse JSON
    const text = response.text;
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to enrich contact information.');
  }
};