'use client';

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { RetroWindow } from './ui/RetroWindow';
import { ProgressBar } from './ui/ProgressBar';
import { PixelButton } from './ui/PixelButton';
import Image from 'next/image';
import { User, ArrowUpCircle, GraduationCap, Ruler, Heart, Flame, Moon, Coffee, Smile } from 'lucide-react';

export const CharacterCard: React.FC = () => {
  const nextSection = useGameStore((state) => state.nextSection);
  const { playClick } = useAudio();

  const handleNext = () => {
    playClick();
    nextSection();
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-character-page select-none relative"
    >
      {/* Soft overlay to ensure retro windows pop beautifully */}
      <div className="absolute inset-0 bg-[#EFECE6]/35 z-0 pointer-events-none" />
      <RetroWindow title="PROFILE: AWLL" className="max-w-xl shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start select-none">
          {/* Left Column - Avatar Container */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 relative pixel-border bg-[#EAD9B8] p-2 overflow-hidden animate-bobbing">
              <Image
                src="/assets/profile-awll.png"
                alt="Awll Avatar"
                fill
                priority
                sizes="144px"
                className="object-cover image-rendering-pixelated p-1"
              />
            </div>
            {/* Level Label under Avatar */}
            <div
              style={{ transform: 'translateZ(0)' }}
              className="mt-3 px-3 py-1 bg-black text-retro-gold font-press-start text-[10px] pixel-border select-none"
            >
              LV. 20
            </div>
          </div>

          {/* Right Column - Stats Details */}
          <div className="flex-1 w-full text-black flex flex-col justify-between">
            {/* Header Identity - Fully Themed Retro RPG Stat Block */}
            <div className="pb-4 mb-4 font-press-start text-[8.5px] sm:text-[9.5px] leading-relaxed flex flex-col space-y-3 bg-[#FAF6EE] p-4 border-4 border-black shadow-[4px_4px_0px_#000000] pixel-border-inward">
              <div className="grid grid-cols-[75px_15px_1fr] sm:grid-cols-[85px_15px_1fr] items-center">
                <span className="text-gray-600 font-extrabold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-retro-pink shrink-0" /> NAME
                </span>
                <span className="text-gray-600 font-extrabold">:</span>
                <span className="text-retro-navy font-black tracking-wide uppercase">Awll</span>
              </div>
              <div className="grid grid-cols-[75px_15px_1fr] sm:grid-cols-[85px_15px_1fr] items-center">
                <span className="text-gray-600 font-extrabold flex items-center gap-1.5">
                  <ArrowUpCircle className="w-3.5 h-3.5 text-retro-gold shrink-0 animate-pulse" /> LEVEL
                </span>
                <span className="text-gray-600 font-extrabold">:</span>
                <span className="text-retro-purple font-black tracking-wide">20</span>
              </div>
              <div className="grid grid-cols-[75px_15px_1fr] sm:grid-cols-[85px_15px_1fr] items-center">
                <span className="text-gray-600 font-extrabold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-retro-green shrink-0" /> DEPT
                </span>
                <span className="text-gray-600 font-extrabold">:</span>
                <span className="text-retro-navy font-black tracking-wide text-[7px] sm:text-[8.5px] leading-tight uppercase">CIVIL ENGG</span>
              </div>
            </div>

            {/* Dynamic Interactive Stats Progress Bars */}
            <div className="space-y-1 mb-4">
              <ProgressBar label="Semangat" value={999} max={999} colorClass="bg-retro-pink" />
              <ProgressBar label="Tidur" value={2} max={100} colorClass="bg-retro-skyblue" />
              <ProgressBar label="Kopi" value={6} max={10} colorClass="bg-[#8b5a2b]" />
            </div>
          </div>
        </div>

        {/* Bottom Dialogue Box */}
        <div className="mt-4 p-4 bg-[#EAD9B8] pixel-border border-4 border-black text-black flex items-center space-x-4">
          <div className="w-20 h-20 relative shrink-0">
            <Image
              src="/assets/2.png"
              alt="Mascot Cat"
              fill
              sizes="60px"
              className="object-contain"
            />
          </div>
          <p className="font-nunito font-extrabold text-xs sm:text-sm text-retro-navy leading-snug flex items-center gap-1.5">
            <span>Tipikal kuat tapi sebenarnya butuh tidur dan healing</span>
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-6 flex justify-end">
          <PixelButton onClick={handleNext} className="px-6 py-2.5 text-xs sm:text-sm">
            LANJUTIN YUK! ▶
          </PixelButton>
        </div>
      </RetroWindow>
    </div>
  );
};
export default CharacterCard;
