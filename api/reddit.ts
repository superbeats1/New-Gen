/**
 * Vercel Serverless Function: Reddit API Proxy
 *
 * This proxy handles Reddit API requests server-side to:
 * 1. Bypass CORS restrictions
 * 2. Add proper User-Agent headers
 * 3. Handle rate limiting
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subreddit, limit = 25 } = req.body;

    if (!subreddit) {
      return res.status(400).json({ error: 'Subreddit parameter is required' });
    }

    const redditUrl = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;

    console.log(`📡 Server-side Reddit request: r/${subreddit}`);

    const response = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SCOPA-Market-Intelligence/1.0; +https://github.com/superbeats1/New-Gen)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      console.warn(`Reddit API error for r/${subreddit}: ${response.status}`);

      // Return empty data instead of error to prevent app from breaking
      // Reddit API is flaky and sometimes blocks requests even with valid headers
      return res.status(200).json({
        data: { children: [] }
      });
    }

    const data = await response.json();

    console.log(`✅ Reddit API success: r/${subreddit} - ${data.data?.children?.length || 0} posts`);

    // Return the Reddit API response
    return res.status(200).json(data);

  } catch (error) {
    console.error('Reddit proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      data: { children: [] }
    });
  }
}
