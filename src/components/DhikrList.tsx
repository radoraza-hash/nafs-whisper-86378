import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Dhikr {
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

const vibrate = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

export function DhikrList({ dhikrs, onIncrement }: DhikrListProps) {
  const handleIncrement = (id: string) => {
    vibrate();
    onIncrement(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dhikrs.map((dhikr) => (
        <Card
          key={dhikr.id}
          className="p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="space-y-4">
            {/* Arabe */}
            <div className="text-center">
              <p className="text-3xl font-serif leading-relaxed" dir="rtl">
                {dhikr.arabic}
              </p>
            </div>

            {/* Translittération */}
            <div className="text-center">
              <p className="text-lg italic text-muted-foreground">
                {dhikr.transliteration}
              </p>
            </div>

            {/* Traduction */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {dhikr.translation}
              </p>
            </div>

            {/* Compteur + Bouton */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-primary">
                  {dhikr.count}
                </div>
                <div className="text-xs text-muted-foreground">
                  répétitions
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={() => handleIncrement(dhikr.id)}
                className={cn(
                  "min-h-16 min-w-16 rounded-full transition-all duration-200",
                  "active:scale-95 hover:scale-105"
                )}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Liste de dhikrs par défaut
export const defaultDhikrs: Omit<Dhikr, 'count'>[] = [
  {
    id: '1',
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'Subhanallah',
    translation: 'Gloire à Allah'
  },
  {
    id: '2',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Louange à Allah'
  },
  {
    id: '3',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah est le Plus Grand'
  },
  {
    id: '4',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    translation: 'Il n\'y a de dieu qu\'Allah'
  },
  {
    id: '5',
    arabic: 'أَسْتَغْفِرُ اللهَ',
    transliteration: 'Astaghfirullah',
    translation: 'Je demande pardon à Allah'
  },
  {
    id: '6',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: 'Il n\'y a de force ni de puissance qu\'en Allah'
  },
  {
    id: '7',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallah wa ni\'mal wakeel',
    translation: 'Allah nous suffit, Il est notre meilleur garant'
  },
  {
    id: '8',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    transliteration: 'Inna lillahi wa inna ilayhi raji\'un',
    translation: 'Nous appartenons à Allah et c\'est à Lui que nous retournons'
  },
  {
    id: '9',
    arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ',
    transliteration: 'Bismillah ar-Rahman ar-Rahim',
    translation: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux'
  },
  {
    id: '10',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi wa bihamdihi',
    translation: 'Gloire et louange à Allah'
  },
  {
    id: '11',
    arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subhanallahi al-Azim',
    translation: 'Gloire à Allah le Magnifique'
  },
  {
    id: '12',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli \'ala Muhammad',
    translation: 'Ô Allah, prie sur Mohammed'
  },
  {
    id: '13',
    arabic: 'رَبِّ اغْفِرْ لِي',
    transliteration: 'Rabbi ghfir li',
    translation: 'Mon Seigneur, pardonne-moi'
  },
  {
    id: '14',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
    translation: 'Il n\'y a de dieu que Toi, gloire à Toi, j\'étais parmi les injustes'
  },
  {
    id: '15',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
    transliteration: 'Ya Hayyu ya Qayyum bi-rahmatika astaghith',
    translation: 'Ô Vivant, Ô Subsistant, par Ta miséricorde j\'appelle au secours'
  },
  {
    id: '16',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
    transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanah',
    translation: 'Seigneur, accorde-nous le bien ici-bas et dans l\'au-delà'
  },
  {
    id: '17',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan',
    translation: 'Ô Allah, je cherche refuge auprès de Toi contre l\'anxiété et la tristesse'
  },
  {
    id: '18',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي',
    transliteration: 'Rabbi shrah li sadri',
    translation: 'Seigneur, ouvre-moi ma poitrine (facilite-moi les choses)'
  },
  {
    id: '19',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى',
    transliteration: 'Allahumma inni as\'alukal-huda wat-tuqa',
    translation: 'Ô Allah, je Te demande la guidance et la piété'
  },
  {
    id: '20',
    arabic: 'تَوَكَّلْتُ عَلَى اللَّهِ',
    transliteration: 'Tawakkaltu \'alallah',
    translation: 'Je m\'en remets à Allah'
  }
];
