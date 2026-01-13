<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18Iwuus9hGpoRSw9RNoyaJwy9qYArlBQb

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the project root with:
   ```env
   # REQUIRED: Get your Gemini API key from https://aistudio.google.com/app/apikey
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here

   # OPTIONAL: For Pro upgrade payments (get from Stripe Dashboard)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

   # OPTIONAL: Enhanced features
   VITE_HUNTER_API_KEY=your_hunter_api_key_here
   VITE_CLEARBIT_API_KEY=your_clearbit_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

**Note:** Without `VITE_GEMINI_API_KEY`, the app will show an error when trying to analyze queries. The basic UI will still work for testing.
