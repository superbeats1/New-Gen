import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genai = new GoogleGenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY!
});

function shouldProcessAlert(alert: any): boolean {
  if (!alert.last_checked) return true;

  const hoursSinceCheck = (Date.now() - new Date(alert.last_checked).getTime()) / (1000 * 60 * 60);

  if (alert.frequency === 'daily') {
    return hoursSinceCheck >= 23;
  } else if (alert.frequency === 'weekly') {
    return hoursSinceCheck >= (7 * 24) - 1;
  }

  return false;
}

async function processAlert(alert: any) {
  const startTime = Date.now();

  try {
    // Build prompt for Gemini
    const prompt = `Analyze recent market discussions for opportunities related to: "${alert.keyword}"

Search across Reddit, Twitter, HackerNews, and GitHub for:
1. People expressing pain points or needs
2. Feature requests or product gaps
3. Budget discussions or willingness to pay
4. Complaints about existing solutions

Return a JSON object with:
{
  "hasOpportunity": boolean,
  "score": number (1-10),
  "summary": "brief summary of findings",
  "opportunitiesCount": number,
  "opportunities": [
    {
      "title": "...",
      "description": "...",
      "source": "reddit|twitter|hn|github",
      "url": "...",
      "score": number
    }
  ]
}`;

    const result = await genai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt
    });

    const responseText = result.text || '';

    // Parse response
    let analysis: any;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { hasOpportunity: false, score: 0 };
    } catch {
      analysis = { hasOpportunity: false, score: 0 };
    }

    const processingTime = Date.now() - startTime;

    // Create alert log
    const { data: logData } = await supabase
      .from('alert_logs')
      .insert({
        alert_id: alert.id,
        score: analysis.score || 0,
        summary: analysis.summary || 'No opportunities found',
        opportunities_data: analysis.opportunities || [],
        sources_analyzed: 4,
        processing_time_ms: processingTime
      })
      .select()
      .single();

    // Update alert last_checked
    await supabase
      .from('alerts')
      .update({ last_checked: new Date().toISOString() })
      .eq('id', alert.id);

    // Create notification if opportunities found
    if (analysis.hasOpportunity && analysis.score > 7) {
      await supabase
        .from('notifications')
        .insert({
          user_id: alert.user_id,
          alert_id: alert.id,
          type: 'alert_result',
          title: `${analysis.opportunitiesCount || 1} new opportunities: ${alert.keyword}`,
          message: analysis.summary,
          metadata: {
            score: analysis.score,
            alert_log_id: logData?.id
          }
        });

      // Update last_notified
      await supabase
        .from('alerts')
        .update({ last_notified: new Date().toISOString() })
        .eq('id', alert.id);
    }

    return {
      alertId: alert.id,
      keyword: alert.keyword,
      success: true,
      opportunitiesFound: analysis.opportunitiesCount || 0,
      score: analysis.score
    };

  } catch (error) {
    console.error(`Error processing alert ${alert.id}:`, error);

    // Create error notification
    await supabase
      .from('notifications')
      .insert({
        user_id: alert.user_id,
        alert_id: alert.id,
        type: 'error',
        title: `Alert check failed: ${alert.keyword}`,
        message: 'We encountered an error checking your alert. We\'ll try again at the next scheduled time.',
        metadata: { error: (error as Error).message }
      });

    return {
      alertId: alert.id,
      keyword: alert.keyword,
      success: false,
      error: (error as Error).message
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch all enabled alerts
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('enabled', true);

    if (error) throw error;

    // Filter by frequency
    const alertsToProcess = (alerts || []).filter(shouldProcessAlert);

    console.log(`Processing ${alertsToProcess.length} alerts...`);

    // Process alerts
    const results = await Promise.all(
      alertsToProcess.map(alert => processAlert(alert))
    );

    const summary = {
      totalAlerts: alerts?.length || 0,
      processed: results.length,
      successful: results.filter(r => r.success).length,
      opportunitiesFound: results.reduce((sum, r) => sum + (r.opportunitiesFound || 0), 0),
      errors: results.filter(r => !r.success).length,
      details: results
    };

    console.log('Alert processing complete:', summary);

    return res.status(200).json(summary);

  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
