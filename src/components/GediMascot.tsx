import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GediMascotProps {
  mood?: 'neutral' | 'talking' | 'celebrating' | 'thinking' | 'proud';
  speech?: string;
  subSpeech?: string;
  listenNumber?: string; // Only Amharic number to pronounce, e.g., "አንድ"
  onAudioClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const GediMascot: React.FC<GediMascotProps> = ({
  mood = 'neutral',
  speech,
  subSpeech,
  listenNumber,
  onAudioClick,
  size = 'md',
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const unsubscribe = soundManager.subscribeSpeaking((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return unsubscribe;
  }, []);

  const handleListenClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onAudioClick) {
      onAudioClick();
    } else if (listenNumber) {
      soundManager.speakAmharic(listenNumber);
    } else {
      soundManager.playTap();
    }
  };

  const dims = {
    sm: { width: 54, height: 54 },
    md: { width: 72, height: 72 },
    lg: { width: 96, height: 96 },
  }[size];

  const currentMood = isPlayingAudio ? 'talking' : mood;
  const hasAudio = Boolean(onAudioClick || listenNumber);

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Gelada Mascot Avatar */}
      <div
        onClick={() => {
          if (hasAudio) {
            handleListenClick();
          } else {
            soundManager.playTap();
          }
        }}
        className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 ${
          isPlayingAudio ? 'ring-3 ring-[#C8961E]/60 rounded-full' : ''
        }`}
        title={hasAudio ? 'Tap listen icon to hear number pronunciation' : 'Gedi the Gelada'}
      >
        <svg
          width={dims.width}
          height={dims.height}
          viewBox="0 0 100 100"
          className="drop-shadow-sm filter"
        >
          {/* Fluffy Gelada Mane */}
          <path
            d="M 50 8 C 22 8, 12 32, 14 62 C 16 78, 28 92, 50 94 C 72 92, 84 78, 86 62 C 88 32, 78 8, 50 8 Z"
            fill="#B85C38"
          />
          <path
            d="M 50 12 C 26 12, 18 35, 20 60 C 22 74, 32 86, 50 88 C 68 86, 78 74, 80 60 C 82 35, 74 12, 50 12 Z"
            fill="#8B3E23"
          />

          {/* Ears */}
          <ellipse cx="20" cy="45" rx="8" ry="10" fill="#B85C38" />
          <ellipse cx="20" cy="45" rx="4" ry="6" fill="#F4E4C1" />
          <ellipse cx="80" cy="45" rx="8" ry="10" fill="#B85C38" />
          <ellipse cx="80" cy="45" rx="4" ry="6" fill="#F4E4C1" />

          {/* Facial Mask */}
          <ellipse cx="50" cy="48" rx="26" ry="24" fill="#3B3630" />
          <ellipse cx="50" cy="54" rx="20" ry="16" fill="#4A453D" />

          {/* Distinctive Gelada Pink Chest Patch */}
          <path
            d="M 50 78 C 44 72, 38 74, 38 80 C 38 86, 50 92, 50 92 C 50 92, 62 86, 62 80 C 62 74, 56 72, 50 78 Z"
            fill="#E07A5F"
          />

          {/* Eyes */}
          {currentMood === 'celebrating' ? (
            <>
              <path d="M 38 42 Q 44 38 46 44" stroke="#F4E4C1" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 54 44 Q 56 38 62 42" stroke="#F4E4C1" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : currentMood === 'thinking' ? (
            <>
              <circle cx="42" cy="41" r="4.5" fill="#FDF8F2" />
              <circle cx="44" cy="39" r="2.5" fill="#1A1A1A" />
              <circle cx="58" cy="41" r="4.5" fill="#FDF8F2" />
              <circle cx="60" cy="39" r="2.5" fill="#1A1A1A" />
              <path d="M 37 36 L 46 37" stroke="#F4E4C1" strokeWidth="2" strokeLinecap="round" />
              <path d="M 54 35 L 63 38" stroke="#F4E4C1" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="42" cy="43" r="4.5" fill="#FDF8F2" />
              <circle cx="43" cy="43" r="2.5" fill="#C8961E" />
              <circle cx="43.5" cy="42.5" r="1.2" fill="#1A1A1A" />
              <circle cx="44" cy="41.5" r="0.8" fill="#FFF" />

              <circle cx="58" cy="43" r="4.5" fill="#FDF8F2" />
              <circle cx="57" cy="43" r="2.5" fill="#C8961E" />
              <circle cx="56.5" cy="42.5" r="1.2" fill="#1A1A1A" />
              <circle cx="56" cy="41.5" r="0.8" fill="#FFF" />
            </>
          )}

          {/* Muzzle */}
          <path d="M 47 51 C 47 49, 53 49, 53 51 C 53 53, 47 53, 47 51 Z" fill="#201C18" />

          {/* Mouth */}
          {currentMood === 'celebrating' || currentMood === 'talking' ? (
            <path
              d="M 43 56 Q 50 64 57 56"
              stroke="#F4E4C1"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="#8B3E23"
            />
          ) : currentMood === 'thinking' ? (
            <ellipse cx="50" cy="56" rx="3" ry="2" fill="#201C18" />
          ) : (
            <path
              d="M 44 56 Q 50 60 56 56"
              stroke="#F4E4C1"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          <circle cx="34" cy="52" r="3" fill="#E07A5F" opacity="0.6" />
          <circle cx="66" cy="52" r="3" fill="#E07A5F" opacity="0.6" />
        </svg>

        {/* Sound indicator pill on mascot when audio available */}
        {hasAudio && (
          <button
            type="button"
            onClick={handleListenClick}
            className={`absolute -bottom-1 -right-1 text-white p-1 rounded-full shadow-sm transition-transform active:scale-90 cursor-pointer ${
              isPlayingAudio ? 'bg-[#2D6A2F] scale-110' : 'bg-[#C8961E] hover:bg-[#b08418]'
            }`}
            title="Listen to number"
          >
            <Volume2 size={11} className={isPlayingAudio ? 'animate-bounce' : ''} />
          </button>
        )}
      </div>

      {/* Speech Bubble */}
      {speech && (
        <div className="relative flex-1 bg-white border border-[#DDD3C2] rounded-2xl p-2.5 px-3.5 shadow-sm text-left">
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-white border-b-[6px] border-b-transparent z-10" />
          <div className="absolute -left-[9px] top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#DDD3C2] border-b-[6px] border-b-transparent" />

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#1E4A20] leading-snug">
              {speech}
            </p>

            {/* Clickable Listen Button - Activated ONLY when listen icon is clicked */}
            {hasAudio && (
              <button
                type="button"
                onClick={handleListenClick}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs ${
                  isPlayingAudio
                    ? 'bg-[#2D6A2F] text-white'
                    : 'text-[#8B3E23] bg-[#F4E4C1] hover:bg-[#ebce97] border border-[#C8961E]/30'
                }`}
                title="Click to hear number in Amharic"
              >
                <Volume2 size={11} className={isPlayingAudio ? 'animate-pulse' : 'text-[#C8961E]'} />
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen'}</span>
              </button>
            )}
          </div>

          {subSpeech && (
            <p className="text-[11px] text-[#6B6459] mt-0.5 font-medium leading-tight">
              {subSpeech}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
