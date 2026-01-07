import { Lead, WorkflowMode } from '../types';

// Reddit API interface
interface RedditPost {
  data: {
    title: string;
    selftext: string;
    author: string;
    created_utc: number;
    url: string;
    permalink: string;
    subreddit: string;
    score: number;
    num_comments: number;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

// HackerNews API interfaces
interface HNItem {
  id: number;
  title?: string;
  text?: string;
  by?: string;
  time?: number;
  url?: string;
  score?: number;
  descendants?: number;
  type: 'story' | 'comment' | 'job';
}

// GitHub API interfaces
interface GitHubIssue {
  title: string;
  body: string;
  user: {
    login: string;
  };
  created_at: string;
  html_url: string;
  repository_url: string;
  labels: Array<{ name: string }>;
}

// Real data source configuration
const DATA_SOURCES = {
  reddit: {
    baseUrl: 'https://www.reddit.com/r',
    subreddits: {
      leads: ['entrepreneur', 'startups', 'smallbusiness', 'freelance', 'forhire', 'slavelabour'],
      opportunities: [
        // Idea & problem discussion
        'entrepreneur', 'startups', 'SomebodyMakeThis', 'AppIdeas', 'Startup_Ideas',
        'Business_Ideas', 'EntrepreneurRideAlong', 'SideProject',
        // Pain point & complaint subreddits
        'mildlyinfuriating', 'assholedesign', 'CrappyDesign',
        // Domain-specific pain points
        'smallbusiness', 'freelance', 'solopreneur', 'SaaS',
        'productivity', 'GetStudying', 'ADHD', 'selfimprovement',
        // Tech & product feedback
        'CrazyIdeas', 'LightBulb', 'MillionDollarIdeas'
      ]
    }
  },
  hackernews: {
    baseUrl: 'https://hacker-news.firebaseio.com/v0',
    endpoints: {
      newest: '/newstories.json',
      jobs: '/jobstories.json',
      item: '/item/{id}.json'
    }
  },
  github: {
    baseUrl: 'https://api.github.com',
    endpoints: {
      issues: '/search/issues',
      repos: '/search/repositories'
    }
  }
};

// Lead detection keywords
const LEAD_KEYWORDS = [
  // Direct hiring/service requests
  'looking for', 'need help with', 'seeking', 'hiring', 'wanted',
  'freelancer needed', 'contractor needed', 'developer needed',
  'designer needed', 'marketer needed', 'writer needed',
  // Budget indicators  
  'budget', 'pay', 'rate', 'price', 'cost', 'fee', 'compensation',
  // Urgency indicators
  'urgent', 'asap', 'immediately', 'quickly', 'rush', 'deadline',
  // Project indicators
  'project', 'website', 'app', 'logo', 'design', 'development'
];

const OPPORTUNITY_KEYWORDS = [
  // Problem statements
  'problem', 'issue', 'challenge', 'pain point', 'frustrated', 'struggling',
  'difficult', 'hard to find', 'no good solution', 'sucks', 'terrible',
  'annoying', 'hate that', 'why is it so', 'can\'t find', 'impossible to',
  // Complaints & dissatisfaction
  'complaint', 'complaining', 'unhappy with', 'disappointed', 'fed up',
  'sick of', 'tired of', 'wasting time', 'so many issues', 'doesn\'t work',
  'broken', 'buggy', 'unreliable', 'slow', 'expensive for what', 'overpriced',
  // Market gaps
  'wish there was', 'someone should make', 'why isn\'t there', 'should exist',
  'would pay for', 'need a tool', 'missing feature', 'no tool for',
  'lacking', 'gap in the market', 'untapped', 'overlooked',
  // Desire for solution
  'looking for a way to', 'how can I', 'any recommendations for',
  'alternative to', 'better than', 'cheaper alternative', 'simpler way to',
  // Idea validation
  'what do you think', 'would this be useful', 'market research',
  'would you pay', 'is there demand', 'who would use',
  // Unmet needs
  'no one is solving', 'nobody focuses on', 'underserved', 'neglected',
  'needs improvement', 'could be so much better', 'why don\'t they'
];

export class RealDataCollector {
  private rateLimits = {
    reddit: { lastCall: 0, minInterval: 2000 }, // 2 seconds between calls
    hackernews: { lastCall: 0, minInterval: 1000 }, // 1 second between calls  
    github: { lastCall: 0, minInterval: 1000 } // 1 second between calls
  };

  // Rate limiting helper
  private async respectRateLimit(source: keyof typeof this.rateLimits) {
    const now = Date.now();
    const limit = this.rateLimits[source];
    const timeSinceLastCall = now - limit.lastCall;

    if (timeSinceLastCall < limit.minInterval) {
      await new Promise(resolve => setTimeout(resolve, limit.minInterval - timeSinceLastCall));
    }

    this.rateLimits[source].lastCall = Date.now();
  }

  // Reddit API integration
  async scanRedditForLeads(query: string, mode: WorkflowMode): Promise<Lead[]> {
    await this.respectRateLimit('reddit');

    const leads: Lead[] = [];
    const subreddits = mode === WorkflowMode.LEAD
      ? DATA_SOURCES.reddit.subreddits.leads
      : DATA_SOURCES.reddit.subreddits.opportunities;

    try {
      for (const subreddit of subreddits.slice(0, 2)) { // Limit to 2 subreddits per query
        const url = `${DATA_SOURCES.reddit.baseUrl}/${subreddit}/new.json?limit=25`;

        console.log(`Scanning Reddit r/${subreddit} for: ${query}`);

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'SIGNAL-LeadDiscovery/1.0'
          }
        });

        if (!response.ok) {
          console.warn(`Reddit API error for r/${subreddit}: ${response.status}`);
          continue;
        }

        const data: RedditResponse = await response.json();

        for (const post of data.data.children) {
          const postData = post.data;
          const fullText = `${postData.title} ${postData.selftext}`.toLowerCase();

          // Check if post matches query and contains lead indicators
          if (this.matchesQuery(fullText, query) && this.containsLeadIndicators(fullText, mode)) {
            const budgetInfo = this.extractBudget(fullText);
            const lead: Lead = {
              id: `reddit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              prospectName: postData.author,
              username: `@${postData.author}`,
              requestSummary: this.extractRequestSummary(postData.title, postData.selftext),
              postedAt: this.formatTimeAgo(postData.created_utc),
              source: 'Reddit',
              location: this.extractLocation(fullText),
              fitScore: this.calculateFitScore(fullText, query),
              budget: budgetInfo.category,
              budgetAmount: budgetInfo.amount,
              urgency: this.extractUrgency(fullText),
              contactInfo: `Reddit user: u/${postData.author}`,
              sourceUrl: `https://reddit.com${postData.permalink}`,
              status: 'New'
            };

            leads.push(lead);

            if (leads.length >= 5) break; // Limit results per subreddit
          }
        }

        // Rate limit between subreddit calls
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Reddit scanning failed:', error);
    }

    return leads;
  }

