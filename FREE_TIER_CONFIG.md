# 🆓 **Free Tier API Configuration for SIGNAL**

## **Current Free API Limits**

### **🎯 Hunter.io (Email Discovery)**
- **Free Tier**: 25 searches/month + 50 verifications/month
- **Signup**: https://hunter.io/
- **API Key**: Add `VITE_HUNTER_API_KEY` to Vercel environment variables
- **Features**: Email finding, domain search, email verification
- **Upgrade**: $49/month for 1,000 searches

### **🏢 Clearbit (Company Data)**
- **Free Tier**: 50 lookups/month (if still available)
- **Signup**: https://clearbit.com/
- **API Key**: Add `VITE_CLEARBIT_API_KEY` to Vercel environment variables
- **Features**: Company enrichment, logo, social profiles
- **Note**: Clearbit was acquired by HubSpot - free tier may be limited

### **🆓 FREE Alternatives (No API Keys Needed)**
- **Email Pattern Guessing**: Uses common patterns (firstname.lastname@domain.com)
- **Company Data Generation**: Extracts company info from domain names
- **Social Profile Guessing**: LinkedIn, Twitter, GitHub profile URLs
- **Domain Extraction**: Smart domain detection from text

## **🔧 Setup Instructions**

### **1. Get Free API Keys**
```bash
# Hunter.io (FREE: 25 searches/month)
1. Go to https://hunter.io/users/sign_up
2. Verify email and get free API key
3. Add to Vercel: VITE_HUNTER_API_KEY=your_key_here

# Clearbit (if available)
1. Go to https://clearbit.com/
2. Sign up for free account
3. Add to Vercel: VITE_CLEARBIT_API_KEY=your_key_here
```

### **2. Vercel Environment Variables**
```
VITE_HUNTER_API_KEY=pk_your_hunter_key_here
VITE_CLEARBIT_API_KEY=sk_your_clearbit_key_here
```

### **3. Fallback Strategy**
- **Primary**: Use Hunter.io for high-confidence email discovery
- **Secondary**: Fall back to smart pattern guessing
- **Always**: Use free alternatives for company data and social profiles

## **📊 Usage Tracking**

SIGNAL automatically tracks API usage:
- Stores monthly call counts in localStorage
- Warns when approaching free tier limits  
- Automatically switches to free alternatives
- Resets counters monthly

## **💰 Cost Breakdown**

| Service | Free Tier | Cost to Scale | Alternative |
|---------|-----------|---------------|-------------|
| Hunter.io | 25/month | $49/month | Pattern guessing |
| Clearbit | 50/month | $3,600/year | Domain parsing |
| Social Profiles | ∞ | N/A | Smart URL guessing |
| Company Data | ∞ | N/A | Domain-based generation |

## **🚀 Scaling Path**

1. **Phase 1**: Use free tiers (current setup)
2. **Phase 2**: Upgrade Hunter.io ($49/month) for 1K searches
3. **Phase 3**: Add premium data providers (Clay, Apollo)
4. **Phase 4**: Custom web scraping + data warehouses

## **✅ Benefits of This Approach**

- **$0 cost** to start
- **Graceful degradation** when limits hit
- **High coverage** using intelligent fallbacks
- **Easy scaling** when ready to pay
- **Best user experience** (always returns some data)

This setup ensures SIGNAL provides valuable enrichment even with no budget, while positioning for easy upgrades as you grow!