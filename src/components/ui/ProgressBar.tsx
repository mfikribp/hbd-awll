import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  colorClass: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max, colorClass }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col w-full my-3">
      <div className="flex justify-between items-center mb-1.5">
        {/* Retro Label */}
        <span className="font-press-start text-[9px] uppercase tracking-wider text-gray-700">
          {label}
        </span>
        {/* Retro Values */}
        <span className="font-press-start text-[9px] text-gray-900 tracking-tighter">
          {value} / {max}
        </span>
      </div>
      {/* Heavy 3D Retro Inward Border */}
      <div className="w-full bg-[#EAD9B8] border-4 border-black h-7 relative pixel-border-inward overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`h-full border-r-4 border-black/35 ${colorClass}`}
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.15) 50%, rgba(0, 0, 0, 0.1) 50%)',
          }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