  // HackerNews API integration  
  async scanHackerNewsForLeads(query: string): Promise<Lead[]> {
    await this.respectRateLimit('hackernews');

    const leads: Lead[] = [];

    try {
      // Get newest stories
      const storiesResponse = await fetch(`${DATA_SOURCES.hackernews.baseUrl}/newstories.json`);
      const storyIds: number[] = await storiesResponse.json();

      // Check first 50 stories
      for (const storyId of storyIds.slice(0, 50)) {
        await this.respectRateLimit('hackernews');

        const itemResponse = await fetch(`${DATA_SOURCES.hackernews.baseUrl}/item/${storyId}.json`);
        const item: HNItem = await itemResponse.json();

        if (!item.title) continue;

        const fullText = `${item.title} ${item.text || ''}`.toLowerCase();

        if (this.matchesQuery(fullText, query) && this.containsLeadIndicators(fullText, WorkflowMode.LEAD)) {
          const budgetInfo = this.extractBudget(fullText);
          const lead: Lead = {
            id: `hn_${item.id}`,
            prospectName: item.by || 'Anonymous',
            username: `@${item.by}`,
            requestSummary: item.title,
            postedAt: this.formatTimeAgo(item.time),
            source: 'HackerNews',
            fitScore: this.calculateFitScore(fullText, query),
            budget: budgetInfo.category,
            budgetAmount: budgetInfo.amount,
            urgency: this.extractUrgency(fullText),
            contactInfo: `HackerNews user: ${item.by}`,
            sourceUrl: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            status: 'New'
          };

          leads.push(lead);

          if (leads.length >= 3) break; // Limit HN results
        }
      }
    } catch (error) {
      console.error('HackerNews scanning failed:', error);
    }

    return leads;
  }

