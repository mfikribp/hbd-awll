import React from 'react';
import { motion } from 'framer-motion';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({ title, children, className = '', onClose }) => {
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.96, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`bg-retro-beige text-black pixel-border w-full max-w-lg mx-auto flex flex-col ${className}`}
    >
      {/* Title Bar */}
      <div className="bg-retro-beigedark px-3 py-2 flex items-center justify-between border-b-4 border-black select-none">
        <div className="flex space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] border-2 border-black inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border-2 border-black inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] border-2 border-black inline-block" />
        </div>
        <span className="font-press-start text-[10px] sm:text-xs font-bold tracking-tight text-center truncate px-2">
          {title}
        </span>
        <div className="flex space-x-2 text-xs font-bold select-none cursor-pointer">
          <span className="hover:text-red-500 font-extrabold">─</span>
          <span className="hover:text-yellow-600 font-extrabold">🗖</span>
          <span onClick={onClose} className="hover:text-red-600 font-extrabold ml-1">🗙</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col font-nunito font-semibold bg-[#FAF6EE]">
        {children}
      </div>
    </motion.div>
  );
};
export default RetroWindow;
