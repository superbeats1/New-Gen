import { Lead, EnrichedLead, CompanyInfo, SocialProfile } from '../types';

// Environment variables for API keys (FREE TIER ONLY)
const HUNTER_API_KEY = import.meta.env.VITE_HUNTER_API_KEY; // FREE: 25 searches/month
const CLEARBIT_API_KEY = import.meta.env.VITE_CLEARBIT_API_KEY; // FREE: 50 lookups/month (if available)

// Rate limiting for free tiers
let hunterCallsThisMonth = 0;
let clearbitCallsThisMonth = 0;
const MAX_HUNTER_FREE_CALLS = 25; // Hunter.io free tier limit
const MAX_CLEARBIT_FREE_CALLS = 50; // Clearbit free tier limit

// Reset counters monthly (simplified approach)
const resetCountersIfNeeded = () => {
  const now = new Date();
  const lastReset = localStorage.getItem('lastApiReset');
  
  if (!lastReset || new Date(lastReset).getMonth() !== now.getMonth()) {
    hunterCallsThisMonth = 0;
    clearbitCallsThisMonth = 0;
    localStorage.setItem('lastApiReset', now.toISOString());
    localStorage.setItem('hunterCalls', '0');
    localStorage.setItem('clearbitCalls', '0');
  } else {
    hunterCallsThisMonth = parseInt(localStorage.getItem('hunterCalls') || '0');
    clearbitCallsThisMonth = parseInt(localStorage.getItem('clearbitCalls') || '0');
  }
};

// Hunter.io API Integration (FREE TIER: 25 searches/month)
export const hunterEnrichEmail = async (domain: string, firstName: string, lastName?: string): Promise<{email?: string, confidence?: number}> => {
  resetCountersIfNeeded();
  
  if (!HUNTER_API_KEY) {
    console.warn('Hunter.io API key not configured - using free tier limits');
    return {};
  }
  
  if (hunterCallsThisMonth >= MAX_HUNTER_FREE_CALLS) {
    console.warn(`Hunter.io free tier limit reached (${MAX_HUNTER_FREE_CALLS}/month). Skipping call.`);
    return {};
  }

  try {
    const baseUrl = 'https://api.hunter.io/v2/email-finder';
    const params = new URLSearchParams({
      domain,
      first_name: firstName,
      api_key: HUNTER_API_KEY
    });

    if (lastName) {
      params.append('last_name', lastName);
    }

    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Hunter.io API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.email) {
      // Track successful API call
      hunterCallsThisMonth++;
      localStorage.setItem('hunterCalls', hunterCallsThisMonth.toString());
      
      return {
        email: data.data.email,
        confidence: data.data.confidence || 0
      };
    }
    
    return {};
  } catch (error) {
    console.error('Hunter.io enrichment failed:', error);
    return {};
  }
};

// FREE ALTERNATIVE: Email pattern guessing (no API calls needed)
export const guessEmailFromName = (firstName: string, lastName: string, domain: string): {email: string, confidence: number}[] => {
  const first = firstName.toLowerCase().trim();
  const last = lastName?.toLowerCase().trim() || '';
  
  if (!last) {
    return [
      { email: `${first}@${domain}`, confidence: 60 },
      { email: `${first}.contact@${domain}`, confidence: 40 },
      { email: `info@${domain}`, confidence: 30 }
    ];
  }
  
  // Common email patterns (ordered by likelihood)
  return [
    { email: `${first}.${last}@${domain}`, confidence: 85 },
    { email: `${first}@${domain}`, confidence: 75 },
    { email: `${first}${last}@${domain}`, confidence: 70 },
    { email: `${first[0]}${last}@${domain}`, confidence: 65 },
    { email: `${first}_${last}@${domain}`, confidence: 60 },
    { email: `${last}@${domain}`, confidence: 55 }
  ];
};

// FREE ALTERNATIVE: Company data from domain guessing
export const guessCompanyFromDomain = (domain: string): CompanyInfo => {
  const name = domain.replace(/\.(com|co|org|net|io|ai)$/i, '').replace(/[^a-z]/gi, '');
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  return {
    name: capitalizedName,
    domain: domain,
    website: `https://${domain}`,
    description: `Company based on domain ${domain}`
  };
};

// Hunter.io domain search for company emails
export const hunterDomainSearch = async (domain: string): Promise<{emails: string[], company?: CompanyInfo}> => {
  if (!HUNTER_API_KEY) {
    console.warn('Hunter.io API key not configured');
    return { emails: [] };
  }

  try {
    const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${HUNTER_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Hunter.io domain search error: ${response.status}`);
    }

    const data = await response.json();
    
    const emails = data.data?.emails?.map((emailObj: any) => emailObj.value) || [];
    const company: CompanyInfo | undefined = data.data?.organization ? {
      name: data.data.organization,
      domain: data.data.domain,
      website: `https://${data.data.domain}`
    } : undefined;

    return { emails, company };
  } catch (error) {
    console.error('Hunter.io domain search failed:', error);
    return { emails: [] };
  }
};

// Email verification using Hunter.io
export const hunterVerifyEmail = async (email: string): Promise<{valid?: boolean, confidence?: number}> => {
  if (!HUNTER_API_KEY) {
    console.warn('Hunter.io API key not configured');
    return {};
  }

  try {
    const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${HUNTER_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Hunter.io verification error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      valid: data.data?.result === 'deliverable',
      confidence: data.data?.score || 0
    };
  } catch (error) {
    console.error('Hunter.io email verification failed:', error);
    return {};
  }
};

