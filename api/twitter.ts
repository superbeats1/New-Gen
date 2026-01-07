/**
 * Vercel Serverless Function: Twitter API Proxy
 *
 * This proxy handles Twitter API requests server-side to:
 * 1. Bypass CORS restrictions
 * 2. Keep Bearer Token secure (not exposed in browser)
 * 3. Add rate limiting and error handling
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Bearer Token from environment variable
  const bearerToken = process.env.VITE_TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    console.warn('⚠️ Twitter Bearer Token not configured on server');
    return res.status(200).json({ data: [], includes: {} });
  }

  try {
    const { query, maxResults = 10 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Build Twitter API request
    const params = new URLSearchParams({
      query: query,
      max_results: Math.min(maxResults, 100).toString(),
      'tweet.fields': 'created_at,public_metrics,author_id',
      'user.fields': 'name,username',
      expansions: 'author_id'
    });

    const twitterUrl = `https://api.twitter.com/2/tweets/search/recent?${params}`;

    console.log(`🐦 Server-side Twitter request: ${query.substring(0, 50)}...`);

    const response = await fetch(twitterUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'User-Agent': 'SCOPA-AI-Market-Intelligence/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('⚠️ Twitter API rate limit reached');
        return res.status(429).json({ error: 'Rate limit exceeded', data: [] });
      }

      const errorText = await response.text();
      console.error(`Twitter API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({
        error: `Twitter API error: ${response.statusText}`,
        data: []
      });
    }

    const data = await response.json();

    console.log(`✅ Twitter API success: ${data.data?.length || 0} tweets`);

    // Return the Twitter API response
    return res.status(200).json(data);

  } catch (error) {
    console.error('Twitter proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      data: []
    });
  }
}
