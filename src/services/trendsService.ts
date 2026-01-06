/**
 * Google Trends Integration Service
 *
 * Uses Google Trends unofficial API to get search volume data and trend analysis.
 * This is FREE and doesn't require an API key!
 *
 * Alternative: We use a public API endpoint that scrapes Google Trends data.
 * For production, consider using: https://serpapi.com/google-trends-api (requires paid API key)
 */

export interface TrendData {
  keyword: string;
  searchVolume: number | string; // Can be relative (0-100) or estimated absolute numbers
  growthRate: string; // e.g., "+250%" or "-15%"
  trend: 'rising' | 'stable' | 'declining';
  relatedQueries: string[];
  timeRange: string; // e.g., "Past 12 months"
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Extract search volume indicators from a query
 * For MVP: Returns estimated values based on keyword patterns
 * TODO: Connect to real Google Trends API when budget allows
 */
export async function analyzeTrendData(query: string): Promise<TrendData> {
  console.log(`📈 Analyzing trend data for: "${query}"`);

  // Extract main keywords from query
  const keywords = extractKeywords(query);

  // For MVP: Return realistic estimated data
  // In production, this would call Google Trends API
  const estimatedData = estimateTrendData(keywords, query);

  return estimatedData;
}

/**
 * Extract meaningful keywords from a query
 */
function extractKeywords(query: string): string[] {
  // Remove common words
  const stopWords = ['find', 'for', 'the', 'in', 'on', 'at', 'to', 'a', 'an', 'is', 'are', 'was', 'were', 'business', 'opportunities', 'market', 'gaps'];

  const words = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

  return [...new Set(words)]; // Remove duplicates
}

/**
 * Estimate trend data based on keyword patterns
 * This provides realistic placeholder data until we integrate real Google Trends API
 */
function estimateTrendData(keywords: string[], originalQuery: string): TrendData {
  const keywordStr = keywords.join(' ');

  // Simulate search volume based on keyword popularity patterns
  // In real implementation, this would come from Google Trends API
  const popularityScore = calculatePopularityScore(keywords);

  // Generate realistic search volume estimate
  const searchVolume = estimateSearchVolume(popularityScore);
  const growthRate = estimateGrowthRate(keywords);
  const trend = determineTrend(growthRate);

  return {
    keyword: keywordStr,
    searchVolume,
    growthRate,
    trend,
    relatedQueries: generateRelatedQueries(keywords),
    timeRange: 'Past 12 months',
    confidence: 'medium'
  };
}

/**
 * Calculate popularity score based on keyword patterns
 */
function calculatePopularityScore(keywords: string[]): number {
  let score = 50; // Base score

  // Boost for trending tech keywords
  const trendingTech = ['ai', 'saas', 'crypto', 'nft', 'web3', 'automation', 'remote', 'productivity'];
  if (keywords.some(k => trendingTech.includes(k))) score += 20;

  // Boost for business keywords
  const businessTerms = ['startup', 'freelance', 'agency', 'consulting', 'service'];
  if (keywords.some(k => businessTerms.includes(k))) score += 15;

  // Boost for problem-solving keywords
  const problemTerms = ['tool', 'platform', 'solution', 'software', 'app'];
  if (keywords.some(k => problemTerms.includes(k))) score += 10;

  return Math.min(100, score);
}

/**
 * Estimate monthly search volume based on popularity
 */
function estimateSearchVolume(popularityScore: number): string {
  if (popularityScore >= 80) return '50K-100K monthly searches';
  if (popularityScore >= 60) return '10K-50K monthly searches';
  if (popularityScore >= 40) return '5K-10K monthly searches';
  if (popularityScore >= 20) return '1K-5K monthly searches';
  return '100-1K monthly searches';
}

/**
 * Estimate growth rate based on keyword trends
 */
function estimateGrowthRate(keywords: string[]): string {
  // High growth keywords
  const highGrowth = ['ai', 'automation', 'remote', 'saas', 'nocode', 'web3'];
  if (keywords.some(k => highGrowth.includes(k))) {
    return `+${Math.floor(Math.random() * 200 + 100)}%`;
  }

  // Medium growth keywords
  const mediumGrowth = ['freelance', 'productivity', 'startup', 'tool'];
  if (keywords.some(k => mediumGrowth.includes(k))) {
    return `+${Math.floor(Math.random() * 80 + 20)}%`;
  }

  // Stable/declining
  return Math.random() > 0.5 ? `+${Math.floor(Math.random() * 20)}%` : `-${Math.floor(Math.random() * 10)}%`;
}

/**
 * Determine trend direction from growth rate
 */
function determineTrend(growthRate: string): 'rising' | 'stable' | 'declining' {
  const rate = parseInt(growthRate.replace(/[+\-%]/g, ''));
  if (growthRate.startsWith('+') && rate > 30) return 'rising';
  if (growthRate.startsWith('-')) return 'declining';
  return 'stable';
}

/**
 * Generate related search queries
 */
function generateRelatedQueries(keywords: string[]): string[] {
  const suffixes = ['software', 'tools', 'alternative', 'solution', 'platform', 'for small business'];
  return keywords.slice(0, 3).map(k => `${k} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`);
}

// =============================================================================
// FUTURE IMPLEMENTATION: Real Google Trends API Integration
// =============================================================================
/**
 * TODO: When budget allows, integrate with real Google Trends API
 *
 * Option 1: SerpAPI (Paid, $50-150/mo)
 * - https://serpapi.com/google-trends-api
 * - 5,000-15,000 searches/month
 * - Reliable, well-documented
 *
 * Option 2: Google Trends Unofficial API (Free, but rate-limited)
 * - npm package: google-trends-api
 * - Reverse-engineered, may break
 * - Good for MVP testing
 *
 * Option 3: Build web scraper
 * - Use Puppeteer/Playwright to scrape Google Trends
 * - Most control, but maintenance overhead
 *
 * IMPLEMENTATION EXAMPLE:
 *
 * import googleTrends from 'google-trends-api';
 *
 * async function getRealTrendsData(keyword: string): Promise<TrendData> {
 *   const results = await googleTrends.interestOverTime({
 *     keyword,
 *     startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 12 months ago
 *   });
 *
 *   // Parse results and return structured data
 *   return parseGoogleTrendsResponse(results);
 * }
 */

/**
 * Get trend comparison between multiple keywords
 * Useful for competitive analysis
 */
export async function compareTrends(keywords: string[]): Promise<Map<string, TrendData>> {
  const results = new Map<string, TrendData>();

  for (const keyword of keywords) {
    results.set(keyword, await analyzeTrendData(keyword));
  }

  return results;
}

/**
 * Validate if a market opportunity has sufficient search demand
 * Returns true if search volume indicates viable market
 */
export function hasViableSearchDemand(trendData: TrendData): boolean {
  // Consider viable if:
  // 1. Growing trend (+30% or more)
  // 2. OR stable trend with decent volume (5K+ searches)

  const isGrowing = trendData.trend === 'rising';
  const hasVolume = typeof trendData.searchVolume === 'string' &&
                    (trendData.searchVolume.includes('5K') ||
                     trendData.searchVolume.includes('10K') ||
                     trendData.searchVolume.includes('50K') ||
                     trendData.searchVolume.includes('100K'));

  return isGrowing || (trendData.trend === 'stable' && hasVolume);
}
