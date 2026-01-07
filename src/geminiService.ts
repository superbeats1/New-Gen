import { GoogleGenerativeAI } from "@google/generative-ai";
import { WorkflowMode, AnalysisResult } from "./types";
import { RealDataCollector } from "./services/realDataService";

// Check multiple possible environment variable names
const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_GOOGLE_API_KEY ||
  import.meta.env.GEMINI_API_KEY;

let genAIInstance: GoogleGenerativeAI | null = null;
let realDataCollector: RealDataCollector | null = null;

const getGenAI = () => {
  if (!genAIInstance) {
    if (!apiKey) {
      console.error('All environment variables:', import.meta.env);
      throw new Error(`VITE_GEMINI_API_KEY environment variable is not set.`);
    }
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
};

const getRealDataCollector = () => {
  if (!realDataCollector) {
    realDataCollector = new RealDataCollector();
  }
  return realDataCollector;
};

export const analyzeQuery = async (query: string): Promise<AnalysisResult> => {
  try {
    console.log(`🧠 Starting opportunity analysis for: "${query}"`);

    // Force Opportunity Mode (Pivot Phase 1)
    const detectedMode = WorkflowMode.OPPORTUNITY;
    console.log(`🎯 Mode set to: ${detectedMode}`);

    // Step 2: Get real data/analysis
    console.log(`💡 Generating opportunities analysis...`);
    const realOpportunities = await generateOpportunitiesAnalysis(query);

    // Step 3: Create summary
    const summary = `Identified ${realOpportunities.length} potential opportunities through market analysis`;

    const result: AnalysisResult = {
      mode: detectedMode,
      query,
      summary,
      timestamp: new Date().toISOString(),
      opportunities: realOpportunities
    };

    console.log(`✅ Analysis complete: ${detectedMode} mode with ${realOpportunities.length} results`);
    return result;

  } catch (error: any) {
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
    "budgetAmount": "$3,500",
    "urgency": "High",
    "contactInfo": "Contact through platform",
    "sourceUrl": "https://linkedin.com/posts/activity-demo-12345"
  }
]

IMPORTANT: 
- Use varied, realistic sourceUrl patterns like:
  * LinkedIn: "https://linkedin.com/posts/activity-{randomnumber}" 
  * Upwork: "https://upwork.com/jobs/~{randomnumber}"
  * GitHub: "https://github.com/{username}/{repo}/issues/{number}"
- Include realistic budgetAmount when someone mentions a specific budget:
  * Low budget: $500-$2,000
  * Medium budget: $2,000-$5,000  
  * High budget: $5,000+
  * Sometimes use ranges like "$2,000-$5,000"
- Never use the same URL twice
`;

  try {
    const result = await getGenAI().getGenerativeModel({ model: "gemini-1.5-pro" }).generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await result.response;
    const responseText = response.text() || '';
    const text = responseText.replace(/```json\n?|\n?```/g, '').trim();
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
    "nextSteps": ["Actionable step 1", "Actionable step 2"],
    "marketSentiment": 82,
    "growthVelocity": 75,
    "competitionIntensity": 45,
    "marketMaturity": "Emerging"
  }
]
`;

  try {
    const result = await getGenAI().getGenerativeModel({ model: "gemini-1.5-pro" }).generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await result.response;
    const responseText = response.text();
    const text = responseText.replace(/```json\n?|\n?```/g, '').trim();
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

    const result = await getGenAI().getGenerativeModel({ model: "gemini-1.5-pro" }).generateContent(prompt);
    const response = await result.response;
    return response.text();
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

    const result = await getGenAI().getGenerativeModel({ model: "gemini-1.5-pro" }).generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await result.response;
    const responseText = response.text();
    const text = responseText;
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to enrich contact information.');
  }
};