import type { GoogleGenAI } from "@google/genai";
import { WorkflowMode, AnalysisResult } from "./types";
import { RealDataCollector } from "./services/realDataService";

// Check multiple possible environment variable names - but don't access import.meta.env at module level
let apiKey: string | undefined;
let genAIInstance: GoogleGenAI | null = null;
// Instantiate immediately since we are using static import (this is lightweight)
const realDataCollector = new RealDataCollector();

const getApiKey = () => {
  if (!apiKey) {
    apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
      import.meta.env.VITE_GOOGLE_API_KEY ||
      import.meta.env.GEMINI_API_KEY;
  }
  return apiKey;
};

const getGenAI = async () => {
  if (!genAIInstance) {
    const key = getApiKey();
    if (!key) {
      console.error('All environment variables:', import.meta.env);
      throw new Error(`VITE_GEMINI_API_KEY environment variable is not set.`);
    }
    // Lazy load GoogleGenAI to prevent initialization errors on page load
    const { GoogleGenAI } = await import("@google/genai");
    genAIInstance = new GoogleGenAI({ apiKey: key });
  }
  return genAIInstance;
};

// Removed getRealDataCollector as it is no longer needed with static import

export const analyzeQuery = async (query: string): Promise<AnalysisResult> => {
  try {
    console.log(`🧠 Starting opportunity analysis for: "${query}"`);

    // Force Opportunity Mode (Pivot Phase 1)
    const detectedMode = WorkflowMode.OPPORTUNITY;
    console.log(`🎯 Mode set to: ${detectedMode}`);

    // Step 2: Get real data from active sources
    console.log(`📡 Collecting real-time market data...`);
    const collector = realDataCollector;
    const realData = await collector.findRealLeads(query, detectedMode);

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
    console.log(`📦 Result object opportunities:`, result.opportunities);
    console.log(`📦 Result object opportunities length:`, result.opportunities?.length);
    return result;

  } catch (error: any) {
    console.error('Analysis failed:', error);
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('Daily quota exceeded. Please try again tomorrow or upgrade your plan in Google AI Studio.');
    }
    throw new Error('Failed to analyze query. Please check your API key and try again.');
  }
};

// Helper to safely extract text from Gemini response
function getGeminiText(result: any): string {
  try {
    if (result.response?.text && typeof result.response.text === 'function') {
      return result.response.text();
    }
    if (result.text && typeof result.text === 'function') {
      return result.text();
    }
    if (result.text && typeof result.text === 'string') {
      return result.text;
    }
    return '';
  } catch (e) {
    console.error("Error extracting text from Gemini result:", e);
    return '';
  }
}

// Helper to extract JSON from text that might contain markdown or conversational filler
function repairTruncatedJson(json: string): string {
  if (!json) return json;

  // Count open brackets and braces
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < json.length; i++) {
    const char = json[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') openBraces++;
      else if (char === '}') openBraces--;
      else if (char === '[') openBrackets++;
      else if (char === ']') openBrackets--;
    }
  }

  // If balanced, return as-is
  if (openBraces === 0 && openBrackets === 0) {
    return json;
  }

  console.log(`🔧 Repairing truncated JSON: ${openBraces} unclosed braces, ${openBrackets} unclosed brackets`);

  // Try to find the last complete object in an array
  // Look for the last complete "}" that could end an array item
  let repaired = json;

  // If we're in the middle of a string, close it
  if (inString) {
    repaired += '"';
  }

  // Find the last valid stopping point (after a complete value)
  // Look for patterns like: "},\n    {" which indicates an incomplete next item
  const incompleteItemPattern = /,\s*\{[^}]*$/;
  if (incompleteItemPattern.test(repaired)) {
    // Remove the incomplete item
    repaired = repaired.replace(incompleteItemPattern, '');
    console.log('🔧 Removed incomplete array item');
  }

  // Also check for incomplete property
  const incompletePropertyPattern = /,\s*"[^"]*":\s*(?:\{[^}]*|\[[^\]]*|"[^"]*)?$/;
  if (incompletePropertyPattern.test(repaired)) {
    repaired = repaired.replace(incompletePropertyPattern, '');
    console.log('🔧 Removed incomplete property');
  }

  // Recount after cleanup
  openBraces = 0;
  openBrackets = 0;
  inString = false;
  escapeNext = false;

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    if (escapeNext) { escapeNext = false; continue; }
    if (char === '\\') { escapeNext = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (!inString) {
      if (char === '{') openBraces++;
      else if (char === '}') openBraces--;
      else if (char === '[') openBrackets++;
      else if (char === ']') openBrackets--;
    }
  }

  // Close any remaining open structures
  while (openBrackets > 0) {
    repaired += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    repaired += '}';
    openBraces--;
  }

  return repaired;
}

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
      let extracted = text.substring(start, end + 1);

      // Try to parse as-is first
      try {
        JSON.parse(extracted);
        return extracted;
      } catch (e) {
        // If parsing fails, try to repair truncated JSON
        console.log('🔧 JSON parse failed, attempting repair...');
        const repaired = repairTruncatedJson(extracted);
        try {
          JSON.parse(repaired);
          console.log('✅ JSON repair successful');
          return repaired;
        } catch (e2) {
          console.warn('⚠️ JSON repair failed, returning original');
          return extracted;
        }
      }
    }
  } catch (e) {
    console.warn("Manual JSON extraction failed, falling back to regex", e);
  }

  // Final safety check before replace
  if (!text || typeof text !== 'string') return '';
  return text.replace(/```json\n?|\n?```/g, '').trim();
}

