import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EmotionBadge } from "@/components/ui/EmotionBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  body: string;
  mood?: 'joy' | 'sadness' | 'anxiety' | 'serenity' | 'gratitude' | 'anger' | 'neutral';
  tags?: string[];
  created_at: Date;
}

interface JournalEntryProps {
  entries: JournalEntry[];
  onSave: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => void;
  onEdit: (id: string, updates: Partial<JournalEntry>) => void;
  onDelete: (id: string) => void;
}

const moods = [
  { value: 'joy', label: '😊 Joie', icon: '😊' },
  { value: 'sadness', label: '😢 Tristesse', icon: '😢' },
  { value: 'anxiety', label: '😰 Anxiété', icon: '😰' },
  { value: 'serenity', label: '😌 Sérénité', icon: '😌' },
  { value: 'gratitude', label: '🙏 Gratitude', icon: '🙏' },
  { value: 'anger', label: '😠 Colère', icon: '😠' },
  { value: 'neutral', label: '😐 Neutre', icon: '😐' }
];

export function JournalEntryComponent({ entries, onSave, onEdit, onDelete }: JournalEntryProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<string>('');
  const [tags, setTags] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryData = {
      title: title.trim() || undefined,
      body: body.trim(),
      mood: mood as JournalEntry['mood'] || undefined,
      tags: tags.trim() ? tags.split(',').map(t => t.trim()) : undefined
    };

    if (editingEntry) {
      onEdit(editingEntry.id, entryData);
    } else {
      onSave(entryData);
    }

    // Reset form
    setTitle('');
    setBody('');
    setMood('');
    setTags('');
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title || '');
    setBody(entry.body);
    setMood(entry.mood || '');
    setTags(entry.tags?.join(', ') || '');
    setIsDialogOpen(true);
  };

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Formulaire */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre (optionnel)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Une belle journée"
              className="mt-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="body">Contenu</Label>
              <span className="text-xs text-muted-foreground">
                {wordCount} mot{wordCount !== 1 ? 's' : ''}
              </span>
            </div>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Qu'est-ce qui s'est passé aujourd'hui ? Comment te sens-tu ?"
              className="min-h-32 max-h-96"
              required
            />
          </div>

          <div>
            <Label htmlFor="mood">Humeur</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Comment te sens-tu ?" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: spiritualité, famille, travail"
              className="mt-1.5"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={!body.trim()}>
            {editingEntry ? 'Modifier l\'entrée' : 'Enregistrer l\'entrée'}
          </Button>
        </form>
      </Card>

      {/* Liste des entrées */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tes entrées ({entries.length})</h2>
        
        {sortedEntries.length === 0 ? (
          <EmptyState
            icon="📔"
            title="Aucune entrée pour l'instant"
            description="Commence à écrire dans ton journal pour suivre ton cheminement spirituel."
          />
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), 'EEEE d MMMM yyyy, HH:mm', { locale: fr })}
                      </span>
                    </div>
                    
                    {entry.title && (
                      <h3 className="font-semibold mb-2">{entry.title}</h3>
                    )}
                    
                    <p className="text-muted-foreground line-clamp-3">
                      {entry.body.substring(0, 150)}
                      {entry.body.length > 150 && '...'}
                    </p>
                    
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {entry.mood && <EmotionBadge emotion={entry.mood} size="sm" />}
                      {entry.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-muted text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Dialog open={isDialogOpen && editingEntry?.id === entry.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (!open) {
                        setEditingEntry(null);
                        setTitle('');
                        setBody('');
                        setMood('');
                        setTags('');
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Modifier l'entrée</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="edit-title">Titre (optionnel)</Label>
                            <Input
                              id="edit-title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="mt-1.5"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <Label htmlFor="edit-body">Contenu</Label>
                              <span className="text-xs text-muted-foreground">
                                {wordCount} mot{wordCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <Textarea
                              id="edit-body"
                              value={body}
                              onChange={(e) => setBody(e.target.value)}
                              className="min-h-32 max-h-64"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="edit-mood">Humeur</Label>
                            <Select value={mood} onValueChange={setMood}>
                              <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder="Comment te sens-tu ?" />
                              </SelectTrigger>
                              <SelectContent>
                                {moods.map((m) => (
                                  <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="edit-tags">Tags</Label>
                            <Input
                              id="edit-tags"
                              value={tags}
                              onChange={(e) => setTags(e.target.value)}
                              className="mt-1.5"
                            />
                          </div>

                          <Button type="submit" size="lg" className="w-full">
                            Enregistrer les modifications
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette entrée ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. L'entrée sera définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(entry.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
