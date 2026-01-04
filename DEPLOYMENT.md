# SIGNAL Deployment Guide

## 🚨 Required Environment Variables

Your SIGNAL platform needs these environment variables to work:

### 1. Gemini AI API Key (Required)
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
**Get your key:** https://aistudio.google.com/app/apikey

### 2. Stripe Keys (Optional - for payments)
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🔧 Local Development Setup

1. **Copy environment variables:**
```bash
cp .env.example .env.local
```

2. **Add your Gemini API key to `.env.local`:**
```bash
VITE_GEMINI_API_KEY=your_actual_key_here
```

3. **Start development server:**
```bash
npm run dev
```

## ☁️ Vercel Deployment Setup

### Add Environment Variables in Vercel:

1. Go to your **Vercel Dashboard**
2. Select your **New-Gen project**  
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Production, Preview, Development |

### Redeploy After Adding Variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Your app should now work properly!

## 🎯 Expected Behavior After Setup:

✅ **Working:** Neural landing page with full dashboard  
✅ **Working:** AI-powered opportunity and lead discovery  
✅ **Working:** Authentication and user profiles  
✅ **Working:** Lead tracking and credit system  

❌ **Error:** "An API Key must be set when running in a browser" → Add `VITE_GEMINI_API_KEY`

## 🚀 Your SIGNAL Platform Features:

- **Neural Discovery Protocol** with animated AI scanning
- **Opportunity Mode**: Find market gaps using AI analysis  
- **Lead Mode**: Discover active clients and prospects
- **Credit System**: 10 free searches, unlimited for Pro users
- **Lead Tracker**: CRM-like lead management
- **Glassmorphism UI**: Professional neural/cybernetic design

Once environment variables are set, your SIGNAL platform will be fully functional! 🧠⚡