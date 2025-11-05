import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/ui/StatCard";

export default function Stats() {
  const navigate = useNavigate();
  const [streaks, setStreaks] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setStreaks(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">📊</div>
            <h1 className="text-2xl font-bold">Statistiques</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Flame className="w-6 h-6 text-spiritual-secondary" />
            Tes Streaks
          </h2>

          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard
                icon="📔"
                label="Streak Journal"
                value={streaks?.journal_streak || 0}
                subtitle={`Record: ${streaks?.journal_best || 0} jours`}
                color="spiritual"
              />
              <StatCard
                icon="⏱"
                label="Streak Focus"
                value={streaks?.focus_streak || 0}
                subtitle={`Record: ${streaks?.focus_best || 0} sessions`}
                color="sunset"
              />
              <StatCard
                icon="📿"
                label="Streak Dhikr"
                value={streaks?.dhikr_streak || 0}
                subtitle={`Record: ${streaks?.dhikr_best || 0} jours`}
                color="night"
              />
            </div>
          )}

          <div className="spiritual-card p-8 text-center">
            <div className="text-4xl mb-4">🌙</div>
            <h3 className="text-xl font-bold mb-2">Continue comme ça !</h3>
            <p className="text-muted-foreground">
              La constance est la clé du succès. Chaque jour compte insha'Allah.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
