import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DhikrList, Dhikr } from "@/components/DhikrList";

const initialDhikrs: Dhikr[] = [
  {
    id: "1",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "Subhanallah",
    translation: "Gloire à Allah",
    count: 0,
  },
  {
    id: "2",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    translation: "Louange à Allah",
    count: 0,
  },
  {
    id: "3",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah est le Plus Grand",
    count: 0,
  },
  {
    id: "4",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illallah",
    translation: "Il n'y a de divinité qu'Allah",
    count: 0,
  },
  {
    id: "5",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    translation: "Je demande pardon à Allah",
    count: 0,
  },
  {
    id: "6",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "Il n'y a de force ni de puissance qu'en Allah",
    count: 0,
  },
];

export default function Focus() {
  const navigate = useNavigate();
  const [dhikrs, setDhikrs] = useState(initialDhikrs);

  const handleIncrement = (id: string) => {
    setDhikrs(prev => 
      prev.map(dhikr => 
        dhikr.id === id 
          ? { ...dhikr, count: dhikr.count + 1 }
          : dhikr
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">⏱</div>
            <h1 className="text-2xl font-bold">Mode Focus & Dhikr</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Compteur de Dhikr</h2>
            <p className="text-muted-foreground">
              Clique pour compter tes invocations 📿
            </p>
          </div>
          <DhikrList dhikrs={dhikrs} onIncrement={handleIncrement} />
        </div>
      </main>
    </div>
  );
}
