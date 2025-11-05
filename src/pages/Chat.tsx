import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ChatInterface, Message } from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { detectEmotion } from "@/lib/emotionDetection";
import { toast } from "sonner";

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit atteinte. Réessaie dans quelques instants insha'Allah 🌙");
          return;
        }
        if (response.status === 402) {
          toast.error("Crédits AI insuffisants. Contacte le support.");
          return;
        }
        throw new Error(`Erreur ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantContent = "";
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Ignorer les lignes invalides
            }
          }
        }
      }

      // Détecter l'émotion du message complet
      const emotion = detectEmotion(assistantContent);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, emotion: emotion.emotion }
            : msg
        )
      );

    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <main className="flex-1 container mx-auto px-6 py-6 flex flex-col">
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
