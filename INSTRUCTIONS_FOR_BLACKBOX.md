# 🤖 Instructions pour BlackBox/Claude - Phase 2 de NafsAI

## 📋 Contexte du Projet

Vous allez créer des composants pour **NafsAI**, un assistant spirituel islamique avec une esthétique apaisante et une UX adaptée ADHD.

**Technologies utilisées :**
- React 18 + TypeScript
- Tailwind CSS (design system déjà configuré)
- Shadcn/ui components
- Supabase (backend déjà configuré)

**Design system (tokens à utiliser) :**
```tsx
// Couleurs principales
bg-primary text-primary-foreground  // Vert émeraude
bg-secondary text-secondary-foreground  // Or spirituel
bg-accent text-accent-foreground  // Bleu nuit
bg-muted text-muted-foreground  // Gris doux

// Gradients (background-image)
bg-gradient-spiritual  // Vert émeraude
bg-gradient-sunset  // Or → Orange
bg-gradient-night  // Bleu nuit profond

// Cartes
.spiritual-card  // Classe custom avec hover effect

// Émotions (pour badges)
.emotion-joy .emotion-sadness .emotion-anxiety 
.emotion-serenity .emotion-gratitude .emotion-anger .emotion-neutral
```

---

## 🎯 Composant 1 : Chat Interface Avancée

**Fichier :** `src/components/ChatInterface.tsx`

### Spécifications :
- **Interface moderne** avec bulles de messages (utilisateur à droite, assistant à gauche)
- **Textarea auto-resize** pour l'input utilisateur (max 5 lignes)
- **Bouton Envoyer** + raccourci `Enter` (Shift+Enter pour nouvelle ligne)
- **Loading state** avec animation de 3 points pulsants
- **Scroll automatique** vers le bas à chaque nouveau message
- **Détection d'émotions** : Badge coloré sous chaque message assistant

### Structure TypeScript :
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: 'joy' | 'sadness' | 'anxiety' | 'serenity' | 'gratitude' | 'anger' | 'neutral';
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}
```

### Contraintes UX (ADHD-friendly) :
- Boutons **larges** (min-h-12)
- Feedback visuel immédiat (states hover/active)
- Pas d'animations trop rapides (<300ms)
- Espaces généreux (gap-4 minimum)

---

## 🎯 Composant 2 : Journal Entry

**Fichier :** `src/components/JournalEntry.tsx`

### Spécifications :
- **Formulaire d'entrée** :
  - Titre (optionnel, Input)
  - Contenu (Textarea, min 3 lignes, max 20)
  - Humeur (Select avec icônes : 😊 Joie, 😢 Tristesse, 😰 Anxiété, 😌 Sérénité, 🙏 Gratitude, 😠 Colère, 😐 Neutre)
  - Tags (Input avec séparateur virgule)
  - Bouton "Enregistrer l'entrée"
- **Liste des entrées** :
  - Tri par date (récentes en premier)
  - Card pour chaque entrée avec : date, titre, extrait (100 char max), badge humeur
  - Actions : Modifier (ouvre modal), Supprimer (confirmation)
- **Compteur de mots** en temps réel

### Structure TypeScript :
```typescript
interface JournalEntry {
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
```

---

## 🎯 Composant 3 : Liste Dhikrs Enrichie

**Fichier :** `src/components/DhikrList.tsx`

### Spécifications :
- **Card pour chaque dhikr** :
  - Arabe (grand, police serif si possible)
  - Translittération (italique)
  - Traduction française (muted)
  - Compteur de répétitions (0 par défaut)
  - Bouton "+" qui incrémente + vibre (si disponible via `navigator.vibrate(50)`)
  - Animation bounce au clic
- **Dhikrs à inclure** (minimum 20, voici 10 exemples) :
  1. سُبْحَانَ اللهِ (Subhanallah) - Gloire à Allah
  2. الْحَمْدُ لِلَّهِ (Alhamdulillah) - Louange à Allah
  3. اللَّهُ أَكْبَرُ (Allahu Akbar) - Allah est le Plus Grand
  4. لَا إِلَهَ إِلَّا اللَّهُ (La ilaha illallah) - Il n'y a de dieu qu'Allah
  5. أَسْتَغْفِرُ اللهَ (Astaghfirullah) - Je demande pardon à Allah
  6. لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ (La hawla wa la quwwata illa billah)
  7. حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ (Hasbunallah wa ni'mal wakeel)
  8. إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ (Inna lillahi wa inna ilayhi raji'un)
  9. بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ (Bismillah ar-Rahman ar-Rahim)
  10. سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (Subhanallahi wa bihamdihi)

### Structure TypeScript :
```typescript
interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
}

