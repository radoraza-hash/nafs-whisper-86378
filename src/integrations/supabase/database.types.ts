// Types personnalisés pour éviter les erreurs TypeScript avec Supabase
export interface Database {
  public: {
    Tables: {
      journals: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          body: string;
          mood: string | null;
          tags: string[] | null;
          audio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          body: string;
          mood?: string | null;
          tags?: string[] | null;
          audio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          body?: string;
          mood?: string | null;
          tags?: string[] | null;
          audio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      emotions: {
        Row: {
          id: string;
          user_id: string;
          emotion: string;
          intensity: number | null;
          pattern: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          emotion: string;
          intensity?: number | null;
          pattern?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          emotion?: string;
          intensity?: number | null;
          pattern?: string | null;
          note?: string | null;
          created_at?: string;
        };
      };
      user_streaks: {
        Row: {
          user_id: string;
          journal_streak: number;
          journal_best: number;
          focus_streak: number;
          focus_best: number;
          dhikr_streak: number;
          dhikr_best: number;
          last_journal_date: string | null;
          last_focus_date: string | null;
          last_dhikr_date: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          journal_streak?: number;
          journal_best?: number;
          focus_streak?: number;
          focus_best?: number;
          dhikr_streak?: number;
          dhikr_best?: number;
          last_journal_date?: string | null;
          last_focus_date?: string | null;
          last_dhikr_date?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          journal_streak?: number;
          journal_best?: number;
          focus_streak?: number;
          focus_best?: number;
          dhikr_streak?: number;
          dhikr_best?: number;
          last_journal_date?: string | null;
          last_focus_date?: string | null;
          last_dhikr_date?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
