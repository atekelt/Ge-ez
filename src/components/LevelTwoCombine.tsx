import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Plus, CheckCircle, HelpCircle, Volume2 } from 'lucide-react';
import { GEEZ_UNITS, GEEZ_TENS, getCompoundGeez } from '../data/numerals';
import { CompoundGeez } from '../types';
import { GediMascot } from './GediMascot';
import { soundManager } from '../utils/audio';
import { fireCelebrationConfetti, fireBigVictoryConfetti } from '../utils/confetti';

interface LevelTwoCombineProps {
  onRoundComplete: (correctCount: number, totalQuestions: number) => void;
  onGoToNoZero: () => void;
}

export const LevelTwoCombine: React.FC<LevelTwoCombineProps> = ({
  onRoundComplete,
  onGoToNoZero,
}) => {
  const [subMode, setSubMode] = useState<'build' | 'identify'>('build');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [targetCompound, setTargetCompound] = useState<CompoundGeez | null>(null);

  // For Builder sub-mode
  const [selectedTens, setSelectedTens] = useState<number | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<number | null>(null);
  const [isCombined, setIsCombined] = useState(false);
  const [builderFeedback, setBuilderFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // For Identify sub-mode
  const [identifyChoices, setIdentifyChoices] = useState<number[]>([]);
  const [identifySelected, setIdentifySelected] = useState<number | null>(null);

  const [score, setScore] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [mascotMood, setMascotMood] = useState<'neutral' | 'talking' | 'celebrating' | 'thinking'>('talking');
  const [mascotSpeech, setMascotSpeech] = useState('');
  const [mascotSubSpeech, setMascotSubSpeech] = useState('');

  const TOTAL_QUESTIONS = 4;

  // Generate an interesting non-round compound number (11-99 excluding multiples of 10)
  const generateRandomCompound = () => {
    // Pick tens from 10, 20, 30, 40, 50, 60, 70, 80, 90
    const tensValues = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    const tens = tensValues[Math.floor(Math.random() * tensValues.length)];
    // Pick units from 1-9
    const units = Math.floor(Math.random() * 9) + 1;
    return getCompoundGeez(tens + units);
  };

  const setupQuestion = (qIdx: number) => {
    const compound = generateRandomCompound();
    setTargetCompound(compound);
    setSelectedTens(null);
    setSelectedUnits(null);
    setIsCombined(false);
    setBuilderFeedback('idle');
    setIdentifySelected(null);

    // Setup choices for identify mode
    const distractor1 = Math.min(99, Math.max(11, compound.arabic + (Math.random() > 0.5 ? 10 : -10)));
    const distractor2 = (compound.units * 10) + (compound.tens / 10); // inverted digits! e.g. 32 instead of 23
    const choices = Array.from(new Set([compound.arabic, distractor1, distractor2]))
      .slice(0, 3)
      .sort(() => 0.5 - Math.random());
    while (choices.length < 3) {
      const extra = Math.floor(Math.random() * 80) + 11;
      if (!choices.includes(extra)) choices.push(extra);
    }
    setIdentifyChoices(choices.sort(() => 0.5 - Math.random()));

    setMascotMood('talking');
    if (subMode === 'build') {
      setMascotSpeech(`Let's build ${compound.arabic}!`);
      setMascotSubSpeech(`Pick Tens (${compound.tensGeez}), then Units (${compound.unitsGeez})!`);
    } else {
      setMascotSpeech(`What number is ${compound.fullGeez}?`);
      setMascotSubSpeech(`Think additively: ${compound.tensGeez} + ${compound.unitsGeez}!`);
    }
  };

  useEffect(() => {
    setupQuestion(0);
    setScore(0);
    setQuestionIndex(0);
    setRoundFinished(false);
  }, [subMode]);

  // Handle Builder: selecting tens
  const handlePickTens = (val: number) => {
    soundManager.playTap();
    setSelectedTens(val);
    if (selectedUnits !== null) {
      checkBuilderSubmission(val, selectedUnits);
    }
  };

  // Handle Builder: selecting units
  const handlePickUnits = (val: number) => {
    soundManager.playTap();
    setSelectedUnits(val);
    if (selectedTens !== null) {
      checkBuilderSubmission(selectedTens, val);
    }
  };

  const checkBuilderSubmission = (tens: number, units: number) => {
    if (!targetCompound) return;

    const isTensRight = tens === targetCompound.tens;
    const isUnitsRight = units === targetCompound.units;

    if (isTensRight && isUnitsRight) {
      soundManager.playCombineSound();
      setIsCombined(true);
      setBuilderFeedback('correct');
      fireCelebrationConfetti();
      setScore(prev => prev + 1);
      setMascotMood('celebrating');
      setMascotSpeech(`ድንቅ ነው! ${targetCompound.tensGeez} + ${targetCompound.unitsGeez} = ${targetCompound.fullGeez}!`);
      setMascotSubSpeech(`${targetCompound.tens} + ${targetCompound.units} = ${targetCompound.arabic} (${targetCompound.englishTranslit})`);

      setTimeout(() => {
        advanceQuestion(true);
      }, 2000);
    } else {
      soundManager.playTryAgain();
      setBuilderFeedback('wrong');
      setMascotMood('thinking');
      setMascotSpeech(`Not quite! Remember ${targetCompound.arabic} = ${targetCompound.tens} + ${targetCompound.units}`);
      setMascotSubSpeech(`Tap the Tens (${targetCompound.tens}) and Units (${targetCompound.units})`);

      // Reset selection after brief shake
      setTimeout(() => {
        setSelectedTens(null);
        setSelectedUnits(null);
        setBuilderFeedback('idle');
      }, 1400);
    }
  };

  // Handle Identify mode tap
  const handleIdentifyChoice = (chosen: number) => {
    if (identifySelected !== null || !targetCompound) return;

    soundManager.playTap();
    setIdentifySelected(chosen);

    const correct = chosen === targetCompound.arabic;
    if (correct) {
      soundManager.playSuccess();
      fireCelebrationConfetti();
      setScore(prev => prev + 1);
      setMascotMood('celebrating');
      setMascotSpeech(`ጎበዝ! ${targetCompound.fullGeez} is ${targetCompound.arabic}!`);
      setMascotSubSpeech(`${targetCompound.tensGeez} (${targetCompound.tens}) + ${targetCompound.unitsGeez} (${targetCompound.units})`);
    } else {
      soundManager.playTryAgain();
      setMascotMood('thinking');
      setMascotSpeech(`Close! ${targetCompound.tensGeez} is ${targetCompound.tens}, plus ${targetCompound.unitsGeez} is ${targetCompound.units}!`);
    }

    setTimeout(() => {
      advanceQuestion(correct);
    }, 1800);
  };

  const advanceQuestion = (wasCorrect: boolean) => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setRoundFinished(true);
      soundManager.playFanfare();
      fireBigVictoryConfetti();
      onRoundComplete(score + (wasCorrect ? 1 : 0), TOTAL_QUESTIONS);
    } else {
      setQuestionIndex(prev => prev + 1);
      setupQuestion(questionIndex + 1);
    }
  };

  const handleRestart = () => {
    soundManager.playTap();
    setScore(0);
    setQuestionIndex(0);
    setRoundFinished(false);
    setupQuestion(0);
  };

  if (!targetCompound) return null;

  if (roundFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#FAF6EF]">
        <div className="w-16 h-16 rounded-full bg-[#E7EEE1] flex items-center justify-center text-3xl mb-3 shadow-sm border border-[#2D6A2F]/40 animate-bounce">
          🧩
        </div>
        <h3 className="font-display text-2xl font-bold text-[#1E4A20] mb-1">
          Additive Master!
        </h3>
        <p className="text-sm text-[#6B6459] mb-4">
          You conquered two-symbol additive math with no zero needed!
        </p>

        <div className="bg-white border border-[#DDD3C2] rounded-2xl p-4 w-full max-w-xs shadow-xs mb-5">
          <div className="text-3xl font-display font-bold text-[#2D6A2F] mb-1">
            {score} / {TOTAL_QUESTIONS}
          </div>
          <div className="text-xs text-[#6B6459] font-medium">
            {score === TOTAL_QUESTIONS
              ? '🏆 Incredible! You understand the 2,000-year-old Ge’ez logic!'
              : '🌟 Great practice! Building numbers gets faster every round.'}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <button
            onClick={onGoToNoZero}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#B85C38] text-white font-bold text-sm shadow-md hover:bg-[#8B3E23] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Discover: The "No Zero" Story</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleRestart}
            className="w-full py-3 px-5 rounded-2xl bg-white border border-[#DDD3C2] text-[#1E4A20] font-semibold text-sm hover:bg-[#FDF8F2] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Play Level 2 Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 bg-[#FDF8F2]">
      {/* Header & Submode Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#B85C38] uppercase tracking-wider font-mono-custom bg-[#F3DCCF] px-2 py-0.5 rounded-full border border-[#E0B49B]">
            Level 2 · Additive Combine
          </span>

          <div className="flex items-center bg-[#E7EEE1] p-0.5 rounded-lg border border-[#DDD3C2]">
            <button
              onClick={() => setSubMode('build')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                subMode === 'build' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              🔨 Build
            </button>
            <button
              onClick={() => setSubMode('identify')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                subMode === 'identify' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              🔍 Match
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === questionIndex
                  ? 'w-6 bg-[#B85C38]'
                  : i < questionIndex
                  ? 'w-3 bg-[#2D6A2F]'
                  : 'w-2 bg-[#DDD3C2]'
              }`}
            />
          ))}
        </div>

        {/* Mascot */}
        <div className="mb-2">
          <GediMascot
            mood={mascotMood}
            speech={mascotSpeech}
            subSpeech={mascotSubSpeech}
            listenNumber={targetCompound.amharicName}
            onAudioClick={() => {
              soundManager.playTap();
              soundManager.speakAmharic(targetCompound.amharicName);
            }}
            size="sm"
          />
        </div>
      </div>

      {/* SUB-MODE 1: NUMBER BUILDER WORKSHOP */}
      {subMode === 'build' ? (
        <div className="flex-1 flex flex-col justify-between py-1">
          {/* Target Banner & Combination Stage */}
          <div className="bg-white border-2 border-[#DDD3C2] rounded-2xl p-3 shadow-xs mb-2">
            <div className="flex items-center justify-between text-xs text-[#6B6459] mb-1">
              <div className="flex items-center gap-1.5">
                <span>Goal: Build {targetCompound.arabic}</span>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    soundManager.speakAmharic(targetCompound.amharicName);
                  }}
                  className="inline-flex items-center gap-1 bg-[#FAF6EF] hover:bg-[#F4E4C1] active:scale-95 text-[#8B3E23] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#DDD3C2] cursor-pointer"
                  title="Click listen icon to hear Amharic number"
                >
                  <Volume2 size={12} className="text-[#C8961E]" />
                  <span>Listen</span>
                </button>
              </div>
              <span className="font-display font-bold text-lg text-[#2D6A2F] bg-[#E7EEE1] px-2.5 py-0.5 rounded-lg">
                {targetCompound.arabic}
              </span>
            </div>

            {/* Fusion Stage: [Tens] + [Units] = [Compound] */}
            <div className="flex items-center justify-center gap-2 my-1">
              {/* Tens slot */}
              <div
                className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  selectedTens !== null
                    ? 'bg-[#E7EEE1] border-[#2D6A2F] text-[#2D6A2F]'
                    : 'bg-[#FDF8F2] border-dashed border-[#DDD3C2] text-gray-400'
                }`}
              >
                {selectedTens !== null ? (
                  <>
                    <span className="font-ethiopic text-2xl font-bold">
                      {GEEZ_TENS.find(t => t.arabic === selectedTens)?.geez}
                    </span>
                    <span className="text-[10px] font-mono-custom text-[#6B6459]">{selectedTens}</span>
                  </>
                ) : (
                  <span className="text-[10px] font-semibold text-center text-[#6B6459]">Pick Tens</span>
                )}
              </div>

              {/* Plus operator */}
              <Plus size={16} className="text-[#C8961E] shrink-0" />

              {/* Units slot */}
              <div
                className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  selectedUnits !== null
                    ? 'bg-[#F3DCCF] border-[#B85C38] text-[#B85C38]'
                    : 'bg-[#FDF8F2] border-dashed border-[#DDD3C2] text-gray-400'
                }`}
              >
                {selectedUnits !== null ? (
                  <>
                    <span className="font-ethiopic text-2xl font-bold">
                      {GEEZ_UNITS.find(u => u.arabic === selectedUnits)?.geez}
                    </span>
                    <span className="text-[10px] font-mono-custom text-[#6B6459]">{selectedUnits}</span>
                  </>
                ) : (
                  <span className="text-[10px] font-semibold text-center text-[#6B6459]">Pick Units</span>
                )}
              </div>

              {/* Equals */}
              <span className="font-bold text-base text-[#1A1A1A] shrink-0">=</span>

              {/* Result combined preview */}
              <div
                className={`min-w-16 h-16 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  isCombined
                    ? 'bg-[#2D6A2F] text-white border-[#1E4A20] scale-105 shadow-md'
                    : 'bg-white border-[#DDD3C2] text-[#1A1A1A]'
                }`}
              >
                {isCombined ? (
                  <>
                    <span className="font-ethiopic text-3xl font-bold text-white">
                      {targetCompound.fullGeez}
                    </span>
                    <span className="text-[9px] font-medium text-white/90">
                      {targetCompound.amharicName}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-400 font-medium">Result</span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-center text-[#6B6459] mt-1 font-mono-custom">
              Additive formula: {targetCompound.tens} + {targetCompound.units} = {targetCompound.arabic}
            </div>
          </div>

          {/* Selection Trays */}
          <div className="space-y-2">
            {/* Step 1: Tens Tray */}
            <div>
              <div className="text-[11px] font-bold text-[#2D6A2F] mb-1 flex items-center justify-between">
                <span>1. Select Tens ({targetCompound.tens})</span>
                <span className="text-[10px] text-[#6B6459] font-normal">፲=10, ፳=20, ፴=30...</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {GEEZ_TENS.filter(t => t.arabic < 100).slice(0, 5).map(t => (
                  <button
                    key={t.arabic}
                    onClick={() => handlePickTens(t.arabic)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedTens === t.arabic
                        ? 'bg-[#2D6A2F] text-white border-[#1E4A20] shadow-sm scale-105'
                        : 'bg-white border-[#DDD3C2] text-[#1E4A20] hover:border-[#2D6A2F]'
                    }`}
                  >
                    <span className="font-ethiopic text-xl font-bold leading-tight">{t.geez}</span>
                    <span className="text-[10px] font-mono-custom">{t.arabic}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {GEEZ_TENS.filter(t => t.arabic < 100).slice(5).map(t => (
                  <button
                    key={t.arabic}
                    onClick={() => handlePickTens(t.arabic)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedTens === t.arabic
                        ? 'bg-[#2D6A2F] text-white border-[#1E4A20] shadow-sm scale-105'
                        : 'bg-white border-[#DDD3C2] text-[#1E4A20] hover:border-[#2D6A2F]'
                    }`}
                  >
                    <span className="font-ethiopic text-xl font-bold leading-tight">{t.geez}</span>
                    <span className="text-[10px] font-mono-custom">{t.arabic}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Units Tray */}
            <div>
              <div className="text-[11px] font-bold text-[#B85C38] mb-1 flex items-center justify-between">
                <span>2. Select Units ({targetCompound.units})</span>
                <span className="text-[10px] text-[#6B6459] font-normal">፩=1, ፪=2, ፫=3...</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {GEEZ_UNITS.slice(0, 5).map(u => (
                  <button
                    key={u.arabic}
                    onClick={() => handlePickUnits(u.arabic)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedUnits === u.arabic
                        ? 'bg-[#B85C38] text-white border-[#8B3E23] shadow-sm scale-105'
                        : 'bg-white border-[#DDD3C2] text-[#B85C38] hover:border-[#B85C38]'
                    }`}
                  >
                    <span className="font-ethiopic text-xl font-bold leading-tight">{u.geez}</span>
                    <span className="text-[10px] font-mono-custom">{u.arabic}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {GEEZ_UNITS.slice(5, 9).map(u => (
                  <button
                    key={u.arabic}
                    onClick={() => handlePickUnits(u.arabic)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedUnits === u.arabic
                        ? 'bg-[#B85C38] text-white border-[#8B3E23] shadow-sm scale-105'
                        : 'bg-white border-[#DDD3C2] text-[#B85C38] hover:border-[#B85C38]'
                    }`}
                  >
                    <span className="font-ethiopic text-xl font-bold leading-tight">{u.geez}</span>
                    <span className="text-[10px] font-mono-custom">{u.arabic}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SUB-MODE 2: COMPOUND IDENTIFIER QUIZ */
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="my-auto text-center flex flex-col items-center">
            <div className="w-full max-w-xs bg-white border-2 border-[#DDD3C2] rounded-3xl p-5 shadow-sm mb-4">
              <span className="text-xs font-semibold text-[#6B6459]">Combined Ge'ez Numeral:</span>
              <div className="font-ethiopic text-6xl text-[#2D6A2F] font-bold my-2 tracking-wider">
                {targetCompound.fullGeez}
              </div>

              {/* Visual Breakdown Hint */}
              <div className="inline-flex items-center gap-1.5 bg-[#FAF6EF] px-3 py-1 rounded-full border border-[#DDD3C2] text-xs font-semibold text-[#6B6459]">
                <span>{targetCompound.tensGeez} ({targetCompound.tens})</span>
                <span>+</span>
                <span>{targetCompound.unitsGeez} ({targetCompound.units})</span>
              </div>

              {/* Explicit Listen Button */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    soundManager.speakAmharic(targetCompound.amharicName);
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#FAF6EF] hover:bg-[#F4E4C1] active:scale-95 text-[#1E4A20] px-3 py-1 rounded-full text-xs font-bold border border-[#DDD3C2] cursor-pointer shadow-xs transition-colors"
                  title="Click listen icon to hear Amharic number"
                >
                  <Volume2 size={13} className="text-[#C8961E]" />
                  <span>Listen · {targetCompound.amharicName}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="text-center text-xs font-semibold text-[#6B6459] mb-2">
              What number is represented above?
            </div>
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {identifyChoices.map((choiceVal) => {
                const isSelected = identifySelected === choiceVal;
                const isCorrect = choiceVal === targetCompound.arabic;

                let btnStyles = 'bg-white border-2 border-[#DDD3C2] text-[#1A1A1A] hover:border-[#2D6A2F] active:scale-95 shadow-xs';
                if (identifySelected !== null) {
                  if (isCorrect) {
                    btnStyles = 'bg-[#2D6A2F] text-white border-[#1E4A20] scale-105';
                  } else if (isSelected) {
                    btnStyles = 'bg-[#B85C38] text-white border-[#8B3E23]';
                  } else {
                    btnStyles = 'bg-white/50 border-[#DDD3C2] text-gray-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={choiceVal}
                    onClick={() => handleIdentifyChoice(choiceVal)}
                    disabled={identifySelected !== null}
                    className={`h-16 rounded-2xl flex items-center justify-center font-display text-2xl font-bold transition-all cursor-pointer ${btnStyles}`}
                  >
                    {choiceVal}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Cultural Reminder */}
      <div className="text-center text-[10px] text-[#6B6459] pt-2 border-t border-[#DDD3C2]/50">
        Additive like Roman numerals, but without subtraction. ፳ (20) + ፫ (3) = ፳፫ (23).
      </div>
    </div>
  );
};
