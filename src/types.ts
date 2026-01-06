
export enum WorkflowMode {
  OPPORTUNITY = 'OPPORTUNITY',
  LEAD = 'LEAD',
  UNKNOWN = 'UNKNOWN'
}

export interface Opportunity {
  id: string;
  problemStatement: string;
  overallScore: number;
  demandSignal: number;
  marketReadiness: number;
  competition: 'Underserved' | 'Moderate' | 'Saturated';
  entryDifficulty: 'Low' | 'Medium' | 'High';
  evidence: string[];
  whyItMatters: string;
  redFlags: string;
  nextSteps: string[];

  // Enhanced fields for better opportunity analysis
  revenueEstimate?: {
    low: string;
    high: string;
    confidence: string;
  };
  marketSize?: string;
  targetAudience?: string;
  existingCompetitors?: string[];
  competitorWeaknesses?: string[];
  monetizationStrategies?: string[];
  validationSources?: string[];
  timeToMarket?: string;
  estimatedStartupCost?: string;

  // Trend data from Google Trends
  trendData?: {
    searchVolume: string;
    growthRate: string;
    trend: 'rising' | 'stable' | 'declining';
    relatedQueries?: string[];
  };
}

export interface Lead {
  id: string;
  prospectName: string;
  username: string;
  requestSummary: string;
  postedAt: string;
  source: string;
  location?: string;
  fitScore: number;
  budget: 'High' | 'Medium' | 'Low' | 'Unknown';
  budgetAmount?: string; // Actual budget amount if mentioned (e.g., "$5,000", "€2,500")
  urgency: 'High' | 'Medium' | 'Low';
  contactInfo: string;
  sourceUrl: string;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Won' | 'Lost';
  notes?: string;
}

export interface AnalysisResult {
  mode: WorkflowMode;
  query: string;
  summary: string;
  timestamp: string;
  opportunities?: Opportunity[];
  leads?: Lead[];
}

export interface SavedLead extends Lead {
  savedDate: string;
}

// Enrichment data interfaces
export interface CompanyInfo {
  name?: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  founded?: string;
  website?: string;
}

export interface SocialProfile {
  platform: string;
  url: string;
  verified?: boolean;
}

export interface EnrichedLead extends Lead {
  verifiedEmail?: string;
  companyData?: CompanyInfo;
  socialProfiles?: SocialProfile[];
  phoneNumber?: string;
  emailConfidence?: number;
  lastEnriched?: string;
}
