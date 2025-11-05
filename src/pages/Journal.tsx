import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { JournalEntryComponent, JournalEntry } from "@/components/JournalEntry";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Journal() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error loading entries:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("journals")
        .insert({
          user_id: user.id,
          ...entry,
        } as any);

      if (error) throw error;
      toast.success("Entrée ajoutée 📝");
      loadEntries();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      const { error } = await supabase
        .from("journals")
        .update(updates as any)
        .eq("id", id);

      if (error) throw error;
      toast.success("Entrée modifiée ✏️");
      loadEntries();
    } catch (error) {
      console.error("Error editing entry:", error);
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("journals")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Entrée supprimée 🗑️");
      loadEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Erreur lors de la suppression");
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
            <div className="text-2xl">📔</div>
            <h1 className="text-2xl font-bold">Journal Spirituel</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <JournalEntryComponent 
              entries={entries}
              onSave={handleSave}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
