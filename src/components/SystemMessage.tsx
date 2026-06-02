'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { RetroWindow } from './ui/RetroWindow';
import { PixelButton } from './ui/PixelButton';
import { Terminal, Heart, Sparkles, Smile, Zap, GraduationCap, CheckCircle, Shield, Coffee, HelpCircle } from 'lucide-react';
import Image from 'next/image';

interface BuffType {
  text: string;
  desc: string;
  icon: React.ReactNode;
}

const BUFF_LIST: BuffType[] = [
  { text: '+100 Keberuntungan', desc: 'Semua revisi gambar auto di-ACC dosen dalam sekali coba.', icon: <Sparkles className="w-6 h-6 text-retro-gold fill-current" /> },
  { text: 'Deadline Resistance +50%', desc: 'Kekebalan ekstra terhadap tugas dadakan di jam 11 malam.', icon: <Zap className="w-6 h-6 text-amber-500 fill-current animate-pulse" /> },
  { text: 'Dosen Friendly Buff Activated', desc: 'Dosen pembimbing mendadak ramah dan hobi ngasih nilai A.', icon: <GraduationCap className="w-6 h-6 text-retro-navy" /> },
  { text: 'Auto Lulus Praktikum', desc: 'Beton praktikum langsung teruji kokoh tanpa retak sehelai pun.', icon: <CheckCircle className="w-6 h-6 text-retro-green" /> },
  { text: 'Concrete Strength +999', desc: 'Kekuatan fisik dan mental setara beton mutu K-500.', icon: <Shield className="w-6 h-6 text-blue-500 fill-current" /> },
  { text: 'Unlimited Kopi For Today', desc: 'Kafein tanpa batas, lambung tetap aman sentosa.', icon: <Coffee className="w-6 h-6 text-[#8b5a2b] fill-current" /> },
];

