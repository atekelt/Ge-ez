import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldCheck, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeLevelTitle?: string;
  onOpenParentMode: () => void;
  starsTotal: number;
  streakDays: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onOpenParentMode,
  starsTotal,
  streakDays,
}) => {
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setSoundEnabled(next);
    soundManager.setSpeechEnabled(next);
    if (next) soundManager.playTap();
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6EF] flex justify-center text-[#1A1A1A]">
      {/* Responsive Container: Fluid on small phones, optimally centered with wider boundaries on tablets and desktops */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl min-h-screen bg-[#FDF8F2] flex flex-col justify-between shadow-xl sm:border-x sm:border-[#DDD3C2] relative transition-all">
        {/* Sticky Top Header: responsive padding, font sizes, and button targets */}
        <header className="sticky top-0 z-30 bg-[#2D6A2F] text-white px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F4E4C1] text-[#2D6A2F] flex items-center justify-center font-ethiopic font-bold text-base sm:text-lg shadow-xs shrink-0 select-none">
              ፯
            </div>
            <div>
              <h1 className="font-display font-bold text-sm sm:text-base md:text-lg leading-tight text-white tracking-tight">
                Ge'ez Numeral Match
              </h1>
              <p className="text-[10px] sm:text-xs text-white/80 font-medium leading-none mt-0.5">
                Ages 6–8 · Additive Math
              </p>
            </div>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Streak Indicator */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 bg-black/20 backdrop-blur-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#FCD34D]"
              title={`${streakDays} Day Streak!`}
            >
              <span className="text-xs sm:text-base">🔥</span>
              <span className="font-mono-custom text-[11px] sm:text-xs">{streakDays}</span>
            </div>

            {/* Stars Tally */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 bg-[#F4E4C1] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#1E4A20] shadow-xs"
              title={`${starsTotal} Stars Earned!`}
            >
              <Award size={14} className="text-[#C8961E]" />
              <span className="font-mono-custom text-[11px] sm:text-xs">{starsTotal}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center"
              title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
              aria-label="Toggle Sound"
            >
              {soundOn ? <Volume2 size={16} className="sm:w-5 sm:h-5" /> : <VolumeX size={16} className="text-white/60 sm:w-5 sm:h-5" />}
            </button>

            {/* Parent Mode Entry */}
            <button
              onClick={onOpenParentMode}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[34px] sm:min-h-[38px]"
              title="Parent Mode & Learning Metrics"
              aria-label="Parent Mode"
            >
              <ShieldCheck size={14} className="text-[#F4E4C1] sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs font-bold">Parent</span>
            </button>
          </div>
        </header>

        {/* Inner App Content Scroll Area */}
        <main className="flex-1 flex flex-col relative overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

