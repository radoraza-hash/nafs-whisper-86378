import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// TODO: Implement Pomodoro timer with BlackBox/Claude
// See INSTRUCTIONS_FOR_BLACKBOX.md for detailed specs

export default function Focus() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">⏱</div>
            <h1 className="text-2xl font-bold">Mode Focus</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="spiritual-card p-12 text-center">
            <div className="text-6xl mb-6">🧘‍♂️</div>
            <h2 className="text-2xl font-bold mb-4">Pomodoro Spirituel</h2>
            <p className="text-muted-foreground mb-6">
              Le timer Pomodoro avec dhikr sera implémenté avec BlackBox/Claude.
            </p>
            <p className="text-sm text-muted-foreground">
              Fonctionnalités à venir : Timer 25min, breaks, dhikr entre sessions, stats focus.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
