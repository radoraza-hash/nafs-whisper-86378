import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EmotionBadge } from "@/components/ui/EmotionBadge";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Emotions() {
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("emotions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmotions(data || []);
    } catch (error) {
      console.error("Error loading emotions:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-2xl">❤️</div>
              <h1 className="text-2xl font-bold">Suivi Émotionnel</h1>
            </div>
          </div>
          <Button onClick={() => navigate("/dashboard")}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : emotions.length === 0 ? (
            <div className="spiritual-card p-12 text-center">
              <div className="text-6xl mb-4">😊</div>
              <h2 className="text-xl font-bold mb-2">Commence ton suivi</h2>
              <p className="text-muted-foreground">
                Enregistre tes émotions quotidiennes pour mieux te comprendre
              </p>
            </div>
          ) : (
            emotions.map((emotion) => (
              <div key={emotion.id} className="spiritual-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <EmotionBadge emotion={emotion.emotion} />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(emotion.created_at), "PPP", { locale: fr })}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Intensité:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 rounded-full ${
                            i < emotion.intensity ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {emotion.note && (
                    <p className="text-sm">{emotion.note}</p>
                  )}
                  {emotion.pattern && (
                    <p className="text-xs text-muted-foreground">Pattern: {emotion.pattern}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
