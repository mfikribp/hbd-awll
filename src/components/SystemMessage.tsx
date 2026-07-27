'use client';

import { motion } from 'framer-motion';
import { Heart, Smile, Sparkles, Terminal } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useGameStore } from '../store/useGameStore';
import { PixelButton } from './ui/PixelButton';
import { RetroWindow } from './ui/RetroWindow';



export const SystemMessage: React.FC = () => {
  const { nextSection } = useGameStore();
  const { playClick } = useAudio();

  const [messages, setMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const textLines = [
    "awll@birthday:~$ run check-status.sh",
    "[SYSTEM] Initializing Life Status Analysis...",
    "[SYSTEM] Level 20 reached successfully! 🎂",
    "awll@birthday:~$ cat wishes_for_awll.txt",
    "HAPPY 20TH BIRTHDAYYY🥳🎉",
    "tetaplah menjadi orang yang selama ini bikin aku penasaran dan tertarik buat mengenal kamu lebih jauh. tetaplah menjadi pribadi yang hangat, baik, dan selalu membawa kenyamanan buat orang-orang di sekitarmu",
    "semoga di usia yang baru ini kamu selalu diberi kesehatan dan kebahagiaan, serta langkah yang semakin mendekatkanmu pada semua impian yang selama ini kamu panjatkan dalam doa. semoga segala hal baik selalu ada buat kamu, dan semoga setiap perjalanan yang kamu lalui nantinya dipenuhi cerita-cerita yang indah",
    "...",
    "aku mau minta maaf, maaff bangettt udah chat kamu lagi",
    "aku juga mau bilang makasih sama kamu, karena kamu ngasih jawaban yang jelas. MAKAAASIIHHH BANGEETT",
    "TETAP SEMANGAT KULIAH DAN KERJANYA, JANGAN LUPA MAKAN, JANGAN LUPA BUAT ISTIRAHAT, SATU LAGI JANGAN LUPA BUAT OLAHRAGA!",
    "sorry and thnk you, i just wanna say 'HAPPY BIRTHDAY AWLL'",
    "awll@birthday:~$ execute proud-mode.sh --always",
    "// always proud of you, awll! 💚",
    "[SYSTEM] Birthday messages loaded successfully!"
  ];

  // Typewriter logic line-by-line
  useEffect(() => {
    if (currentIndex < textLines.length) {
      const line = textLines[currentIndex];
      const isCommand = line.startsWith("awll@birthday:~$");
      const prefix = isCommand ? "awll@birthday:~$ " : "";
      const actualTextToType = isCommand ? line.replace("awll@birthday:~$ ", "") : line;

      let charIndex = 0;
      setTypingText(prefix);

      const interval = setInterval(() => {
        if (charIndex < actualTextToType.length) {
          setTypingText(prefix + actualTextToType.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setMessages((prev) => [...prev, line]);
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setTypingText('');
          }, 800);
        }
      }, 55);

      return () => clearInterval(interval);
    } else {
      setTypingComplete(true);
    }
  }, [currentIndex]);

  // Scroll to bottom on new messages (highly reliable DOM implementation for mobile)
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages, typingText]);

  const handleNext = () => {
    playClick();
    nextSection();
  };

  const renderLineWithIcons = (line: string, cursor: React.ReactNode = null) => {
    if (line.includes('💚')) {
      const parts = line.split('💚');
      return (
        <span className="flex items-center flex-wrap gap-1">
          <span>{parts[0]}</span>
          <Heart className="w-4 h-4 text-retro-green fill-current inline-block shrink-0 animate-pulse" />
          <span>{parts[1]}</span>
          {cursor}
        </span>
      );
    }
    if (line.includes('💙')) {
      const parts = line.split('💙');
      return (
        <span className="flex items-center flex-wrap gap-1">
          <span>{parts[0]}</span>
          <Heart className="w-4 h-4 text-retro-skyblue fill-current inline-block shrink-0 animate-pulse" />
          <span>{parts[1]}</span>
          {cursor}
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
          {cursor}
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
          {cursor}
        </span>
      );
    }
    return (
      <>
        {line}
        {cursor}
      </>
    );
  };

  const renderTerminalLine = (line: string, isCurrentTyping: boolean = false) => {
    const fullLine = isCurrentTyping && currentIndex < textLines.length ? textLines[currentIndex] : line;

    // Typewriter cursor inline inside the terminal text
    const cursor = isCurrentTyping ? (
      <span className="w-2 h-4 bg-retro-green inline-block animate-pulse ml-1 shrink-0 align-middle" />
    ) : null;

    if (fullLine.startsWith("awll@birthday:~$")) {
      // Remove prefix from the typed content to prevent double-rendering if any
      const command = line.startsWith("awll@birthday:~$")
        ? line.replace("awll@birthday:~$", "").trimStart()
        : line.trimStart();
      return (
        <div className="font-mono text-xs sm:text-sm select-text flex flex-wrap gap-x-1.5 leading-relaxed shrink-0 break-words whitespace-pre-wrap">
          <span className="text-retro-green font-bold">awll@birthday</span>
          <span className="text-retro-pink font-bold">:~$</span>
          <span className="text-white font-semibold flex items-center flex-wrap">
            {command}
            {cursor}
          </span>
        </div>
      );
    }

    if (fullLine.startsWith("[SYSTEM]")) {
      return (
        <div className="font-mono text-xs sm:text-sm text-retro-skyblue select-text leading-relaxed pl-2 shrink-0 break-words whitespace-pre-wrap">
          {renderLineWithIcons(line, cursor)}
        </div>
      );
    }

    if (fullLine.startsWith("//")) {
      return (
        <div className="font-mono text-xs sm:text-sm text-retro-green font-extrabold select-text leading-relaxed pl-2 shrink-0 animate-pulse break-words whitespace-pre-wrap">
          {renderLineWithIcons(line, cursor)}
        </div>
      );
    }

    // Default terminal response output (standard wishes text)
    return (
      <div className="font-mono text-xs sm:text-sm text-gray-200 select-text pl-4 leading-relaxed border-l-2 border-retro-skyblue/30 shrink-0 break-words whitespace-pre-wrap">
        {renderLineWithIcons(line, cursor)}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-[url(/assets/mobile/bg-system-message-mobile.png)] md:bg-[url(/assets/dekstop/bg-system-message-dekstop.png)] bg-cover bg-center bg-no-repeat relative overflow-hidden"
    >
      {/* Cozy ambient decorations matching design */}
      {/* Bottom-left: Signboard, Dino and Cat mascots sitting side-by-side */}
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

        {/* Cozy Mascots snugged closer together */}
        <div className="flex -space-x-3 items-end">
          {/* Cute Dino mascot */}
          <div className="w-16 h-16 relative">
            <Image
              src="/assets/mascot/png/dino.png"
              alt="Mascot Dino Ambient"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>

          {/* Cute Cat mascot */}
          <div className="w-16 h-16 relative">
            <Image
              src="/assets/mascot/png/cat.png"
              alt="Mascot Cat Ambient"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-xl">
        {/* Animated Mascot Cat Sitting on Top of the Window Header Frame */}
        <div
          className="absolute -top-[86px] right-8 w-28 h-28 z-20 pointer-events-none select-none"
        >
          <img
            src="/assets/mascot/gif/cat.gif"
            alt="Mascot Cat"
            className="w-full h-full object-contain"
          />
        </div>

        <RetroWindow title="SYSTEM MESSAGE" className="shadow-2xl relative z-10">

          {/* Terminal/Chat Window Display with Neon Glow */}
          <div
            ref={terminalRef}
            className="bg-[#0C101B] border-4 border-retro-skyblue/70 p-4 pixel-border-inward flex flex-col gap-3 min-h-[260px] max-h-[320px] select-none overflow-y-auto shadow-[0_0_15px_rgba(78,168,222,0.25)] scrollbar-thin scrollbar-thumb-retro-skyblue"
          >

            {/* System notification bar */}
            <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-1 text-gray-500 shrink-0 font-mono text-[10px] sm:text-xs">
              <Terminal className="w-3.5 h-3.5 text-retro-skyblue animate-pulse" />
              <span>&lt;&lt; SYSTEM MESSAGE &gt;&gt;</span>
            </div>

            {/* UNIX Terminal Shell Console Display */}
            <div className="flex flex-col gap-2.5 items-start w-full">
              {messages.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-full"
                >
                  {renderTerminalLine(line)}
                </motion.div>
              ))}

              {/* Line currently typing in console with flashing cursor */}
              {typingText && (
                <div className="w-full">
                  {renderTerminalLine(typingText, true)}
                </div>
              )}
            </div>
          </div>



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
    </div>
  );
};
export default SystemMessage;
