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
    console.log(`🧠 Starting opportunity analysis for: "${query}"`);

    // Force Opportunity Mode (Pivot Phase 1)
    const detectedMode = WorkflowMode.OPPORTUNITY;
    console.log(`🎯 Mode set to: ${detectedMode}`);

    // Step 2: Get real data from active sources
    console.log(`📡 Collecting real-time market data...`);
    const realData = await getRealDataCollector().findRealLeads(query, detectedMode);

    // Step 3: Generate high-fidelity analysis using real data
    console.log(`💡 Generating high-fidelity opportunities analysis...`);
    const analysisResponse = await generateOpportunitiesAnalysis(query, realData);

    // Step 4: Create summary
    const summary = analysisResponse.summary;
    const result: AnalysisResult = {
      mode: detectedMode,
      query,
      summary,
      timestamp: new Date().toISOString(),
      opportunities: analysisResponse.opportunities,
      totalSourcesAnalyzed: analysisResponse.totalSourcesAnalyzed,
      dateRange: analysisResponse.dateRange,
      queryInterpretation: analysisResponse.queryInterpretation,
      rawFindings: analysisResponse.rawFindings
    };

    const opportunitiesCount = analysisResponse.opportunities?.length || 0;
    console.log(`✅ Analysis complete: ${detectedMode} mode with ${opportunitiesCount} results`);
    return result;

  } catch (error: any) {
    console.error('Analysis failed:', error);
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('Daily quota exceeded. Please try again tomorrow or upgrade your plan in Google AI Studio.');
    }
    throw new Error('Failed to analyze query. Please check your API key and try again.');
  }
};

// Helper to extract JSON from text that might contain markdown or conversational filler
function extractJsonFromText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  try {
    // 1. Try to find the first '{' and corresponding last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    // 2. Try to find the first '[' and corresponding last ']'
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');

    // Determine which start/end pair encapsulates the primary structure
    let start = -1;
    let end = -1;

    // If we find both, prioritize the one that starts first (handles mixtures)
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      start = firstBrace;
      end = lastBrace;
    } else if (firstBracket !== -1) {
      start = firstBracket;
      end = lastBracket;
    }

    if (start !== -1 && end !== -1 && end > start) {
      return text.substring(start, end + 1);
    }
  } catch (e) {
    console.warn("Manual JSON extraction failed, falling back to regex", e);
  }

  return text.replace(/```json\n?|\n?```/g, '').trim();
}

// Generate supplemental leads when real data is insufficient
async function generateSupplementalLeads(query: string, count: number): Promise<any[]> {
  const prompt = `
Generate ${count} realistic leads...`; // Prompt truncated for clarity in replacement chunk

  try {
    const result = await getGenAI().models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt
    });

    const rawText = result.text || '';
    const text = extractJsonFromText(rawText);
    if (!text) return [];

    try {
      const leads = JSON.parse(text);
      if (!Array.isArray(leads)) return [];
      return leads.map((lead: any) => ({
        ...lead,
        status: 'New',
        notes: 'AI-generated lead'
      }));
    } catch (e) {
      console.error("JSON Parse Error in supplemental leads:", e);
      return [];
    }
  } catch (error) {
    console.error('Failed to generate supplemental leads:', error);
    return [];
  }
}

