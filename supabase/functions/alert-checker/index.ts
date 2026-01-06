import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const gemini = new GoogleGenerativeAI(Deno.env.get('GOOGLE_API_KEY') || '');
        const model = gemini.getGenerativeModel({ model: "gemini-pro" });

        // 1. Fetch active alerts
        const { data: alerts, error: alertsError } = await supabaseClient
            .from('alerts')
            .select('*, profiles(email, first_name)')

        if (alertsError) throw alertsError;

        console.log(`Processing ${alerts?.length || 0} alerts...`);

        const results = [];

        // 2. Process each alert
        for (const alert of alerts || []) {
            try {
                // Quick check with Gemini if there are new opportunities
                const prompt = `
          Act as a business intelligence analyst. 
          Analyze the current market for: "${alert.keyword}".
          
          Are there any significant NEW opportunities or shifting trends in the last 7 days?
          
          Return JSON:
          {
            "hasNewOpportunity": boolean,
            "summary": "Short summary of the opportunity if exists, else empty",
            "score": number (1-10)
          }
        `;

                const result = await model.generateContent(prompt);
                const text = result.response.text().replace(/```json|```/g, '').trim();
                const analysis = JSON.parse(text);

                if (analysis.hasNewOpportunity && analysis.score > 7) {
                    // 3. Send Notification (Mocking Email Service)
                    // In production: Use Resend or SendGrid here
                    console.log(`[EMAIL SENT] To: ${alert.profiles.email} | Subject: New Opportunity for "${alert.keyword}"`);

                    const { error: logError } = await supabaseClient
                        .from('alert_logs')
                        .insert({
                            alert_id: alert.id,
                            summary: analysis.summary,
                            score: analysis.score,
                            sent_at: new Date().toISOString()
                        });

                    results.push({
                        keyword: alert.keyword,
                        user: alert.profiles.email,
                        found: true
                    });
                } else {
                    results.push({
                        keyword: alert.keyword,
                        user: alert.profiles.email,
                        found: false
                    });
                }

                // Update last checked
                await supabaseClient
                    .from('alerts')
                    .update({ last_checked: new Date().toISOString() })
                    .eq('id', alert.id);

            } catch (err) {
                console.error(`Failed to process alert ${alert.id}:`, err);
            }
        }

        return new Response(
            JSON.stringify(results),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    }
})
