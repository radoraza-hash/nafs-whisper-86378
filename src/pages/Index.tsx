import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-spiritual flex items-center justify-center p-6">
      <div className="max-w-4xl text-center animate-fade-in">
        <div className="text-7xl mb-6 animate-spiritual-pulse">🌙</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          NafsAI
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Ton assistant spirituel islamique et coach de bien-être pour une vie plus sereine
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/auth")}
          >
            Commencer gratuitement
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 text-white border-white hover:bg-white/10"
            onClick={() => navigate("/auth")}
          >
            J'ai déjà un compte
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="spiritual-card bg-white/10 backdrop-blur-sm p-6">
            <div className="text-4xl mb-3">📔</div>
            <h3 className="font-semibold text-lg mb-2">Journal Spirituel</h3>
            <p className="text-sm text-white/80">Réflexion guidée par IA</p>
          </div>
          <div className="spiritual-card bg-white/10 backdrop-blur-sm p-6">
            <div className="text-4xl mb-3">⏱</div>
            <h3 className="font-semibold text-lg mb-2">Focus avec Dhikr</h3>
            <p className="text-sm text-white/80">Pomodoro spirituel</p>
          </div>
          <div className="spiritual-card bg-white/10 backdrop-blur-sm p-6">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-lg mb-2">Coach IA</h3>
            <p className="text-sm text-white/80">Soutien bienveillant 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