// Generate opportunities analysis
async function generateOpportunitiesAnalysis(query: string, realData: any[] = []): Promise<any> {
  const dataContext = realData.length > 0
    ? `\nREAL-TIME MARKET DATA:\n${JSON.stringify(realData.map(d => ({
      source: d.source,
      text: d.requestSummary,
      url: d.sourceUrl
    })), null, 2)}`
    : "\n(No real-time data found for this specific query. Use your internal knowledge to predict market gaps based on recent trends.)";

  const prompt = `
Analyze market opportunities for: "${query}"
${dataContext}

Perform a deep-dive analysis across professional forums, Reddit (r/entrepreneur, industry subs), and communities.
Extract high-fidelity signals based on real user pain points and desperation.

Return ONLY a valid JSON object with the following structure:
{
  "totalSourcesAnalyzed": 156,
  "dateRange": "Past 90 days",
  "queryInterpretation": "Briefly explain how you interpreted the query and what specific market segment was analyzed",
  "summary": "High-level overview of findings",
  "opportunities": [
    {
      "id": "opp-1",
      "problemStatement": "One sentence description of the problem",
      "overallScore": 8,
      "demandSignal": 9,
      "demandSubMetrics": {
        "frequency": 8,
        "intensity": 9,
        "uniqueVoices": 12
      },
      "marketReadiness": 7,
      "readinessSubMetrics": {
        "workarounds": true,
        "failedSolutions": true,
        "timeMoneySpent": true
      },
      "competition": "Underserved",
      "entryDifficulty": "Medium",
      "evidence": ["Market indicator 1", "Market indicator 2"],
      "whyItMatters": "Why this is a genuine opportunity now",
      "redFlags": "Potential risks or concerns",
      "nextSteps": ["Actionable step 1", "Actionable step 2"],
      "confidenceLevel": 9,
      "supportingEvidence": [
        {
          "quote": "Direct anonymized quote from a real user",
          "context": "Reddit r/entrepreneur - 2 days ago",
          "sourceUrl": "https://reddit.com/..."
        }
      ],
      "marketSentiment": 82,
      "growthVelocity": 75,
      "competitionIntensity": 45,
      "marketMaturity": "Emerging",
      "speedToMRR": {
        "estimatedWeeks": 8,
        "velocity": "Fast",
        "confidence": 8,
        "reasoning": "Low competition + high demand + simple MVP = fast validation. Similar products reached $1K MRR in 6-10 weeks."
      },
      "competitorAnalysis": {
        "primaryWeakness": "Pricing",
        "weaknessPercentage": 84,
        "topComplaints": [
          "Too expensive for small teams",
          "Enterprise pricing locks out solo founders",
          "Hidden fees and confusing pricing tiers"
        ],
        "attackVector": "Launch with transparent, founder-friendly pricing: $29/mo flat rate vs competitor's $99+ enterprise-only model",
        "yourAdvantage": "Target underserved solo founders and small teams who are priced out of existing solutions but desperate for the functionality",
        "evidence": [
          {
            "complaint": "I love [Tool X] but $120/mo is insane for what I need. I'd pay $30 for 80% of the features.",
            "source": "Reddit r/SaaS - 3 days ago"
          },
          {
            "complaint": "Switched away from [Competitor] purely because of pricing. Their 'starter' plan is a joke.",
            "source": "Twitter/X - 1 week ago"
          }
        ]
      }
    }
  ],
  "rawFindings": [
    {
      "id": "find-1",
      "title": "Post/Comment Title",
      "text": "Snippet of finding",
      "source": "Reddit",
      "url": "URL",
      "date": "2026-01-05",
      "sentiment": "Negative"
    }
  ]
}

IMPORTANT:
- Demand Intensity should reflect "desperation indicators" in the language used.
- Readiness should look for mentions of "workarounds", "hacks", or "failed solutions".
- Supporting Evidence must be 3-5 real, high-impact quotes per top opportunity.

SPEED TO $1K MRR CALCULATION (CRITICAL - UNIQUE COMPETITIVE ADVANTAGE):
For each opportunity, calculate "speedToMRR" based on:
1. **Competition Level**: Underserved = faster, Saturated = slower
2. **Entry Difficulty**: Low = faster (weeks 4-8), Medium = medium (weeks 8-16), High = slower (weeks 16-24+)
3. **Market Readiness**: Are people already paying for bad solutions? (faster) or just complaining? (slower)
4. **MVP Complexity**: Simple SaaS/Chrome Extension = fast, Hardware/Complex platform = slow

VELOCITY CLASSIFICATION:
- "Fast": 4-8 weeks (low competition, high demand, simple MVP, proven willingness to pay)
- "Medium": 8-16 weeks (moderate competition, moderate complexity, some validation needed)
- "Slow": 16-24+ weeks (high competition, complex build, market education needed, unproven monetization)

REASONING TEMPLATE:
"[Competition level] + [Demand indicator] + [MVP complexity] = [timeline]. Similar products in [category] reached $1K MRR in [X-Y] weeks."

EXAMPLE GOOD REASONING:
"Low competition + desperate demand + simple Chrome extension MVP = fast validation. Similar browser tools (Grammarly, Loom) reached $1K MRR in 6-8 weeks with basic feature set."

EXAMPLE SLOW REASONING:
"High competition + complex hardware integration + market education needed = slow ramp. Similar IoT products took 20-24 weeks to reach $1K MRR due to manufacturing and distribution challenges."

COMPETITOR WEAKNESS MAP (CRITICAL - STRATEGIC ADVANTAGE):
For each opportunity, analyze competitor weaknesses from user complaints to create an "Attack Vector":

1. **Identify Primary Weakness**: What do users complain about MOST?
   Common categories: Pricing, UX/Complexity, Missing Features, Poor Support, Performance, Reliability, Trust/Privacy

2. **Calculate Percentage**: Out of all complaints, what % mention this weakness?
   - Look for patterns: "too expensive" (pricing), "confusing UI" (UX), "doesn't have X feature" (features)
   - Estimate realistically: 60-90% = dominant weakness, 40-60% = significant, <40% = minor

3. **Extract Top Complaints**: 3-5 specific user quotes about this weakness
   - Must be real complaints from supporting evidence
   - Show specificity: "$120/mo is insane" not just "expensive"

4. **Attack Vector**: ONE SENTENCE strategy to exploit this weakness
   Template: "Launch with [your solution] vs competitor's [their problem]"
   Examples:
   - "Launch with $29/mo transparent pricing vs competitor's $99+ enterprise-only model"
   - "Launch with 5-minute setup vs competitor's 2-hour onboarding nightmare"
   - "Launch with built-in X feature vs competitor's expensive addon"

5. **Your Advantage**: HOW you can differentiate by fixing their weakness
   - Be specific about the underserved segment
   - Show the gap: "Target solo founders priced out of $100+ solutions"

6. **Evidence**: 2-3 direct complaints from real users
   - Pull from supportingEvidence or rawFindings
   - Anonymize but keep specificity

WEAKNESS DETECTION KEYWORDS:
- Pricing: "expensive", "overpriced", "costs too much", "pricing tiers", "can't afford"
- UX: "confusing", "complicated", "hard to use", "terrible UI", "steep learning curve"
- Features: "missing", "doesn't have", "wish it had", "lacks", "no support for"
- Support: "no response", "terrible support", "can't get help", "ignored my ticket"
- Performance: "slow", "buggy", "crashes", "unreliable", "downtime"
- Privacy/Trust: "don't trust", "data concerns", "privacy issues", "sketchy"

EXAMPLE GOOD ANALYSIS:
{
  "primaryWeakness": "Pricing",
  "weaknessPercentage": 84,
  "topComplaints": ["$120/mo too expensive", "Enterprise-only pricing", "Hidden fees"],
  "attackVector": "Launch with $29/mo transparent pricing vs competitor's $99+ enterprise-only model",
  "yourAdvantage": "Target underserved solo founders priced out of existing solutions",
  "evidence": [{"complaint": "Love the tool but $120/mo is insane", "source": "Reddit r/SaaS"}]
}

IMPORTANT: If there's NO clear competitor or insufficient data, SET competitorAnalysis to null.
`;

  try {
    const result = await getGenAI().models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt
    });

    const rawText = result.text || '';
    console.log("%c 🧠 RAW NEURAL RESPONSE ", "background: #1e293b; color: #8b5cf6; font-weight: bold; padding: 2px 4px;", rawText);

    const text = extractJsonFromText(rawText);

    if (!text) {
      console.warn("⚠️ NO VALID JSON EXTRACTED FROM NEURAL RESPONSE");
      return {
        opportunities: [],
        totalSourcesAnalyzed: realData.length,
        summary: "Analysis failed: No valid data returned from neural engine."
      };
    }

    try {
      const parsed = JSON.parse(text);
      return {
        totalSourcesAnalyzed: parsed.totalSourcesAnalyzed || realData.length,
        dateRange: parsed.dateRange || 'Recent',
        queryInterpretation: parsed.queryInterpretation || '',
        summary: parsed.summary || 'Analysis complete',
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
        rawFindings: Array.isArray(parsed.rawFindings) ? parsed.rawFindings : []
      };
    } catch (e) {
      console.error("JSON Parse Error in opportunities analysis:", e);
      return {
        opportunities: [],
        totalSourcesAnalyzed: realData.length,
        summary: "Analysis failed: Neural engine returned malformed intelligence data."
      };
    }
  } catch (error) {
    console.error('Failed to generate opportunities:', error);
    return {
      opportunities: [],
      totalSourcesAnalyzed: realData.length,
      summary: "Analysis failed: Connection to neural network interrupted."
    };
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

    const result = await getGenAI().models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt
    });
    return result.text || '';
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

    const result = await getGenAI().models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt
    });

    const text = result.text || '';
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to enrich contact information.');
  }
};