// Détection d'émotions basée sur mots-clés français/arabe
export interface EmotionResult {
  emotion: 'joy' | 'sadness' | 'anxiety' | 'serenity' | 'gratitude' | 'anger' | 'neutral';
  confidence: number; // 0-1
  color: string; // Classe Tailwind
}

const emotionKeywords = {
  joy: [
    'heureux', 'heureuse', 'joie', 'content', 'contente', 'bien', 'super', 
    'génial', 'hamdulillah', 'alhamdulillah', 'الحمد لله', 'sourire', 'ravi'
  ],
  sadness: [
    'triste', 'tristesse', 'mal', 'déprimé', 'déprimée', 'fatigué', 'fatiguée',
    'pleure', 'pleurer', 'seul', 'seule', 'vide', 'perdu', 'perdue'
  ],
  anxiety: [
    'stress', 'stressé', 'stressée', 'peur', 'inquiet', 'inquiète', 'angoisse',
    'anxieux', 'anxieuse', 'panique', 'nerveux', 'nerveuse', 'tension'
  ],
  serenity: [
    'calme', 'paix', 'apaisé', 'apaisée', 'serein', 'sereine', 'zen',
    'tranquille', 'salam', 'السلام', 'repos', 'sérénité'
  ],
  gratitude: [
    'merci', 'reconnaissance', 'reconnaissant', 'reconnaissante', 'gratitude',
    'alhamdulillah', 'choukran', 'شكرا', 'béni', 'bénie', 'grateful'
  ],
  anger: [
    'colère', 'énervé', 'énervée', 'frustré', 'frustrée', 'furieux', 'furieuse',
    'rage', 'irrité', 'irritée', 'fâché', 'fâchée'
  ]
};

export function detectEmotion(text: string): EmotionResult {
  if (!text || text.trim().length === 0) {
    return {
      emotion: 'neutral',
      confidence: 1,
      color: 'emotion-neutral'
    };
  }

  const lowerText = text.toLowerCase();
  const scores: Record<string, number> = {
    joy: 0,
    sadness: 0,
    anxiety: 0,
    serenity: 0,
    gratitude: 0,
    anger: 0
  };

  // Compter les occurrences de mots-clés
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        scores[emotion] += matches.length;
      }
    });
  });

  // Trouver l'émotion dominante
  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore === 0) {
    return {
      emotion: 'neutral',
      confidence: 0.5,
      color: 'emotion-neutral'
    };
  }

  const dominantEmotion = Object.entries(scores)
    .find(([_, score]) => score === maxScore)?.[0] as EmotionResult['emotion'];

  // Calculer confiance (normalisée par rapport au nombre de mots)
  const wordCount = text.split(/\s+/).length;
  const confidence = Math.min(maxScore / Math.max(wordCount * 0.3, 1), 1);

  return {
    emotion: dominantEmotion,
    confidence,
    color: `emotion-${dominantEmotion}`
  };
}