export const SystemMessage: React.FC = () => {
  const { nextSection } = useGameStore();
  const { playClick, playUnlock } = useAudio();
  
  const [messages, setMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [showBuff, setShowBuff] = useState(false);
  const [randomBuff, setRandomBuff] = useState<BuffType>({ text: '', desc: '', icon: <Sparkles /> });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const textLines = [
    "Makasih ya udah jadi orang baik selama ini. 💙",
    "Semoga semua usaha dan lelahmu gak sia-sia, pelan-pelan terbayar. ✨",
    "Semoga tahun ini jadi tahun yang lebih ringan, lebih bahagia, dan penuh hal baik.",
    "Dan... maaf kalau aku pernah bikin kamu gak nyaman atau kecewa 🙏",
    "// Always proud of you, Awll!"
  ];

  // Typewriter logic line-by-line
  useEffect(() => {
    if (currentIndex < textLines.length) {
      const line = textLines[currentIndex];
      let charIndex = 0;
      setTypingText('');

      const interval = setInterval(() => {
        if (charIndex < line.length) {
          setTypingText((prev) => prev + line.charAt(charIndex));
          charIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setMessages((prev) => [...prev, line]);
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setTypingText('');
          }, 800);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setTypingComplete(true);
      
      const chosenBuff = BUFF_LIST[Math.floor(Math.random() * BUFF_LIST.length)];
      setRandomBuff(chosenBuff);
      setTimeout(() => {
        setShowBuff(true);
        playUnlock();
      }, 800);
    }
  }, [currentIndex]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  const handleNext = () => {
    playClick();
    nextSection();
  };

  const renderLineWithIcons = (line: string) => {
    if (line.includes('💙')) {
      const parts = line.split('💙');
      return (
        <span className="flex items-center flex-wrap gap-1">
          <span>{parts[0]}</span>
          <Heart className="w-4 h-4 text-retro-skyblue fill-current inline-block shrink-0 animate-pulse" />
          <span>{parts[1]}</span>
        </span>
      );
    }
    if (line.includes('✨')) {
      const parts = line.split('✨');
      return (
        <span className="flex items-center flex-wrap gap-1">
          <span>{parts[0]}</span>
          <Sparkles className="w-4 h-4 text-retro-gold fill-current inline-block animate-pulse shrink-0" />
          <span>{parts[1]}</span>
        </span>
      );
    }
    if (line.includes('🙏')) {
      const parts = line.split('🙏');
      return (
        <span className="flex items-center flex-wrap gap-1">
          <span>{parts[0]}</span>
          <Smile className="w-4 h-4 text-retro-navy inline-block shrink-0" />
          <span>{parts[1]}</span>
        </span>
      );
    }
    return <span>{line}</span>;
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-[#090b14] relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(#141829 2px, transparent 2px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Cozy ambient decorations matching design */}
      {/* Bottom-left: Cat, Signboard & Coffee Mug */}
      <div className="absolute bottom-4 left-4 flex items-end gap-3 z-10 select-none pointer-events-none scale-75 sm:scale-100 origin-bottom-left">
        {/* Wooden Sign "JANGAN LUPA MINUM!" */}
        <div className="flex flex-col items-center">
          <div className="bg-[#8B5A2B] border-4 border-black text-[#FAF6EE] p-2 pixel-border text-center w-24 relative select-none shadow-md">
            <span className="font-press-start text-[6px] leading-tight block">
              JANGAN LUPA MINUM!
            </span>
          </div>
          {/* Post */}
          <div className="w-2.5 h-6 bg-[#5c3a21] border-x-4 border-black -mt-1" />
        </div>

        {/* Cute Cat mascot sitting */}
        <div className="w-16 h-16 relative">
          <Image
            src="/assets/2.png"
            alt="Mascot Cat Ambient"
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>

        {/* Blue Coffee Mug */}
        <div className="w-8 h-8 bg-retro-skyblue border-4 border-black relative rounded-t-sm rounded-b-md flex justify-end items-center mb-0.5 shadow-md">
          {/* Handle */}
          <div className="absolute -right-3 w-3 h-5 border-4 border-black border-l-0 rounded-r-md bg-transparent" />
        </div>
      </div>

      {/* Bottom-right: Potted Plant */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center z-10 select-none pointer-events-none scale-75 sm:scale-100 origin-bottom-right">
        {/* Leaves */}
        <div className="flex -space-x-2 -mb-1 animate-pulse">
          <div className="w-8 h-10 bg-retro-green border-4 border-black rounded-full rotate-[-15deg]" />
          <div className="w-7 h-9 bg-[#2e7d32] border-4 border-black rounded-full rotate-[10deg]" />
          <div className="w-6 h-8 bg-retro-green border-4 border-black rounded-full rotate-[-45deg]" />
        </div>
        {/* Pot */}
        <div className="w-8 h-8 bg-[#cd853f] border-4 border-black rounded-b-xl relative">
          {/* Pot Rim */}
          <div className="absolute -top-1 -left-1 w-8 h-2.5 bg-[#cd853f] border-4 border-black" />
        </div>
      </div>

      <RetroWindow title="SYSTEM MESSAGE" className="max-w-xl shadow-2xl relative z-10">
        
        {/* Terminal/Chat Window Display with Neon Glow */}
        <div className="bg-[#0C101B] border-4 border-retro-skyblue/70 p-4 pixel-border-inward flex flex-col gap-3 min-h-[260px] max-h-[320px] select-none overflow-y-auto shadow-[0_0_15px_rgba(78,168,222,0.25)] scrollbar-thin scrollbar-thumb-retro-skyblue">
          
          {/* System notification bar */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-1 text-gray-500 shrink-0 font-mono text-[10px] sm:text-xs">
            <Terminal className="w-3.5 h-3.5 text-retro-skyblue animate-pulse" />
            <span>&lt;&lt; SYSTEM MESSAGE &gt;&gt;</span>
          </div>

          {/* Bubbles flex container */}
          <div className="flex flex-col gap-3 items-start w-full">
            {messages.map((line, idx) => {
              if (line.startsWith('//')) {
                return (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-retro-green font-mono font-bold text-xs sm:text-sm mt-2 tracking-wide select-text"
                  >
                    {line}
                  </motion.p>
                );
              }
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="bg-white text-gray-800 px-4 py-2.5 rounded-2xl border-4 border-black font-nunito font-extrabold text-xs sm:text-sm max-w-[90%] shadow-[3px_3px_0px_rgba(0,0,0,0.15)] relative select-text"
                >
                  {/* Speech bubble arrow pointer on bottom-left */}
                  <div className="absolute bottom-2 -left-[14px] w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black pointer-events-none" />
                  <div className="absolute bottom-2.5 -left-[7px] w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white pointer-events-none z-10" />
                  
                  {renderLineWithIcons(line)}
                </motion.div>
              );
            })}

            {/* Line currently typing inside bubble */}
            {typingText && (
              typingText.startsWith('//') ? (
                <p className="text-retro-green font-mono font-bold text-xs sm:text-sm mt-2 tracking-wide">
                  {typingText}
                  <span className="w-1.5 h-4 bg-retro-green inline-block animate-pulse ml-0.5" />
                </p>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white text-gray-800 px-4 py-2.5 rounded-2xl border-4 border-black font-nunito font-extrabold text-xs sm:text-sm max-w-[90%] shadow-[3px_3px_0px_rgba(0,0,0,0.15)] flex items-center relative"
                >
                  {/* Speech bubble arrow pointer */}
                  <div className="absolute bottom-2 -left-[14px] w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black pointer-events-none" />
                  <div className="absolute bottom-2.5 -left-[7px] w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white pointer-events-none z-10" />
                  
                  {renderLineWithIcons(typingText)}
                  <span className="w-1.5 h-4 bg-gray-800 inline-block animate-pulse ml-1 shrink-0" />
                </motion.div>
              )
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Easter Egg Birthday Buff Alert Popup */}
        <AnimatePresence>
          {showBuff && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="mt-5 p-4 border-4 border-black bg-retro-beigedark text-black pixel-border flex items-start gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-1 bg-black text-retro-gold font-press-start text-[7px] uppercase tracking-wider">
                Buff Active
              </div>
              <div className="p-2.5 border-4 border-black bg-retro-gold text-black shrink-0 animate-bounce relative">
                {randomBuff.icon}
              </div>
              <div className="flex-1 select-none font-nunito">
                <h3 className="font-press-start text-[8px] sm:text-[9px] text-retro-navy mb-1.5 leading-snug flex items-center gap-1">
                  <span>EASTER EGG BUFF ACTIVATED!</span>
                  <Sparkles className="w-3 h-3 text-retro-purple animate-pulse" />
                </h3>
                <p className="font-extrabold text-sm text-retro-purple mb-1 leading-snug">
                  {randomBuff.text}
                </p>
                <p className="text-[11px] font-bold text-gray-700 leading-snug">
                  {randomBuff.desc}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Button */}
        {typingComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-center w-full"
          >
            <PixelButton onClick={handleNext} className="w-full py-4 text-xs sm:text-sm">
              LANJUT YAA ➔
            </PixelButton>
          </motion.div>
        )}
      </RetroWindow>
    </div>
  );
};
export default SystemMessage;
