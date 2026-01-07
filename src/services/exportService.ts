import { AnalysisResult, Opportunity } from '../types';

/**
 * Export Service
 * Handles exporting opportunity analysis to various formats (CSV, JSON)
 */

export const exportService = {
  /**
   * Export opportunities as CSV
   */
  exportToCSV(results: AnalysisResult): void {
    if (!results.opportunities || results.opportunities.length === 0) {
      alert('No opportunities to export');
      return;
    }

    const opportunities = results.opportunities;

    // CSV Headers
    const headers = [
      'Problem Statement',
      'Overall Score',
      'Demand Signal',
      'Market Readiness',
      'Competition',
      'Entry Difficulty',
      'Revenue Low',
      'Revenue High',
      'Revenue Confidence',
      'Market Size',
      'Target Audience',
      'Competitors',
      'Weaknesses',
      'Monetization',
      'Time to Market',
      'Startup Cost',
      'Search Volume',
      'Growth Rate',
      'Trend',
      'Why It Matters',
      'Red Flags',
      'Next Steps',
      'Evidence'
    ];

    // Build CSV rows
    const rows = opportunities.map(opp => [
      `"${opp.problemStatement?.replace(/"/g, '""') || ''}"`,
      opp.overallScore || '',
      opp.demandSignal || '',
      opp.marketReadiness || '',
      opp.competition || '',
      opp.entryDifficulty || '',
      opp.revenueEstimate?.low || '',
      opp.revenueEstimate?.high || '',
      `"${opp.revenueEstimate?.confidence?.replace(/"/g, '""') || ''}"`,
      `"${opp.marketSize?.replace(/"/g, '""') || ''}"`,
      `"${opp.targetAudience?.replace(/"/g, '""') || ''}"`,
      `"${opp.existingCompetitors?.join(', ')?.replace(/"/g, '""') || ''}"`,
      `"${opp.competitorWeaknesses?.join(', ')?.replace(/"/g, '""') || ''}"`,
      `"${opp.monetizationStrategies?.join(', ')?.replace(/"/g, '""') || ''}"`,
      opp.timeToMarket || '',
      opp.estimatedStartupCost || '',
      opp.trendData?.searchVolume || '',
      opp.trendData?.growthRate || '',
      opp.trendData?.trend || '',
      `"${opp.whyItMatters?.replace(/"/g, '""') || ''}"`,
      `"${opp.redFlags?.replace(/"/g, '""') || ''}"`,
      `"${opp.nextSteps?.join('; ')?.replace(/"/g, '""') || ''}"`,
      `"${opp.evidence?.join('; ')?.replace(/"/g, '""') || ''}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fileName = `scopa-ai-opportunities-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Export opportunities as JSON
   */
  exportToJSON(results: AnalysisResult): void {
    if (!results.opportunities || results.opportunities.length === 0) {
      alert('No opportunities to export');
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      query: results.query,
      summary: results.summary,
      totalOpportunities: results.opportunities.length,
      opportunities: results.opportunities,
      metadata: {
        totalSourcesAnalyzed: results.totalSourcesAnalyzed,
        dateRange: results.dateRange,
        queryInterpretation: results.queryInterpretation
      }
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fileName = `scopa-ai-opportunities-${new Date().toISOString().split('T')[0]}.json`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Export opportunities as formatted text report
   */
  exportToText(results: AnalysisResult): void {
    if (!results.opportunities || results.opportunities.length === 0) {
      alert('No opportunities to export');
      return;
    }

    let textContent = `SCOPA AI - MARKET INTELLIGENCE REPORT
Generated: ${new Date().toLocaleString()}
Query: ${results.query}

${results.summary}

================================================================================
OPPORTUNITIES IDENTIFIED: ${results.opportunities.length}
================================================================================

`;

    results.opportunities.forEach((opp, index) => {
      textContent += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPPORTUNITY #${index + 1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PROBLEM STATEMENT
${opp.problemStatement}

📊 SCORES
Overall Score: ${opp.overallScore}/10
Demand Signal: ${opp.demandSignal}/10
Market Readiness: ${opp.marketReadiness}/10
Competition: ${opp.competition}
Entry Difficulty: ${opp.entryDifficulty}

💰 REVENUE POTENTIAL
${opp.revenueEstimate ? `
Low Estimate: ${opp.revenueEstimate.low}
High Estimate: ${opp.revenueEstimate.high}
Confidence: ${opp.revenueEstimate.confidence}
` : 'Not estimated'}

🎯 MARKET ANALYSIS
Market Size: ${opp.marketSize || 'Not specified'}
Target Audience: ${opp.targetAudience || 'Not specified'}

🏢 COMPETITION
Existing Competitors:
${opp.existingCompetitors?.map(c => `  • ${c}`).join('\n') || 'None identified'}

Weaknesses to Exploit:
${opp.competitorWeaknesses?.map(w => `  • ${w}`).join('\n') || 'None identified'}

💵 MONETIZATION STRATEGIES
${opp.monetizationStrategies?.map(s => `  • ${s}`).join('\n') || 'Not specified'}

📈 TREND DATA
${opp.trendData ? `
Search Volume: ${opp.trendData.searchVolume}
Growth Rate: ${opp.trendData.growthRate}
Trend Direction: ${opp.trendData.trend}
${opp.trendData.relatedQueries ? `Related Queries: ${opp.trendData.relatedQueries.join(', ')}` : ''}
` : 'No trend data available'}

⏱️ TIME & COST
Time to Market: ${opp.timeToMarket || 'Not estimated'}
Startup Cost: ${opp.estimatedStartupCost || 'Not estimated'}

💡 WHY IT MATTERS
${opp.whyItMatters}

⚠️ RED FLAGS
${opp.redFlags}

✅ NEXT STEPS
${opp.nextSteps?.map(s => `  1. ${s}`).join('\n') || 'Not specified'}

📌 EVIDENCE
${opp.evidence?.map(e => `  • ${e}`).join('\n') || 'No evidence provided'}

`;
    });

    textContent += `
================================================================================
END OF REPORT
================================================================================

Generated with SCOPA AI - Market Intelligence Platform
https://scopa.ai
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fileName = `scopa-ai-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
