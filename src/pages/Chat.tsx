import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// TODO: Implement AI chat with BlackBox/Claude
// See INSTRUCTIONS_FOR_BLACKBOX.md for detailed specs
// Integration with Lovable AI will be done in Phase 3

export default function Chat() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">💬</div>
            <h1 className="text-2xl font-bold">Chat NafsAI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="spiritual-card p-12 text-center">
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-2xl font-bold mb-4">Chat Intelligent</h2>
            <p className="text-muted-foreground mb-6">
              L'interface de chat sera créée avec BlackBox/Claude (Phase 2).
            </p>
            <p className="text-sm text-muted-foreground">
              Fonctionnalités à venir : Bulles messages, détection émotions, streaming responses, historique.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
