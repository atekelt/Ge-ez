import React, { useState } from 'react';
import { Volume2, Sparkles, Filter } from 'lucide-react';
import { GEEZ_UNITS, GEEZ_TENS, ALL_NUMERALS, getCompoundGeez } from '../data/numerals';
import { GeezNumeral } from '../types';
import { soundManager } from '../utils/audio';

export const NumeralChart: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'units' | 'tens'>('all');
  const [selectedNumeral, setSelectedNumeral] = useState<GeezNumeral>(GEEZ_UNITS[0]);

  // Live sandbox state
  const [sandboxTens, setSandboxTens] = useState<number>(20);
  const [sandboxUnits, setSandboxUnits] = useState<number>(3);

  const displayList =
    filter === 'units'
      ? GEEZ_UNITS
      : filter === 'tens'
      ? GEEZ_TENS
      : ALL_NUMERALS;

  const handleNumeralTap = (item: GeezNumeral) => {
    soundManager.playTap();
    setSelectedNumeral(item);
  };

  const compoundResult = getCompoundGeez(sandboxTens + sandboxUnits);

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 bg-[#FDF8F2] overflow-hidden">
      {/* Header & Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#1E4A20] uppercase tracking-wider font-mono-custom bg-[#E7EEE1] px-2.5 py-0.5 rounded-full border border-[#DDD3C2]">
            Numeral Chart · 2,000 Yrs of History
          </span>
          <div className="flex items-center bg-[#E7EEE1] p-0.5 rounded-lg border border-[#DDD3C2]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                filter === 'all' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('units')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                filter === 'units' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              1–10
            </button>
            <button
              onClick={() => setFilter('tens')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                filter === 'tens' ? 'bg-white text-[#1E4A20] shadow-xs' : 'text-[#6B6459]'
              }`}
            >
              10–100
            </button>
          </div>
        </div>

        {/* Selected Highlight Card */}
        <div className="bg-white border-2 border-[#DDD3C2] rounded-2xl p-3 sm:p-5 shadow-xs flex items-center justify-between mb-2.5 sm:mb-4">
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="font-ethiopic text-5xl sm:text-6xl md:text-7xl font-bold text-[#2D6A2F] leading-none">
              {selectedNumeral.geez}
            </span>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h4 className="font-display font-bold text-base sm:text-xl text-[#1E4A20]">
                  {selectedNumeral.arabic}
                </h4>
                <span className="text-xs sm:text-sm font-semibold text-[#B85C38]">
                  "{selectedNumeral.englishTranslit}"
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B6459] font-medium mt-0.5">
                Amharic: <strong className="text-[#1A1A1A]">{selectedNumeral.amharicName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              soundManager.speakAmharic(selectedNumeral.amharicName);
            }}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#FAF6EF] hover:bg-[#F4E4C1] active:scale-95 text-[#8B3E23] border border-[#DDD3C2] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Click listen icon to hear Amharic number"
          >
            <Volume2 size={16} className="text-[#C8961E] sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-bold">Listen</span>
          </button>
        </div>
      </div>

      {/* Grid of All Numerals (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-1.5 sm:gap-2 md:gap-2.5 pb-2 sm:pb-4">
          {displayList.map((item) => {
            const isSelected = selectedNumeral.arabic === item.arabic;
            return (
              <button
                key={item.arabic}
                onClick={() => handleNumeralTap(item)}
                className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D6A2F] text-white border-[#1E4A20] shadow-sm scale-105 ring-2 ring-[#C8961E]'
                    : 'bg-white border-[#DDD3C2] text-[#1E4A20] hover:border-[#2D6A2F]'
                }`}
              >
                <span className="font-ethiopic text-2xl sm:text-3xl font-bold leading-tight">
                  {item.geez}
                </span>
                <span className={`text-[10px] sm:text-xs font-mono-custom ${isSelected ? 'text-white/90' : 'text-[#6B6459]'}`}>
                  {item.arabic}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Compound Sandbox */}
        <div className="bg-[#FAF6EF] border border-[#DDD3C2] rounded-2xl p-3 sm:p-5 mt-1 sm:mt-3 shadow-xs">
          <div className="text-xs font-bold text-[#1E4A20] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles size={13} className="text-[#C8961E]" />
              <span>Interactive Formula Sandbox</span>
            </span>
            <span className="text-[10px] text-[#B85C38] font-mono-custom">Pick & combine</span>
          </div>

          <div className="flex items-center justify-between gap-1.5 mb-2 text-center">
            {/* Pick Tens */}
            <div className="flex-1">
              <span className="text-[9px] text-[#6B6459] font-bold block mb-1">Select Ten</span>
              <select
                value={sandboxTens}
                onChange={(e) => {
                  soundManager.playTap();
                  setSandboxTens(Number(e.target.value));
                }}
                className="w-full text-xs font-bold bg-white border border-[#DDD3C2] rounded-lg p-1 text-[#1E4A20]"
              >
                {GEEZ_TENS.filter(t => t.arabic < 100).map(t => (
                  <option key={t.arabic} value={t.arabic}>
                    {t.geez} ({t.arabic})
                  </option>
                ))}
              </select>
            </div>

            <span className="font-bold text-[#C8961E] text-sm">+</span>

            {/* Pick Units */}
            <div className="flex-1">
              <span className="text-[9px] text-[#6B6459] font-bold block mb-1">Select Unit</span>
              <select
                value={sandboxUnits}
                onChange={(e) => {
                  soundManager.playTap();
                  setSandboxUnits(Number(e.target.value));
                }}
                className="w-full text-xs font-bold bg-white border border-[#DDD3C2] rounded-lg p-1 text-[#B85C38]"
              >
                {GEEZ_UNITS.slice(0, 9).map(u => (
                  <option key={u.arabic} value={u.arabic}>
                    {u.geez} ({u.arabic})
                  </option>
                ))}
              </select>
            </div>

            <span className="font-bold text-gray-500 text-sm">=</span>

            {/* Assembled Compound */}
            <div className="flex-1 bg-white border border-[#2D6A2F] rounded-lg p-1 flex items-center justify-between">
              <div>
                <span className="font-ethiopic font-bold text-lg text-[#2D6A2F] block leading-tight">
                  {compoundResult.fullGeez}
                </span>
                <span className="text-[9px] font-mono-custom text-[#6B6459] block">
                  {compoundResult.arabic}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  soundManager.speakAmharic(compoundResult.amharicName);
                }}
                className="p-1 rounded-md bg-[#FAF6EF] hover:bg-[#F4E4C1] text-[#C8961E] border border-[#DDD3C2] cursor-pointer"
                title="Click listen icon to hear Amharic number"
              >
                <Volume2 size={13} />
              </button>
            </div>
          </div>

          <div className="text-[10px] text-center text-[#6B6459]">
            {compoundResult.tensGeez} ({compoundResult.tens}) + {compoundResult.unitsGeez} ({compoundResult.units}) = {compoundResult.fullGeez} ("{compoundResult.amharicName}")
          </div>
        </div>
      </div>

      {/* Historical note footer */}
      <div className="pt-2 border-t border-[#DDD3C2]/50 text-center text-[10px] text-[#6B6459]">
        Ethiopic numerals have overlines/underlines to distinguish digits from Fidel letters.
      </div>
    </div>
  );
};
