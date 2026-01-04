
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