// Clearbit company enrichment (Step 2 preparation)
export const clearbitEnrichCompany = async (domain: string): Promise<CompanyInfo | null> => {
  if (!CLEARBIT_API_KEY) {
    console.warn('Clearbit API key not configured');
    return null;
  }

  try {
    const response = await fetch(`https://company.clearbit.com/v1/domains/find?name=${domain}`, {
      headers: {
        'Authorization': `Bearer ${CLEARBIT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Clearbit API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      name: data.name,
      domain: data.domain,
      industry: data.category?.industry,
      size: data.metrics?.employees,
      location: data.location,
      description: data.description,
      founded: data.foundedYear?.toString(),
      website: data.site?.url
    };
  } catch (error) {
    console.error('Clearbit enrichment failed:', error);
    return null;
  }
};

// Extract domain from company name or email
const extractDomain = (input: string): string | null => {
  // If it's an email, extract domain
  if (input.includes('@')) {
    return input.split('@')[1];
  }
  
  // If it's a company name, try to guess domain
  const cleaned = input.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  return `${cleaned}.com`;
};

// Extract name parts from prospect name
const extractNameParts = (fullName: string): {firstName: string, lastName?: string} => {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.length > 1 ? parts[parts.length - 1] : undefined
  };
};

// Main enrichment function for Step 1
export const enrichLead = async (lead: Lead): Promise<EnrichedLead> => {
  console.log(`Starting enrichment for lead: ${lead.prospectName}`);
  
  const enrichedLead: EnrichedLead = {
    ...lead,
    lastEnriched: new Date().toISOString()
  };

  try {
    // Extract domain from lead data
    let domain: string | null = null;
    
    // Try to extract domain from contact info or request summary
    const domainMatch = (lead.contactInfo + ' ' + lead.requestSummary).match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    if (domainMatch) {
      domain = domainMatch[1];
    } else {
      // Fallback: generate domain from company name mentioned in request
      const companyMatch = lead.requestSummary.match(/\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*)\b/);
      if (companyMatch) {
        domain = extractDomain(companyMatch[1]);
      }
    }

    if (domain) {
      console.log(`Found domain: ${domain}`);
      
      // Try Hunter.io first (if within free limits), then fall back to free alternatives
      const nameParts = extractNameParts(lead.prospectName);
      let emailFound = false;
      
      // Step 1: Try Hunter.io (FREE TIER: 25/month)
      if (hunterCallsThisMonth < MAX_HUNTER_FREE_CALLS && HUNTER_API_KEY) {
        const hunterResult = await hunterEnrichEmail(domain, nameParts.firstName, nameParts.lastName);
        
        if (hunterResult.email) {
          enrichedLead.verifiedEmail = hunterResult.email;
          enrichedLead.emailConfidence = hunterResult.confidence;
          emailFound = true;
          console.log(`Hunter.io found email: ${hunterResult.email} (confidence: ${hunterResult.confidence})`);
        }
      }
      
      // Step 2: FREE FALLBACK - Email pattern guessing
      if (!emailFound && nameParts.lastName) {
        const emailGuesses = guessEmailFromName(nameParts.firstName, nameParts.lastName, domain);
        if (emailGuesses.length > 0) {
          enrichedLead.verifiedEmail = emailGuesses[0].email; // Use highest confidence guess
          enrichedLead.emailConfidence = emailGuesses[0].confidence;
          console.log(`FREE: Guessed email: ${emailGuesses[0].email} (confidence: ${emailGuesses[0].confidence})`);
        }
      }

      // Step 3: Company data - try free approach first
      enrichedLead.companyData = guessCompanyFromDomain(domain);
      console.log(`FREE: Generated company data for ${domain}`);
      
      // Step 4: Try Hunter.io domain search if we have API calls left
      if (hunterCallsThisMonth < MAX_HUNTER_FREE_CALLS - 1 && HUNTER_API_KEY) { // Save 1 call buffer
        const domainResult = await hunterDomainSearch(domain);
        if (domainResult.company && domainResult.company.name) {
          // Only override if we get real company data
          enrichedLead.companyData = domainResult.company;
          console.log(`Hunter.io found company: ${domainResult.company.name}`);
        }
      }
    }

    // Add social profile guessing based on username
    const socialProfiles: SocialProfile[] = [];
    if (lead.username && lead.username !== '@unknown') {
      const cleanUsername = lead.username.replace('@', '');
      
      // Add likely social profiles
      socialProfiles.push(
        { platform: 'LinkedIn', url: `https://linkedin.com/in/${cleanUsername}` },
        { platform: 'Twitter', url: `https://twitter.com/${cleanUsername}` },
        { platform: 'GitHub', url: `https://github.com/${cleanUsername}` }
      );
    }

    if (socialProfiles.length > 0) {
      enrichedLead.socialProfiles = socialProfiles;
    }

    console.log(`Enrichment completed for ${lead.prospectName}`);
    return enrichedLead;
    
  } catch (error) {
    console.error('Lead enrichment failed:', error);
    return enrichedLead;
  }
};

// Batch enrichment for multiple leads
export const enrichLeads = async (leads: Lead[]): Promise<EnrichedLead[]> => {
  console.log(`Starting batch enrichment for ${leads.length} leads`);
  
  const enrichmentPromises = leads.map(lead => enrichLead(lead));
  
  try {
    const enrichedLeads = await Promise.all(enrichmentPromises);
    console.log(`Batch enrichment completed: ${enrichedLeads.length} leads processed`);
    return enrichedLeads;
  } catch (error) {
    console.error('Batch enrichment failed:', error);
    return leads.map(lead => ({ ...lead, lastEnriched: new Date().toISOString() }));
  }
};