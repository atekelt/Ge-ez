import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, ShieldCheck, Award } from 'lucide-react';
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
  activeLevelTitle = "Ge'ez Numeral Match",
  onOpenParentMode,
  starsTotal,
  streakDays,
}) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [soundOn, setSoundOn] = useState(true);

  // Update digital clock in status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setSoundEnabled(next);
    soundManager.setSpeechEnabled(next);
    if (next) soundManager.playTap();
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex flex-col items-center justify-start sm:p-4 text-[#1A1A1A]">
      {/* Top Utility Control Bar */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between px-4 py-2.5 mb-2 sm:mb-3 bg-white/80 backdrop-blur-md rounded-2xl border border-[#DDD3C2] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#2D6A2F] flex items-center justify-center text-white font-ethiopic font-bold text-sm shadow-sm">
            ፩
          </div>
          <div>
            <div className="text-xs font-bold text-[#1E4A20] font-display leading-tight">
              Ge'ez Numeral Match
            </div>
            <div className="text-[10px] text-[#6B6459] font-mono-custom flex items-center gap-1.5">
              <span>Ages 6–8</span>
              <span>•</span>
              <span className="text-[#B85C38] font-bold">Idea 7 · Android</span>
            </div>
          </div>
        </div>

        {/* Global Action Icons */}
        <div className="flex items-center gap-2">
          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1 bg-[#F3DCCF] border border-[#E0B49B] px-2 py-1 rounded-full text-xs font-bold text-[#B85C38]"
            title={`${streakDays} Day Streak!`}
          >
            <span>🔥</span>
            <span className="font-mono-custom">{streakDays}</span>
          </div>

          {/* Stars Tally */}
          <div
            className="flex items-center gap-1 bg-[#F4E4C1] border border-[#DDD3C2] px-2 py-1 rounded-full text-xs font-bold text-[#7A5A0E]"
            title={`${starsTotal} Stars Earned!`}
          >
            <Award size={13} className="text-[#C8961E]" />
            <span className="font-mono-custom">{starsTotal}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-full hover:bg-[#E7EEE1] text-[#1E4A20] transition-colors"
            title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} className="text-[#6B6459]" />}
          </button>

          {/* Parent Mode Entry */}
          <button
            onClick={onOpenParentMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E7EEE1] hover:bg-[#D4E2CA] text-[#1E4A20] text-xs font-semibold border border-[#DDD3C2] transition-colors"
            title="Parent Mode & Metrics"
          >
            <ShieldCheck size={13} />
            <span className="hidden sm:inline">Parent</span>
          </button>

          {/* Device Frame View Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 rounded-full hover:bg-[#E7EEE1] text-[#1E4A20] transition-colors"
            title={isPhoneFrame ? 'Switch to Fullscreen Native View' : 'Switch to Android Phone Mockup'}
          >
            {isPhoneFrame ? <Monitor size={16} /> : <Smartphone size={16} />}
          </button>
        </div>
      </header>

      {/* Main Container: Android Phone Frame OR Fullscreen Native View */}
      {isPhoneFrame ? (
        <div className="relative w-full max-w-[390px] aspect-[9/19] max-h-[850px] min-h-[660px] bg-[#1A1A1A] rounded-[44px] p-3 shadow-2xl ring-1 ring-black/20 flex flex-col transition-all duration-300">
          {/* Realistic Camera Punch Hole / Earpiece */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 z-30 pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-[#0D0D0D] ring-2 ring-[#2A2A2A]/80 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#1E293B]" />
            </div>
          </div>

          {/* Phone Screen Display */}
          <div className="relative w-full h-full bg-[#FDF8F2] rounded-[34px] overflow-hidden flex flex-col shadow-inner">
            {/* Android Status Bar */}
            <div className="h-7 w-full bg-[#2D6A2F] text-white/90 px-5 flex items-center justify-between text-[11px] font-mono-custom select-none z-20 shrink-0">
              <span className="font-semibold tracking-tight">{currentTime}</span>
              <div className="flex items-center gap-2">
                {/* 5G / Wi-Fi icon simulation */}
                <svg className="w-3.5 h-3.5 fill-current opacity-90" viewBox="0 0 24 24">
                  <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
                </svg>
                {/* Battery icon */}
                <div className="flex items-center">
                  <div className="w-4 h-2 border border-white/80 rounded-sm p-0.5 flex items-center">
                    <div className="w-2.5 h-full bg-white rounded-2xs" />
                  </div>
                  <div className="w-0.5 h-1 bg-white/80 rounded-r-xs" />
                </div>
              </div>
            </div>

            {/* Inner App Content Scroll Area */}
            <main className="flex-1 overflow-y-auto flex flex-col relative bg-[#FDF8F2]">
              {children}
            </main>

            {/* Android Navigation Gesture Bar */}
            <div className="h-5 w-full bg-[#FAF6EF] flex items-center justify-center shrink-0 border-t border-[#DDD3C2]/40 z-20">
              <div className="w-24 h-1 bg-[#1A1A1A]/30 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Native Fullscreen Container (Mobile-first responsive) */
        <div className="w-full max-w-xl bg-[#FDF8F2] rounded-3xl border border-[#DDD3C2] shadow-xl overflow-hidden flex flex-col min-h-[680px]">
          <main className="flex-1 overflow-y-auto flex flex-col">
            {children}
          </main>
        </div>
      )}

      {/* Subtitle / Spec Note */}
      <footer className="mt-3 text-center text-[11px] text-[#6B6459] font-mono-custom flex items-center gap-2">
        <span>Additive System · No Zero · Fully Offline Bundled</span>
      </footer>
    </div>
  );
};
