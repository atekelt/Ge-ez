import React, { useState } from 'react';
import { Sparkles, HelpCircle, Check, BookOpen, Compass, Award, Volume2 } from 'lucide-react';
import { GediMascot } from './GediMascot';
import { soundManager } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/confetti';

interface NoZeroDiscoveryProps {
  onGoToChart: () => void;
  onAwardStar: () => void;
}

export const NoZeroDiscovery: React.FC<NoZeroDiscoveryProps> = ({
  onGoToChart,
  onAwardStar,
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'compare' | 'quiz'>('story');
  const [interactiveNumber, setInteractiveNumber] = useState(10);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);

  const handleZeroMysteryTap = () => {
    soundManager.playTap();
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    soundManager.playTap();
    if (isCorrect) {
      soundManager.playSuccess();
      fireCelebrationConfetti();
      setQuizAnswered(true);
      setBadgeEarned(true);
      onAwardStar();
    } else {
      soundManager.playTryAgain();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 bg-[#FDF8F2]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#C8961E] uppercase tracking-wider font-mono-custom bg-[#F4E4C1] px-2.5 py-0.5 rounded-full border border-[#DDD3C2]">
            Discovery · The Zero Mystery
          </span>
          <div className="flex items-center gap-1 bg-[#E7EEE1] p-0.5 rounded-lg border border-[#DDD3C2]">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                activeTab === 'story' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              Story
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                activeTab === 'compare' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                activeTab === 'quiz' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              Quiz
            </button>
          </div>
        </div>

        {/* Mascot */}
        <div className="mb-2">
          <GediMascot
            mood="proud"
            speech="Did you know? Ge'ez has NO symbol for ZERO!"
            subSpeech="It's not missing — the system was built without needing one!"
            size="sm"
          />
        </div>
      </div>

      {/* TAB 1: THE STORY */}
      {activeTab === 'story' && (
        <div className="flex-1 overflow-y-auto space-y-3 py-1 pr-1">
          {/* Highlight Callout */}
          <div className="bg-[#FAF6EF] border-2 border-[#DDD3C2] rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#C8961E] text-white flex items-center justify-center font-bold text-base">
                0?
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#1E4A20]">
                  Where is Zero hiding?
                </h4>
                <p className="text-[11px] text-[#6B6459]">A 2,000-year-old brilliant puzzle</p>
              </div>
            </div>
            <p className="text-xs text-[#3B3630] leading-relaxed">
              When Ethiopian scholars and scribes wrote numbers over 2,000 years ago in Axum and Lalibela, they didn't write "1 and 0" to make ten.
            </p>
            <div className="mt-2.5 p-2 bg-white rounded-xl border border-[#DDD3C2] flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-[#6B6459] block">Arabic</span>
                <span className="font-display font-bold text-base text-[#1A1A1A]">1 + 0 = 10</span>
              </div>
              <span className="text-[#C8961E] font-bold text-xs">vs</span>
              <div>
                <span className="text-[10px] text-[#2D6A2F] font-bold block">Ge'ez</span>
                <span className="font-ethiopic font-bold text-xl text-[#2D6A2F]">፲ (Asir)</span>
              </div>
            </div>
          </div>

          {/* Interactive Inspection Box */}
          <div className="bg-white border border-[#DDD3C2] rounded-2xl p-3 shadow-xs">
            <div className="text-xs font-bold text-[#1E4A20] mb-1 flex items-center gap-1.5">
              <Compass size={14} className="text-[#B85C38]" />
              <span>Tap a number to see its Ge'ez symbol:</span>
            </div>
            <div className="flex items-center justify-between gap-1 mt-2">
              {[1, 5, 10, 20, 50, 100].map((num) => {
                const geezMap: Record<number, string> = {
                  1: '፩', 5: '፭', 10: '፲', 20: '፳', 50: '፶', 100: '፻'
                };
                const isSelected = interactiveNumber === num;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      soundManager.playTap();
                      setInteractiveNumber(num);
                    }}
                    className={`flex-1 py-1.5 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2D6A2F] text-white border-[#1E4A20] scale-105'
                        : 'bg-[#FDF8F2] border-[#DDD3C2] text-[#1E4A20]'
                    }`}
                  >
                    <span className="font-mono-custom text-[11px] font-bold block">{num}</span>
                    <span className="font-ethiopic text-lg font-bold block">{geezMap[num]}</span>
                  </button>
                );
              })}
            </div>

            {(() => {
              const amharicNames: Record<number, string> = {
                1: 'አንድ', 5: 'አምስት', 10: 'አሥር', 20: 'ሃያ', 50: 'ኃምሳ', 100: 'መቶ'
              };
              return (
                <div className="mt-2.5 p-2 bg-[#FAF6EF] rounded-xl text-center text-xs text-[#3B3630] flex flex-col items-center gap-2">
                  <div>
                    Notice how <strong className="text-[#2D6A2F] font-ethiopic text-sm">
                      {interactiveNumber === 10 ? '፲' : interactiveNumber === 20 ? '፳' : interactiveNumber === 50 ? '፶' : interactiveNumber === 100 ? '፻' : interactiveNumber === 5 ? '፭' : '፩'}
                    </strong> has no zero next to it? It is its own standalone royal character!
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      soundManager.speakAmharic(amharicNames[interactiveNumber]);
                    }}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F4E4C1] active:scale-95 text-[#1E4A20] px-3 py-1 rounded-full text-xs font-bold border border-[#DDD3C2] cursor-pointer shadow-xs transition-colors"
                    title="Click listen icon to hear Amharic number"
                  >
                    <Volume2 size={13} className="text-[#C8961E]" />
                    <span>Listen · {amharicNames[interactiveNumber]}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: SIDE BY SIDE COMPARISON */}
      {activeTab === 'compare' && (
        <div className="flex-1 overflow-y-auto space-y-2.5 py-1">
          <div className="grid grid-cols-2 gap-2">
            {/* Positional Card */}
            <div className="bg-white border border-[#DDD3C2] rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-bold text-[#6B6459] uppercase block font-mono-custom">
                Arabic System
              </span>
              <span className="text-xs font-semibold text-[#1A1A1A] block mt-0.5">
                Positional (Needs 0)
              </span>
              <div className="my-2 p-1.5 bg-[#FAF6EF] rounded-lg text-xs font-mono-custom text-[#3B3630]">
                23 = 2 in tens + 3 in units
              </div>
              <p className="text-[11px] text-[#6B6459] leading-tight">
                Needs a "0" placeholder to prevent 20 from looking like 2!
              </p>
            </div>

            {/* Additive Card */}
            <div className="bg-[#E7EEE1] border border-[#BFDAB8] rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-bold text-[#2D6A2F] uppercase block font-mono-custom">
                Ge'ez System
              </span>
              <span className="text-xs font-semibold text-[#1E4A20] block mt-0.5">
                Additive (No Zero)
              </span>
              <div className="my-2 p-1.5 bg-white rounded-lg text-xs font-ethiopic font-bold text-[#2D6A2F]">
                ፳፫ = ፳ (20) + ፫ (3)
              </div>
              <p className="text-[11px] text-[#1E4A20] leading-tight">
                20 is already ፳! No placeholder zero is ever required!
              </p>
            </div>
          </div>

          {/* Quick takeaway badge */}
          <div className="bg-[#F3DCCF] border border-[#E0B49B] rounded-2xl p-3 text-xs text-[#5A3626]">
            <strong>Parent & Kid Insight:</strong> Ge'ez numerals are structurally like Greek Milesian and Roman numerals. Because there is a separate symbol for each ten (10, 20, 30...), you never need an empty column.
          </div>
        </div>
      )}

      {/* TAB 3: ZERO DETECTIVE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="flex-1 flex flex-col justify-center space-y-3 py-1">
          <div className="bg-white border-2 border-[#DDD3C2] rounded-2xl p-4 text-center shadow-xs">
            <div className="text-xs font-bold text-[#B85C38] uppercase font-mono-custom mb-1">
              Zero Detective Challenge
            </div>
            <h4 className="font-display font-bold text-base text-[#1E4A20] mb-3">
              Why don't Ge'ez numerals need a zero symbol?
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => handleQuizAnswer(false)}
                className="w-full p-2.5 rounded-xl border border-[#DDD3C2] hover:bg-[#FDF8F2] text-xs font-medium text-left text-[#3B3630] transition-colors cursor-pointer"
              >
                A) The scribes forgot to carve it
              </button>

              <button
                onClick={() => handleQuizAnswer(true)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                  quizAnswered
                    ? 'bg-[#2D6A2F] text-white border-[#1E4A20]'
                    : 'border-[#DDD3C2] hover:bg-[#E7EEE1] text-[#1E4A20]'
                }`}
              >
                B) Because tens have their own symbols (፲, ፳, ፴) and add together!
              </button>

              <button
                onClick={() => handleQuizAnswer(false)}
                className="w-full p-2.5 rounded-xl border border-[#DDD3C2] hover:bg-[#FDF8F2] text-xs font-medium text-left text-[#3B3630] transition-colors cursor-pointer"
              >
                C) Because only odd numbers exist
              </button>
            </div>

            {badgeEarned && (
              <div className="mt-3 p-2.5 bg-[#F4E4C1] border border-[#C8961E] rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#7A5A0E] animate-bounce">
                <Award size={18} className="text-[#C8961E]" />
                <span>Certified Ge'ez Zero Detective! 🌟</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Nav */}
      <div className="pt-2 border-t border-[#DDD3C2]/60 flex items-center justify-between">
        <button
          onClick={onGoToChart}
          className="w-full py-2.5 rounded-xl bg-[#2D6A2F] text-white font-bold text-xs hover:bg-[#1E4A20] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <BookOpen size={14} />
          <span>Explore All Numerals (Chart)</span>
        </button>
      </div>
    </div>
  );
};
