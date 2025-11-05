import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// TODO: Implement emotion tracking with BlackBox/Claude
// See INSTRUCTIONS_FOR_BLACKBOX.md for detailed specs

export default function Emotions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">❤️</div>
            <h1 className="text-2xl font-bold">Suivi Émotionnel</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="spiritual-card p-12 text-center">
            <div className="text-6xl mb-6">😊</div>
            <h2 className="text-2xl font-bold mb-4">Tes Émotions</h2>
            <p className="text-muted-foreground mb-6">
              Le tracker d'émotions sera implémenté avec BlackBox/Claude.
            </p>
            <p className="text-sm text-muted-foreground">
              Fonctionnalités à venir : Graphiques émotionnels, patterns, journalier/hebdo, insights IA.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