// Generate supplemental leads when real data is insufficient
async function generateSupplementalLeads(query: string, count: number): Promise<any[]> {
  const prompt = `
Generate ${count} realistic leads...`; // Prompt truncated for clarity in replacement chunk

  try {
    const genAI = await getGenAI();
    const result = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt
    });

    const rawText = getGeminiText(result);
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

IMPORTANT: Generate AT LEAST 3-5 HIGH-QUALITY OPPORTUNITIES. Do not stop at just one.
Each opportunity should represent a distinct market gap or pain point.

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
    },
    // ... include at least 2-4 more opportunities here (opp-2, opp-3, opp-4, opp-5)
    // Each with unique problem statements, scores, and evidence
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
- GENERATE 3-5 DISTINCT OPPORTUNITIES (minimum 3, ideally 5) - do NOT return just one opportunity
- Each opportunity must represent a different market gap, pain point, or segment
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
    const genAI = await getGenAI();
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });

    const rawText = getGeminiText(result);
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
      console.log(`📊 Parsed JSON successfully`);
      console.log(`📊 parsed.opportunities:`, parsed.opportunities);
      console.log(`📊 parsed.opportunities is Array:`, Array.isArray(parsed.opportunities));
      console.log(`📊 parsed.opportunities length:`, parsed.opportunities?.length);

      // Validate and clean opportunities data
      const validatedOpportunities = Array.isArray(parsed.opportunities)
        ? parsed.opportunities.map((opp: any) => ({
          ...opp,
          supportingEvidence: Array.isArray(opp.supportingEvidence)
            ? opp.supportingEvidence
              .filter((ev: any) => ev && typeof ev === 'object' && ev.quote && ev.context)
              .map((ev: any) => ({
                quote: ev.quote || '',
                context: ev.context || '',
                sourceUrl: ev.sourceUrl && typeof ev.sourceUrl === 'string' && ev.sourceUrl.trim()
                  ? ev.sourceUrl.trim()
                  : undefined
              }))
              .filter((ev: any) => ev.sourceUrl) // Only keep evidence with valid URLs
            : []
        }))
        : [];

      console.log(`📊 validatedOpportunities:`, validatedOpportunities);
      console.log(`📊 validatedOpportunities length:`, validatedOpportunities.length);

      return {
        totalSourcesAnalyzed: parsed.totalSourcesAnalyzed || realData.length,
        dateRange: parsed.dateRange || 'Recent',
        queryInterpretation: parsed.queryInterpretation || '',
        summary: parsed.summary || 'Analysis complete',
        opportunities: validatedOpportunities,
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

    const genAI = await getGenAI();
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    return getGeminiText(result);
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

    const genAI = await getGenAI();
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });

    const text = getGeminiText(result);
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid response from Gemini API');
    }
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    if (!cleanText) {
      throw new Error('Empty response from Gemini API');
    }
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to enrich contact information.');
  }
};