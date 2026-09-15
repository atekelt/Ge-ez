import React, { useState, useEffect } from 'react';
import { GameLevel, UserProgress } from './types';
import { AndroidFrame } from './components/AndroidFrame';
import { LevelOneMatch } from './components/LevelOneMatch';
import { LevelTwoCombine } from './components/LevelTwoCombine';
import { NoZeroDiscovery } from './components/NoZeroDiscovery';
import { NumeralChart } from './components/NumeralChart';
import { ParentModeModal } from './components/ParentModeModal';
import { soundManager } from './utils/audio';

const STORAGE_KEY = 'geez_numeral_match_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  level1Played: 5,
  level1Correct: 5,
  level2Played: 3,
  level2Correct: 3,
  streakDays: 4,
  streakFreezeActive: true,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  masteredSymbols: ['፩', '፪', '፫', '፬', '፭'],
  starsTotal: 12,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<GameLevel>('level1');
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const handleLevel1Complete = (correctCount: number, totalCount: number) => {
    setProgress(prev => ({
      ...prev,
      level1Played: prev.level1Played + totalCount,
      level1Correct: prev.level1Correct + correctCount,
      starsTotal: prev.starsTotal + correctCount,
    }));
  };

  const handleLevel2Complete = (correctCount: number, totalCount: number) => {
    setProgress(prev => ({
      ...prev,
      level2Played: prev.level2Played + totalCount,
      level2Correct: prev.level2Correct + correctCount,
      starsTotal: prev.starsTotal + (correctCount * 2),
    }));
  };

  const handleAwardStar = () => {
    setProgress(prev => ({
      ...prev,
      starsTotal: prev.starsTotal + 1,
    }));
  };

  const handleResetProgress = () => {
    setProgress({
      level1Played: 0,
      level1Correct: 0,
      level2Played: 0,
      level2Correct: 0,
      streakDays: 1,
      streakFreezeActive: false,
      lastPlayedDate: new Date().toISOString().split('T')[0],
      masteredSymbols: [],
      starsTotal: 0,
    });
  };

  const handleToggleStreakFreeze = () => {
    soundManager.playTap();
    setProgress(prev => ({
      ...prev,
      streakFreezeActive: !prev.streakFreezeActive,
    }));
  };

  const navItems = [
    {
      id: 'level1' as GameLevel,
      label: 'Level 1',
      sub: 'Units',
      geezIcon: '፩',
    },
    {
      id: 'level2' as GameLevel,
      label: 'Level 2',
      sub: 'Combine',
      geezIcon: '፳፫',
    },
    {
      id: 'no-zero' as GameLevel,
      label: 'No Zero',
      sub: 'Mystery',
      geezIcon: '0?',
    },
    {
      id: 'chart' as GameLevel,
      label: 'Chart',
      sub: '1–100',
      geezIcon: '፻',
    },
  ];

  return (
    <AndroidFrame
      activeLevelTitle={
        currentTab === 'level1'
          ? "Level 1 · Single Digits"
          : currentTab === 'level2'
          ? "Level 2 · Additive Combine"
          : currentTab === 'no-zero'
          ? "The Zero Discovery"
          : "Numeral Reference"
      }
      onOpenParentMode={() => {
        soundManager.playTap();
        setIsParentModalOpen(true);
      }}
      starsTotal={progress.starsTotal}
      streakDays={progress.streakDays}
    >
      {/* Screen Body */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {currentTab === 'level1' && (
          <LevelOneMatch
            onRoundComplete={handleLevel1Complete}
            onGoToLevel2={() => {
              soundManager.playTap();
              setCurrentTab('level2');
            }}
          />
        )}

        {currentTab === 'level2' && (
          <LevelTwoCombine
            onRoundComplete={handleLevel2Complete}
            onGoToNoZero={() => {
              soundManager.playTap();
              setCurrentTab('no-zero');
            }}
          />
        )}

        {currentTab === 'no-zero' && (
          <NoZeroDiscovery
            onGoToChart={() => {
              soundManager.playTap();
              setCurrentTab('chart');
            }}
            onAwardStar={handleAwardStar}
          />
        )}

        {currentTab === 'chart' && <NumeralChart />}
      </div>

      {/* Responsive Bottom Navigation Tabs */}
      <nav className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#DDD3C2] px-2 sm:px-4 md:px-6 py-1 sm:py-2 flex items-center justify-around shrink-0 shadow-sm">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playTap();
                setCurrentTab(item.id);
              }}
              className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-2.5 min-h-[50px] sm:min-h-[58px] rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E7EEE1] text-[#1E4A20] font-bold shadow-xs'
                  : 'text-[#6B6459] hover:bg-[#FAF6EF]'
              }`}
            >
              <span
                className={`font-ethiopic text-lg sm:text-2xl font-bold leading-none mb-0.5 ${
                  isActive ? 'text-[#2D6A2F] scale-110' : 'text-[#6B6459]'
                }`}
              >
                {item.geezIcon}
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-bold leading-tight font-display">
                {item.label}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#6B6459] font-mono-custom leading-none mt-0.5">
                {item.sub}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Parent Mode Modal */}
      <ParentModeModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        progress={progress}
        onResetProgress={handleResetProgress}
        onToggleStreakFreeze={handleToggleStreakFreeze}
      />
    </AndroidFrame>
  );
}
