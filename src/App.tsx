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
      {/* Top Banner with App Brand inside Phone Display */}
      <div className="bg-[#2D6A2F] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F4E4C1] text-[#2D6A2F] flex items-center justify-center font-ethiopic font-bold text-lg shadow-xs">
            ፯
          </div>
          <div>
            <h1 className="font-display font-bold text-sm leading-tight text-white">
              Ge'ez Numeral Match
            </h1>
            <p className="text-[10px] text-white/80 font-medium">
              Additive System · Ages 6–8
            </p>
          </div>
        </div>

        {/* Small badge */}
        <div className="bg-white/15 px-2 py-0.5 rounded-full text-[10px] font-mono-custom text-white font-semibold">
          Offline
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 flex flex-col overflow-hidden">
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

      {/* Android Bottom Navigation Tabs */}
      <nav className="bg-white border-t border-[#DDD3C2] px-2 py-1.5 flex items-center justify-around shrink-0 z-10 shadow-xs">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playTap();
                setCurrentTab(item.id);
              }}
              className={`flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E7EEE1] text-[#1E4A20]'
                  : 'text-[#6B6459] hover:bg-[#FAF6EF]'
              }`}
            >
              <span
                className={`font-ethiopic text-base font-bold leading-none mb-0.5 ${
                  isActive ? 'text-[#2D6A2F] scale-110' : 'text-[#6B6459]'
                }`}
              >
                {item.geezIcon}
              </span>
              <span className="text-[10px] font-bold leading-tight font-display">
                {item.label}
              </span>
              <span className="text-[9px] text-[#6B6459] font-mono-custom leading-none">
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
