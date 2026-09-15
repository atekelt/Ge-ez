import React, { useState } from 'react';
import { X, ShieldCheck, Flame, Award, CheckCircle2, RotateCcw, BookOpen, AlertCircle } from 'lucide-react';
import { UserProgress } from '../types';
import { soundManager } from '../utils/audio';

interface ParentModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onResetProgress: () => void;
  onToggleStreakFreeze: () => void;
}

export const ParentModeModal: React.FC<ParentModeModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress,
  onToggleStreakFreeze,
}) => {
  // Adult math challenge gate
  const [numA] = useState(() => Math.floor(Math.random() * 6) + 7);
  const [numB] = useState(() => Math.floor(Math.random() * 5) + 4);
  const [parentAnswer, setParentAnswer] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(parentAnswer, 10) === numA + numB) {
      soundManager.playSuccess();
      setIsUnlocked(true);
      setUnlockError(false);
    } else {
      soundManager.playTryAgain();
      setUnlockError(true);
    }
  };

  const level1Accuracy = progress.level1Played > 0
    ? Math.round((progress.level1Correct / progress.level1Played) * 100)
    : 0;

  const level2Accuracy = progress.level2Played > 0
    ? Math.round((progress.level2Correct / progress.level2Played) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FDF8F2] w-full max-w-md sm:max-w-lg md:max-w-xl rounded-3xl border-2 border-[#DDD3C2] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-[#1E4A20] text-white px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#C8961E] sm:w-5 sm:h-5" />
            <span className="font-display font-bold text-sm sm:text-base">Parent & Educator Zone</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Inner Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {!isUnlocked ? (
            /* Adult Gate */
            <form onSubmit={handleUnlock} className="space-y-3 text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E7EEE1] text-[#2D6A2F] flex items-center justify-center mx-auto mb-2">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-[#1E4A20]">
                Parent Verification
              </h3>
              <p className="text-xs text-[#6B6459] max-w-xs mx-auto">
                Please solve this math problem to access child learning metrics:
              </p>
              <div className="text-xl font-mono-custom font-bold text-[#1A1A1A] bg-[#FAF6EF] py-2 rounded-xl border border-[#DDD3C2] max-w-[200px] mx-auto">
                {numA} + {numB} = ?
              </div>
              <input
                type="number"
                value={parentAnswer}
                onChange={(e) => setParentAnswer(e.target.value)}
                placeholder="Answer"
                className="w-32 text-center text-lg font-bold p-2 bg-white border-2 border-[#DDD3C2] rounded-xl focus:border-[#2D6A2F] focus:outline-none"
                autoFocus
              />
              {unlockError && (
                <p className="text-xs text-[#B85C38] font-semibold">
                  Incorrect answer, please try again!
                </p>
              )}
              <div>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2D6A2F] text-white font-bold text-xs hover:bg-[#1E4A20] transition-colors"
                >
                  Enter Parent Dashboard
                </button>
              </div>
            </form>
          ) : (
            /* Dashboard content once unlocked */
            <>
              {/* Separate Level 1 and Level 2 Metrics as mandated in spec */}
              <div>
                <h4 className="text-xs font-bold text-[#6B6459] uppercase tracking-wider font-mono-custom mb-2">
                  Learning Accuracy Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Level 1 Card */}
                  <div className="bg-white border border-[#DDD3C2] rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[#6B6459] mb-1">
                      <span className="font-bold text-[#2D6A2F]">Level 1</span>
                      <span className="text-[10px]">Single Digits</span>
                    </div>
                    <div className="text-2xl font-display font-bold text-[#2D6A2F]">
                      {progress.level1Played > 0 ? `${level1Accuracy}%` : 'Not Started'}
                    </div>
                    <div className="text-[10px] text-[#6B6459] mt-0.5">
                      {progress.level1Correct} / {progress.level1Played} correct
                    </div>
                  </div>

                  {/* Level 2 Card */}
                  <div className="bg-white border border-[#DDD3C2] rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[#6B6459] mb-1">
                      <span className="font-bold text-[#B85C38]">Level 2</span>
                      <span className="text-[10px]">Additive 11-99</span>
                    </div>
                    <div className="text-2xl font-display font-bold text-[#B85C38]">
                      {progress.level2Played > 0 ? `${level2Accuracy}%` : 'Not Started'}
                    </div>
                    <div className="text-[10px] text-[#6B6459] mt-0.5">
                      {progress.level2Correct} / {progress.level2Played} correct
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement & Retention Section */}
              <div className="bg-[#FAF6EF] border border-[#DDD3C2] rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-[#B85C38]" />
                    <div>
                      <span className="font-display font-bold text-sm text-[#1E4A20]">
                        {progress.streakDays} Day Learning Streak
                      </span>
                      <p className="text-[10px] text-[#6B6459]">Target Week-1 retention 35%+</p>
                    </div>
                  </div>

                  {/* Streak Freeze button */}
                  <button
                    onClick={onToggleStreakFreeze}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      progress.streakFreezeActive
                        ? 'bg-[#2D6A2F] text-white border-[#1E4A20]'
                        : 'bg-white text-[#6B6459] border-[#DDD3C2]'
                    }`}
                  >
                    {progress.streakFreezeActive ? '❄️ Freeze Active' : 'Enable Freeze'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#DDD3C2]/40 text-xs">
                  <span className="text-[#6B6459]">Total Stars Collected:</span>
                  <span className="font-display font-bold text-[#C8961E] flex items-center gap-1">
                    <Award size={14} />
                    {progress.starsTotal}
                  </span>
                </div>
              </div>

              {/* Cultural & Pedagogical Primer for Parents */}
              <div className="bg-white border border-[#DDD3C2] rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-2 text-[#1E4A20]">
                  <BookOpen size={16} className="text-[#C8961E]" />
                  <h5 className="font-display font-bold text-xs">
                    Pedagogical Notes for Parents
                  </h5>
                </div>
                <div className="space-y-2 text-xs text-[#3B3630] leading-relaxed">
                  <p>
                    <strong>Why Additive?</strong> Ge'ez numbers are not positional like Arabic digits. When your child writes <strong>፳፫ (23)</strong>, they combine the symbol for 20 (፳) with 3 (፫). There is no zero placeholder.
                  </p>
                  <p>
                    <strong>Cultural Continuity:</strong> Ge'ez numerals remain in daily active use for Ethiopian calendar dates, Orthodox texts, and historic landmarks in Lalibela and Axum.
                  </p>
                  <p className="text-[11px] text-[#6B6459]">
                    🔒 Safety: 100% offline, zero ad SDKs, zero stroke telemetry.
                  </p>
                </div>
              </div>

              {/* Reset Data */}
              <div className="pt-2 border-t border-[#DDD3C2] flex justify-end">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all game progress?')) {
                      onResetProgress();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#B85C38] hover:text-[#8B3E23] font-semibold"
                >
                  <RotateCcw size={12} />
                  <span>Reset Progress</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
