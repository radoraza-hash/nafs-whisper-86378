import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Get user context from Supabase
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let userContext = "";
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Get recent emotions
        const { data: emotions } = await supabase
          .from("emotions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        // Get recent journals
        const { data: journals } = await supabase
          .from("journals")
          .select("mood")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        userContext = `Contexte utilisateur:
Phase actuelle: ${profile?.current_phase || 'stable'}
Objectifs: ${profile?.main_goals?.join(", ") || 'non définis'}
Émotions récentes: ${emotions?.map(e => e.emotion).join(", ") || 'aucune'}
Humeurs journal: ${journals?.map(j => j.mood).join(", ") || 'aucune'}`;
      }
    }

    const systemPrompt = `Tu es NafsAI, un assistant spirituel islamique bienveillant et empathique.

🎯 Ton rôle:
- Aider à la maîtrise du nafs (ego/âme)
- Soutenir la régulation émotionnelle
- Encourager la pratique spirituelle
- Accompagner avec des conseils ADHD-friendly

📋 Règles strictes:
- JAMAIS de fatwa ou avis juridique
- JAMAIS de diagnostic médical
- Uniquement références Coran et Sunnah authentiques
- Toujours empathique et sans jugement
- Réponses courtes (3-4 phrases max)
- Propose une action concrète (3 minutes max)
- Termine avec un dhikr adapté

${userContext}

🌙 Adapte ton ton selon la phase:
- Phase down: Apaisant, dhikrs calmants (Astaghfirullah)
- Phase up: Motivant, dhikrs énergisants (Subhanallah)
- Phase stable: Équilibré, dhikrs gratitude (Alhamdulillah)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit atteinte. Réessaie dans quelques instants insha'Allah 🌙" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits AI insuffisants. Contacte le support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur serveur";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