  // GitHub API integration (no auth needed for public data)
  async scanGitHubForLeads(query: string): Promise<Lead[]> {
    await this.respectRateLimit('github');

    const leads: Lead[] = [];

    try {
      // Search for issues with help-wanted labels
      const searchQuery = `"${query}" label:"help wanted" OR label:"good first issue" OR label:"freelance" is:issue is:open`;
      const url = `${DATA_SOURCES.github.baseUrl}/search/issues?q=${encodeURIComponent(searchQuery)}&per_page=10`;

      console.log('Scanning GitHub issues for:', query);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'SIGNAL-LeadDiscovery/1.0'
        }
      });

      if (!response.ok) {
        console.warn(`GitHub API error: ${response.status}`);
        return leads;
      }

      const data = await response.json();

      for (const issue of data.items || []) {
        const fullText = `${issue.title} ${issue.body || ''}`.toLowerCase();

        if (this.matchesQuery(fullText, query)) {
          const budgetInfo = this.extractBudget(fullText);
          const lead: Lead = {
            id: `github_${issue.id}`,
            prospectName: issue.user.login,
            username: `@${issue.user.login}`,
            requestSummary: issue.title,
            postedAt: this.formatTimeAgo(new Date(issue.created_at).getTime() / 1000),
            source: 'GitHub',
            fitScore: this.calculateFitScore(fullText, query),
            budget: budgetInfo.category,
            budgetAmount: budgetInfo.amount,
            urgency: this.extractUrgency(fullText),
            contactInfo: `GitHub user: @${issue.user.login}`,
            sourceUrl: issue.html_url,
            status: 'New'
          };

          leads.push(lead);
        }
      }
    } catch (error) {
      console.error('GitHub scanning failed:', error);
    }

    return leads;
  }

  // Main aggregation method
  async findRealLeads(query: string, mode: WorkflowMode): Promise<Lead[]> {
    console.log(`🔍 Starting real data collection for: "${query}" (Mode: ${mode})`);

    const allLeads: Lead[] = [];

    // Collect from all sources in parallel
    const [redditLeads, hnLeads, githubLeads] = await Promise.all([
      this.scanRedditForLeads(query, mode),
      this.scanHackerNewsForLeads(query),
      mode === WorkflowMode.LEAD ? this.scanGitHubForLeads(query) : Promise.resolve([])
    ]);

    allLeads.push(...redditLeads, ...hnLeads, ...githubLeads);

    // Sort by fit score and recency
    allLeads.sort((a, b) => {
      const scoreDiff = b.fitScore - a.fitScore;
      if (scoreDiff !== 0) return scoreDiff;

      // If scores are equal, prefer more recent
      return this.parseTimeAgo(b.postedAt) - this.parseTimeAgo(a.postedAt);
    });

    console.log(`📊 Found ${allLeads.length} real leads from live sources`);
    return allLeads.slice(0, 8); // Return top 8 results
  }

  // Helper methods
  // Strict matching: Ensures the post is actually relevant to the SEARCH TERMS
  private matchesQueryStrict(text: string, cleanQuery: string): boolean {
    const queryWords = cleanQuery.toLowerCase().split(' ').filter(w => w.length > 2);
    if (queryWords.length === 0) return true; // Fallback

    // Count how many query words appear in the text
    const matches = queryWords.filter(word => text.includes(word));

    // For short queries (1-2 words), require ALL of them
    if (queryWords.length <= 2) {
      return matches.length === queryWords.length;
    }

    // For longer queries, require at least 75% match
    return (matches.length / queryWords.length) >= 0.75;
  }

  // Deprecated naive matcher
  private matchesQuery(text: string, query: string): boolean {
    if (!text || !query) return false;
    const queryWords = query.toLowerCase().split(' ');
    return queryWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
  }

  private containsLeadIndicators(text: string, mode: WorkflowMode): boolean {
    if (!text) return false;
    const keywords = mode === WorkflowMode.LEAD ? LEAD_KEYWORDS : OPPORTUNITY_KEYWORDS;
    return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  }

  private extractRequestSummary(title: string, body?: string): string {
    const combined = `${title} ${body || ''}`;
    // Return first 150 characters, ending at word boundary
    if (combined.length <= 150) return combined;
    const truncated = combined.substr(0, 150);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substr(0, lastSpace) + '...' : truncated + '...';
  }

  private extractLocation(text: string): string | undefined {
    // Simple location extraction - can be improved
    const locationPatterns = [
      /\b(NYC|New York|SF|San Francisco|LA|Los Angeles|Chicago|Boston|Seattle|Austin|Denver|Miami|Atlanta|Dallas|Portland|Nashville)\b/gi,
      /\b([A-Z][a-z]+,\s*[A-Z]{2})\b/g, // City, ST format
      /\b(remote|anywhere|global|worldwide)\b/gi
    ];

    for (const pattern of locationPatterns) {
      if (!text || typeof text !== 'string') continue;
      const match = text.match(pattern);
      if (match && match[0]) return match[0];
    }

    return undefined;
  }

  private calculateFitScore(text: string, query: string): number {
    let score = 5; // Base score

    const queryWords = query.toLowerCase().split(' ');
    const wordMatches = queryWords.filter(word => text.includes(word)).length;
    score += (wordMatches / queryWords.length) * 3; // Up to +3 for query relevance

    // Boost for budget mentions
    if (/\$\d+|budget|pay|rate/i.test(text)) score += 1;

    // Boost for urgency
    if (/urgent|asap|immediately|quickly/i.test(text)) score += 1;

    // Boost for professional terms
    if (/project|professional|experienced|portfolio/i.test(text)) score += 1;

    return Math.min(Math.round(score), 10);
  }

  private extractBudget(text: string): { category: 'High' | 'Medium' | 'Low' | 'Unknown'; amount?: string } {
    // 1. Look for explicit currency values first (most accurate)
    // Matches: $500, $5k, $5,000, 500 USD, 5k euro, etc.
    const currencyPatterns = [
      /[\$£€](\d+(?:,\d+)*(?:\.\d+)?k?)/gi,                 // $500, $5k
      /(\d+(?:,\d+)*(?:\.\d+)?k?)\s*(?:USD|EUR|GBP|dollars?)/gi, // 500 USD
    ];

    for (const pattern of currencyPatterns) {
      if (!text || typeof text !== 'string') continue;
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        // Take the first match that looks like a budget
        const rawString = matches[0];
        if (!rawString || typeof rawString !== 'string') continue;
        const numberMatch = rawString.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
        const numberPart = numberMatch ? numberMatch[0] : null;

        if (numberPart) {
          let value = parseFloat(numberPart.replace(/,/g, ''));
          // Handle 'k' multiplier
          if (rawString.toLowerCase().includes('k')) value *= 1000;

          if (value > 0) {
            let category: 'High' | 'Medium' | 'Low' = 'Low';
            if (value >= 5000) category = 'High';
            else if (value >= 1000) category = 'Medium';

            return {
              category,
              amount: rawString.startsWith('$') ? rawString : `$${value.toLocaleString()}` // Standardize to $ for display if needed, or keep original
            };
          }
        }
      }
    }

    // 2. Look for keywords if no explicit amount found
    const lowerText = text ? text.toLowerCase() : '';

    if (lowerText && lowerText.match(/high budget|well funded|unlimited budget|money is no object|good pay/)) {
      return { category: 'High' };
    }

    if (lowerText && lowerText.match(/average budget|standard rate|market rate|negotiable/)) {
      return { category: 'Medium' };
    }

    if (lowerText && lowerText.match(/low budget|tight budget|small budget|cheap|student|volunteer|equity|unpaid/)) {
      return { category: 'Low' };
    }

    return { category: 'Unknown' };
  }

  private extractUrgency(text: string): 'High' | 'Medium' | 'Low' {
    if (/urgent|asap|immediately|rush|deadline|quickly/i.test(text)) return 'High';
    if (/soon|next week|this month|timely/i.test(text)) return 'Medium';
    return 'Low';
  }

  private formatTimeAgo(timestamp: number | undefined): string {
    if (!timestamp) return 'Recently';

    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 604800)} weeks ago`;
  }

  private parseTimeAgo(timeStr: string): number {
    // Simple parsing - return lower numbers for more recent
    if (timeStr.includes('minute')) return parseInt(timeStr) || 0;
    if (timeStr.includes('hour')) return (parseInt(timeStr) || 0) * 60;
    if (timeStr.includes('day')) return (parseInt(timeStr) || 0) * 1440;
    if (timeStr.includes('week')) return (parseInt(timeStr) || 0) * 10080;
    return 99999; // Very old
  }
}