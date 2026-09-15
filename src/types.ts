export interface GeezNumeral {
  arabic: number;
  geez: string;
  amharicName: string;
  englishTranslit: string;
  type: 'unit' | 'ten' | 'hundred';
  description?: string;
}

export interface CompoundGeez {
  arabic: number;
  tens: number;
  units: number;
  tensGeez: string;
  unitsGeez: string;
  fullGeez: string;
  amharicName: string;
  englishTranslit: string;
}

export type GameLevel = 'level1' | 'level2' | 'no-zero' | 'chart';

export interface UserProgress {
  level1Played: number;
  level1Correct: number;
  level2Played: number;
  level2Correct: number;
  streakDays: number;
  streakFreezeActive: boolean;
  lastPlayedDate: string;
  masteredSymbols: string[]; // List of Geez symbols mastered
  starsTotal: number;
}