interface DhikrListProps {
  dhikrs: Dhikr[];
  onIncrement: (id: string) => void;
}
```

---

## 🎯 Composant 4 : Détection Émotions (Logique)

**Fichier :** `src/lib/emotionDetection.ts`

### Spécifications :
- **Fonction pure** qui analyse du texte et retourne une émotion
- **Algorithme simple** basé sur mots-clés français/arabe :
  - Joie : "heureux", "hamdulillah", "alhamdulillah", "bien", "content"
  - Tristesse : "triste", "mal", "déprimé", "fatigué"
  - Anxiété : "stress", "peur", "inquiet", "angoisse"
  - Sérénité : "calme", "paix", "apaisé", "serein", "zen"
  - Gratitude : "merci", "reconnaissance", "alhamdulillah", "choukran"
  - Colère : "colère", "énervé", "frustré"
  - Neutre : par défaut si aucun match
- **Score de confiance** (0-1) basé sur fréquence des mots-clés

### Structure TypeScript :
```typescript
interface EmotionResult {
  emotion: 'joy' | 'sadness' | 'anxiety' | 'serenity' | 'gratitude' | 'anger' | 'neutral';
  confidence: number; // 0-1
  color: string; // Classe Tailwind (ex: 'emotion-joy')
}

export function detectEmotion(text: string): EmotionResult;
```

---

## 🎯 Composant 5 : Composants UI Supplémentaires

**Fichiers :**
- `src/components/StatCard.tsx`
- `src/components/EmotionBadge.tsx`
- `src/components/LoadingSpinner.tsx`
- `src/components/EmptyState.tsx`

### StatCard :
```typescript
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
  color?: 'spiritual' | 'sunset' | 'night';
}
```
- Card avec gradient background selon `color`
- Icône large en haut
- Value en gros (text-3xl)
- Label en dessous (text-sm muted)

### EmotionBadge :
```typescript
interface EmotionBadgeProps {
  emotion: 'joy' | 'sadness' | 'anxiety' | 'serenity' | 'gratitude' | 'anger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}
```
- Badge coloré avec classe `.emotion-{emotion}`
- Taille adaptable (px-2 py-1 pour sm, px-3 py-1.5 pour md, etc.)

### LoadingSpinner :
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}
```
- 🌙 emoji en rotation (animate-spin) OU spinner traditionnel
- Texte optionnel en dessous

### EmptyState :
```typescript
interface EmptyStateProps {
  icon: string; // Emoji
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```
- Design minimaliste pour listes vides
- Icône emoji grande (text-6xl)
- Titre + description centrés
- Bouton d'action optionnel

---

## 📦 Livrable Attendu

Pour chaque composant, fournissez :
1. **Code TypeScript complet** avec imports
2. **Respect strict du design system** (pas de couleurs hardcodées !)
3. **Props typées** avec interfaces claires
4. **Commentaires** pour logique complexe
5. **Accessibilité** (aria-labels, keyboard navigation)

---

## 🚨 Contraintes Critiques

❌ **PAS DE :**
- `text-white`, `bg-white`, `text-black` → Utiliser tokens
- Animations > 300ms (ADHD)
- Appels API directs (sera géré Phase 3)
- Couleurs RGB/HEX (uniquement tokens HSL)

✅ **OUI À :**
- Classes Tailwind du design system
- Composants shadcn/ui (Button, Input, Card, Select, etc.)
- TypeScript strict
- États de loading/error

---

## 💡 Exemple d'Usage des Tokens

```tsx
// ❌ Mauvais
<div className="bg-green-500 text-white">

// ✅ Bon
<div className="bg-primary text-primary-foreground">

// ❌ Mauvais
<Card className="shadow-lg">

// ✅ Bon
<Card className="spiritual-card">
```

---

## 🎓 Ressources

- **Shadcn/ui docs** : https://ui.shadcn.com/
- **Tailwind docs** : https://tailwindcss.com/docs
- **Projet complet** : Disponible sur GitHub (demander lien si besoin)

---

**Questions ?** Demandez des clarifications AVANT de coder ! 🚀
