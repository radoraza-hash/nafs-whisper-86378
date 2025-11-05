import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Focus, MessageCircle, Heart, BarChart3, Settings } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie. À bientôt 🌙");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spiritual-pulse text-4xl">🌙</div>
      </div>
    );
  }

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Journal",
      description: "Écris tes réflexions quotidiennes",
      path: "/journal",
      color: "bg-gradient-spiritual",
    },
    {
      icon: <Focus className="w-8 h-8" />,
      title: "Focus",
      description: "Pomodoro avec dhikr",
      path: "/focus",
      color: "bg-gradient-sunset",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Chat NafsAI",
      description: "Parle à ton assistant spirituel",
      path: "/chat",
      color: "bg-gradient-night",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Émotions",
      description: "Suivi de ton état émotionnel",
      path: "/emotions",
      color: "bg-gradient-spiritual",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Statistiques",
      description: "Tes progrès et streaks",
      path: "/stats",
      color: "bg-gradient-sunset",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Paramètres",
      description: "Configure ton expérience",
      path: "/settings",
      color: "bg-gradient-night",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌙</div>
            <h1 className="text-2xl font-bold">NafsAI</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">
            Salam {user?.user_metadata?.display_name || "Ami"} 👋
          </h2>
          <p className="text-muted-foreground">Comment te sens-tu aujourd'hui ?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.path}
              className="spiritual-card cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
