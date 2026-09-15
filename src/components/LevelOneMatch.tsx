import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { GEEZ_UNITS } from '../data/numerals';
import { GeezNumeral } from '../types';
import { GediMascot } from './GediMascot';
import { soundManager } from '../utils/audio';
import { fireCelebrationConfetti, fireBigVictoryConfetti } from '../utils/confetti';

interface LevelOneMatchProps {
  onRoundComplete: (correctCount: number, totalQuestions: number) => void;
  onGoToLevel2: () => void;
}

export const LevelOneMatch: React.FC<LevelOneMatchProps> = ({
  onRoundComplete,
  onGoToLevel2,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentNumeral, setCurrentNumeral] = useState<GeezNumeral>(GEEZ_UNITS[0]);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [displayMode, setDisplayMode] = useState<'arabic' | 'dots'>('arabic');
  const [mascotMood, setMascotMood] = useState<'neutral' | 'talking' | 'celebrating' | 'thinking'>('talking');
  const [mascotSpeech, setMascotSpeech] = useState<string>('');
  const [mascotSubSpeech, setMascotSubSpeech] = useState<string>('');

  const TOTAL_QUESTIONS = 5;

  // Initialize a randomized question
  const setupQuestion = (qIdx: number) => {
    // Pick random numeral from 1-10
    const randomIndex = Math.floor(Math.random() * GEEZ_UNITS.length);
    const target = GEEZ_UNITS[randomIndex];
    setCurrentNumeral(target);
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Generate 3 choices (1 correct, 2 unique distractors)
    const distractorPool = GEEZ_UNITS.filter(u => u.arabic !== target.arabic).map(u => u.arabic);
    // Shuffle distractors
    const shuffledPool = [...distractorPool].sort(() => 0.5 - Math.random());
    const choices = [target.arabic, shuffledPool[0], shuffledPool[1]].sort(() => 0.5 - Math.random());
    setOptions(choices);

    // Update Mascot speech
    setMascotMood('talking');
    setMascotSpeech(`${target.geez} is "${target.englishTranslit}" in Amharic!`);
    setMascotSubSpeech(`Tap the matching ${displayMode === 'arabic' ? 'number' : 'dots'} below!`);
  };

  useEffect(() => {
    setupQuestion(0);
    setScore(0);
    setQuestionIndex(0);
    setRoundFinished(false);
  }, []);

  const handleSelectOption = (num: number) => {
    if (selectedAnswer !== null) return; // Prevent double taps

    soundManager.playTap();
    setSelectedAnswer(num);

    const correct = num === currentNumeral.arabic;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playSuccess();
      fireCelebrationConfetti();
      setScore(prev => prev + 1);
      setMascotMood('celebrating');
      setMascotSpeech(`ጎበዝ! Correct! ${currentNumeral.geez} is ${currentNumeral.arabic}!`);
      setMascotSubSpeech(`"${currentNumeral.amharicName}" (${currentNumeral.englishTranslit})`);
    } else {
      soundManager.playTryAgain();
      setMascotMood('thinking');
      setMascotSpeech(`Almost! Try counting again!`);
      setMascotSubSpeech(`${currentNumeral.geez} is "${currentNumeral.englishTranslit}" (${currentNumeral.amharicName})`);
    }

    // Auto advance after 1.6 seconds
    setTimeout(() => {
      if (questionIndex + 1 >= TOTAL_QUESTIONS) {
        setRoundFinished(true);
        soundManager.playFanfare();
        fireBigVictoryConfetti();
        onRoundComplete(score + (correct ? 1 : 0), TOTAL_QUESTIONS);
      } else {
        setQuestionIndex(prev => prev + 1);
        setupQuestion(questionIndex + 1);
      }
    }, 1600);
  };

  const handleRestartRound = () => {
    soundManager.playTap();
    setScore(0);
    setQuestionIndex(0);
    setRoundFinished(false);
    setupQuestion(0);
  };

  const handlePronounce = () => {
    soundManager.playTap();
    // Only says the Amharic number itself
    soundManager.speakAmharic(currentNumeral.amharicName);
  };

  // Render counting dots visual representation
  const renderDots = (count: number) => {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[54px] p-1">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#B85C38] border border-[#8B3E23]/40 shadow-xs"
          />
        ))}
      </div>
    );
  };

  if (roundFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#FAF6EF]">
        <div className="w-16 h-16 rounded-full bg-[#F4E4C1] flex items-center justify-center text-3xl mb-3 shadow-sm border border-[#C8961E]/40 animate-bounce">
          🎉
        </div>
        <h3 className="font-display text-2xl font-bold text-[#1E4A20] mb-1">
          Round Completed!
        </h3>
        <p className="text-sm text-[#6B6459] mb-4">
          You matched single digits like an Ethiopian scholar!
        </p>

        {/* Score pill */}
        <div className="bg-white border border-[#DDD3C2] rounded-2xl p-4 w-full max-w-xs shadow-xs mb-5">
          <div className="text-3xl font-display font-bold text-[#C8961E] mb-1">
            {score} / {TOTAL_QUESTIONS}
          </div>
          <div className="text-xs text-[#6B6459] font-medium">
            {score === TOTAL_QUESTIONS
              ? '🌟 Flawless recognition! Ready for combination!'
              : '🌟 Great progress! Every round strengthens memory!'}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <button
            onClick={onGoToLevel2}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#2D6A2F] text-white font-bold text-sm shadow-md hover:bg-[#1E4A20] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Next: Level 2 Combination</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleRestartRound}
            className="w-full py-3 px-5 rounded-2xl bg-white border border-[#DDD3C2] text-[#1E4A20] font-semibold text-sm hover:bg-[#FDF8F2] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Play Level 1 Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#FDF8F2]">
      {/* Header with Level tag and Progress indicator */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#2D6A2F] uppercase tracking-wider font-mono-custom bg-[#E7EEE1] px-2 py-0.5 rounded-full border border-[#DDD3C2]">
              Level 1 · Single Digits
            </span>
          </div>
          {/* Mode Toggle: Arabic digits vs Count Dots */}
          <div className="flex items-center bg-[#E7EEE1] p-0.5 rounded-lg border border-[#DDD3C2]">
            <button
              onClick={() => {
                soundManager.playTap();
                setDisplayMode('arabic');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                displayMode === 'arabic'
                  ? 'bg-white text-[#1E4A20] shadow-xs'
                  : 'text-[#6B6459]'
              }`}
            >
              Digits
            </button>
            <button
              onClick={() => {
                soundManager.playTap();
                setDisplayMode('dots');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                displayMode === 'dots'
                  ? 'bg-white text-[#1E4A20] shadow-xs'
                  : 'text-[#6B6459]'
              }`}
            >
              Dots
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === questionIndex
                  ? 'w-6 bg-[#C8961E]'
                  : i < questionIndex
                  ? 'w-3 bg-[#2D6A2F]'
                  : 'w-2 bg-[#DDD3C2]'
              }`}
            />
          ))}
        </div>

        {/* Mascot Prompt */}
        <div className="mb-2">
          <GediMascot
            mood={mascotMood}
            speech={mascotSpeech}
            subSpeech={mascotSubSpeech}
            listenNumber={currentNumeral.amharicName}
            onAudioClick={handlePronounce}
            size="sm"
          />
        </div>
      </div>

      {/* Main Numeral Stage */}
      <div className="my-auto py-3 flex flex-col items-center justify-center">
        <div
          className={`relative group w-36 h-36 sm:w-40 sm:h-40 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
            isCorrect === true
              ? 'bg-[#E4F0E1] border-3 border-[#2D6A2F] scale-105 ring-4 ring-[#2D6A2F]/20'
              : isCorrect === false
              ? 'bg-[#F6E1E1] border-2 border-[#B85C38] shake-anim'
              : 'bg-white border-2 border-[#DDD3C2]'
          }`}
        >
          {/* Big Ethiopic Numeral */}
          <span className="font-ethiopic text-7xl sm:text-8xl text-[#2D6A2F] font-bold select-none leading-none drop-shadow-xs">
            {currentNumeral.geez}
          </span>

          {/* Explicit Listen Icon Button */}
          <button
            type="button"
            onClick={handlePronounce}
            className="mt-2 flex items-center gap-1.5 bg-[#FAF6EF] hover:bg-[#F4E4C1] active:scale-95 px-3 py-1 rounded-full border border-[#DDD3C2] text-xs font-bold text-[#1E4A20] shadow-xs cursor-pointer transition-colors"
            title="Click listen icon to hear Amharic number"
          >
            <Volume2 size={13} className="text-[#C8961E]" />
            <span>Listen · {currentNumeral.amharicName}</span>
          </button>

          {isCorrect === true && (
            <div className="absolute -top-2 -right-2 bg-[#C8961E] text-white p-1 rounded-full shadow-md animate-bounce">
              <Sparkles size={16} />
            </div>
          )}
        </div>
      </div>

      {/* 3 Large Choice Cards (At least 44px+ touch target) */}
      <div className="pb-1">
        <div className="text-center text-xs font-semibold text-[#6B6459] mb-2.5">
          Tap the matching {displayMode === 'arabic' ? 'number' : 'count'}:
        </div>

        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
          {options.map((optionNum) => {
            const isThisSelected = selectedAnswer === optionNum;
            const isThisCorrect = optionNum === currentNumeral.arabic;

            let cardStyles = 'bg-white border-2 border-[#DDD3C2] text-[#1A1A1A] hover:border-[#2D6A2F] active:scale-95 shadow-xs';
            if (selectedAnswer !== null) {
              if (isThisCorrect) {
                cardStyles = 'bg-[#2D6A2F] text-white border-2 border-[#1E4A20] shadow-md scale-105';
              } else if (isThisSelected) {
                cardStyles = 'bg-[#B85C38] text-white border-2 border-[#8B3E23] opacity-80';
              } else {
                cardStyles = 'bg-white/60 border-2 border-[#DDD3C2] text-gray-400 opacity-50';
              }
            }

            return (
              <button
                key={optionNum}
                onClick={() => handleSelectOption(optionNum)}
                disabled={selectedAnswer !== null}
                className={`h-20 min-h-[56px] rounded-2xl flex flex-col items-center justify-center font-display font-bold text-2xl transition-all cursor-pointer ${cardStyles}`}
              >
                {displayMode === 'arabic' ? (
                  <span>{optionNum}</span>
                ) : (
                  renderDots(optionNum)
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-center text-[#6B6459] mt-3">
          Recognition only · no complex stroke tracing required
        </p>
      </div>
    </div>
  );
};
