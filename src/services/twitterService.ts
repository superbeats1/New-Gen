/**
 * Twitter/X Service
 * Integrates with Twitter API v2 to collect real-time market signals
 *
 * FREE TIER: 1,500 tweets/month
 * Sign up: https://developer.twitter.com/en/portal/dashboard
 */

export interface TwitterPost {
  id: string;
  text: string;
  author: string;
  username: string;
  createdAt: string;
  metrics?: {
    likes: number;
    retweets: number;
    replies: number;
  };
  url: string;
}

export class TwitterCollector {
  private apiUrl = '/api/twitter'; // Use local API proxy

  constructor() {
    // No need to access bearer token in browser - handled server-side
  }

  /**
   * Search recent tweets for pain points and opportunities
   */
  async searchOpportunities(query: string, maxResults: number = 10): Promise<TwitterPost[]> {
    try {
      console.log(`🐦 Searching Twitter for: "${query}"`);

      // Build search query with pain point indicators
      const searchQuery = this.buildSearchQuery(query);

      // Call our server-side API proxy instead of Twitter directly
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          maxResults: Math.min(maxResults, 100)
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('⚠️ Twitter API rate limit reached. Waiting before retry...');
          return [];
        }
        console.warn(`⚠️ Twitter API proxy error: ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        console.log('📭 No Twitter results found for this query');
        return [];
      }

      // Map users for easy lookup
      const users = new Map();
      if (data.includes?.users) {
        data.includes.users.forEach((user: any) => {
          users.set(user.id, user);
        });
      }

      // Transform to our format
      const posts: TwitterPost[] = data.data.map((tweet: any) => {
        const user = users.get(tweet.author_id) || { name: 'Unknown', username: 'unknown' };
        return {
          id: tweet.id,
          text: tweet.text,
          author: user.name,
          username: user.username,
          createdAt: tweet.created_at,
          metrics: tweet.public_metrics ? {
            likes: tweet.public_metrics.like_count,
            retweets: tweet.public_metrics.retweet_count,
            replies: tweet.public_metrics.reply_count
          } : undefined,
          url: `https://twitter.com/${user.username}/status/${tweet.id}`
        };
      });

      console.log(`✅ Found ${posts.length} Twitter posts`);
      return posts;

    } catch (error) {
      console.error('Twitter API Error:', error);
      return [];
    }
  }

  /**
   * Build an optimized search query for opportunity discovery
   */
  private buildSearchQuery(userQuery: string): string {
    // Extract keywords from user query
    const keywords = userQuery.toLowerCase()
      .replace(/find|opportunities|business|ideas|gaps/gi, '')
      .trim();

    // Pain point indicators that signal opportunities
    const painIndicators = [
      'I wish there was',
      'someone should build',
      'why isn\'t there',
      'frustrated with',
      'hate that',
      'terrible experience',
      'looking for alternative',
      'better solution',
      'tired of',
      'sick of',
      'doesn\'t work',
      'problem with'
    ];

    // Build query: keywords + pain indicators
    // Twitter API query format: (phrase1 OR phrase2) keyword
    const painQuery = painIndicators
      .slice(0, 5) // Use top 5 to keep query short
      .map(p => `"${p}"`)
      .join(' OR ');

    return `(${painQuery}) ${keywords} -is:retweet -is:reply lang:en`;
  }

  /**
   * Search for specific pain points mentioned in tweets
   */
  async searchPainPoints(topic: string): Promise<TwitterPost[]> {
    const painQuery = `("${topic}" OR #${topic.replace(/\s+/g, '')}) (problem OR issue OR frustrated OR "doesn't work" OR broken OR terrible) -is:retweet lang:en`;

    try {
      // Call our server-side API proxy
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: painQuery,
          maxResults: 20
        })
      });

      if (!response.ok) return [];

      const data = await response.json();
      if (!data.data) return [];

      const users = new Map();
      if (data.includes?.users) {
        data.includes.users.forEach((user: any) => {
          users.set(user.id, user);
        });
      }

      return data.data.map((tweet: any) => {
        const user = users.get(tweet.author_id) || { name: 'Unknown', username: 'unknown' };
        return {
          id: tweet.id,
          text: tweet.text,
          author: user.name,
          username: user.username,
          createdAt: tweet.created_at,
          metrics: tweet.public_metrics ? {
            likes: tweet.public_metrics.like_count,
            retweets: tweet.public_metrics.retweet_count,
            replies: tweet.public_metrics.reply_count
          } : undefined,
          url: `https://twitter.com/${user.username}/status/${tweet.id}`
        };
      });

    } catch (error) {
      console.error('Twitter pain point search error:', error);
      return [];
    }
  }

  /**
   * Analyze tweet engagement to determine signal strength
   */
  calculateEngagementScore(post: TwitterPost): number {
    if (!post.metrics) return 5;

    const { likes, retweets, replies } = post.metrics;

    // Weighted scoring: replies (discussion) > retweets (agreement) > likes
    const score = (replies * 3) + (retweets * 2) + likes;

    // Normalize to 1-10 scale
    if (score > 100) return 10;
    if (score > 50) return 9;
    if (score > 20) return 8;
    if (score > 10) return 7;
    if (score > 5) return 6;
    return 5;
  }

  /**
   * Extract potential opportunity keywords from tweet text
   */
  extractOpportunityKeywords(text: string): string[] {
    const keywords: string[] = [];

    // Common patterns that indicate opportunities
    const patterns = [
      /I wish there was (?:a|an) (.+?)(?:\.|$)/gi,
      /someone should (?:build|make|create) (?:a|an) (.+?)(?:\.|$)/gi,
      /why isn't there (?:a|an) (.+?)(?:\.|$)/gi,
      /looking for (?:a|an) (.+?)(?:\.|$)/gi,
      /need (?:a|an) (.+?) (?:tool|app|solution|platform)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          keywords.push(match[1].trim());
        }
      }
    });

    return keywords;
  }
}

/**
 * Convert Twitter posts to opportunity leads format
 */
export function twitterPostsToLeads(posts: TwitterPost[], query: string): any[] {
  return posts.map(post => {
    const collector = new TwitterCollector();
    const engagementScore = collector.calculateEngagementScore(post);

    return {
      id: `twitter_${post.id}`,
      prospectName: post.author,
      username: `@${post.username}`,
      requestSummary: post.text,
      postedAt: new Date(post.createdAt).toLocaleDateString(),
      source: 'Twitter',
      location: 'Global',
      fitScore: engagementScore,
      budget: 'Unknown',
      urgency: post.metrics && post.metrics.replies > 5 ? 'High' : 'Medium',
      contactInfo: `Twitter: @${post.username}`,
      sourceUrl: post.url,
      status: 'New',
      notes: `Engagement: ${post.metrics?.likes || 0} likes, ${post.metrics?.retweets || 0} retweets`
    };
  });
}
