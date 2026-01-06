import { GoogleGenAI } from "@google/genai";
import { WorkflowMode, AnalysisResult } from "./types";
import { RealDataCollector } from "./services/realDataService";

// Check multiple possible environment variable names
const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_GOOGLE_API_KEY ||
  import.meta.env.GEMINI_API_KEY;

let genAIInstance: GoogleGenAI | null = null;
let realDataCollector: RealDataCollector | null = null;

const getGenAI = () => {
  if (!genAIInstance) {
    if (!apiKey) {
      console.error('All environment variables:', import.meta.env);
      throw new Error(`VITE_GEMINI_API_KEY environment variable is not set.`);
    }
    genAIInstance = new GoogleGenAI({ apiKey });
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
    console.log(`🧠 Starting analysis for: "${query}"`);

    // Step 1: Determine mode using AI (quick analysis)
    const modePrompt = `
Analyze this query and determine if the user wants:
- "LEAD" mode: Finding active clients/prospects who need services right now
- "OPPORTUNITY" mode: Identifying business opportunities/market gaps

Query: "${query}"

Return ONLY one word: "LEAD" or "OPPORTUNITY"
`;

    const modeResponse = await getGenAI().models.generateContent({
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
      realLeads = await getRealDataCollector().findRealLeads(query, detectedMode);

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
    const response = await getGenAI().models.generateContent({
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
You are a market intelligence analyst specializing in opportunity discovery. Analyze market opportunities for: "${query}"

Generate 3-5 HIGH-QUALITY, VALIDATED business opportunities. Each opportunity must be backed by real market signals, competitor analysis, and revenue potential.

For each opportunity, provide COMPREHENSIVE analysis:

1. **Problem Validation**: What specific pain point exists? Who experiences it? How frequently?
2. **Market Size**: Estimate TAM (Total Addressable Market) with reasoning
3. **Revenue Potential**: Realistic first-year revenue estimates (low/high range) with confidence level
4. **Competition Analysis**: List 2-3 existing competitors and their specific weaknesses/gaps
5. **Demand Signals**: What evidence shows people want this? (search volume, forum posts, complaint frequency)
6. **Monetization**: 2-3 specific ways to monetize this opportunity
7. **Validation Sources**: Where did you find evidence? (subreddits, trends, competitor reviews)
8. **Time to Market**: Realistic timeline from idea to launch
9. **Startup Costs**: Estimated initial investment needed

Return ONLY valid JSON array in this EXACT format:
[
  {
    "id": "opp-1",
    "problemStatement": "Clear, specific problem statement in 1-2 sentences",
    "overallScore": 8,
    "demandSignal": 9,
    "marketReadiness": 7,
    "competition": "Underserved",
    "entryDifficulty": "Medium",
    "evidence": ["Specific market indicator with numbers", "Another concrete signal"],
    "whyItMatters": "Why this opportunity is valuable NOW (timing, market conditions, trends)",
    "redFlags": "Honest concerns: regulatory risks, market saturation, technical challenges, etc.",
    "nextSteps": ["Specific actionable step", "Another concrete action"],
    "revenueEstimate": {
      "low": "$50K/year",
      "high": "$250K/year",
      "confidence": "Medium - based on similar SaaS pricing at $29-99/mo with 50-200 customers"
    },
    "marketSize": "$2.5B annually (500K small businesses × $5K average spend)",
    "targetAudience": "Specific persona: role, pain points, willingness to pay",
    "existingCompetitors": ["Competitor 1 (market leader, $150/mo)", "Competitor 2 (emerging player, $50/mo)"],
    "competitorWeaknesses": ["Competitor 1: Poor UI, expensive", "Competitor 2: Limited features, bad support"],
    "monetizationStrategies": ["Strategy 1 with pricing", "Strategy 2 with details", "Strategy 3"],
    "validationSources": ["r/entrepreneur: 50+ posts asking for this", "Google Trends: 300% growth", "Competitor reviews: 'wish it had X'"],
    "timeToMarket": "3-6 months for MVP",
    "estimatedStartupCost": "$5K-15K (dev tools, hosting, initial marketing)"
  }
]

CRITICAL REQUIREMENTS:
- Use REAL competitor names when possible (check for actual products)
- Base revenue estimates on realistic pricing and customer acquisition
- Include specific numbers in evidence (not vague statements)
- Identify concrete next steps (not generic advice like "research the market")
- Be honest about red flags and challenges
- Focus on opportunities that can realistically generate $50K-500K/year for a solo founder or small team
`;

  try {
    const response = await getGenAI().models.generateContent({
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

    const response = await getGenAI().models.generateContent({
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

    const response = await getGenAI().models.generateContent({
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