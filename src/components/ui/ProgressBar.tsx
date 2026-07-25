import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: React.ReactNode;
  value: number;
  max: number;
  colorClass: string;
  badge?: string;
  badgeColor?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max,
  colorClass,
  badge,
  badgeColor = 'bg-red-500 text-white',
  animated = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col w-full my-2.5">
      <div className="flex justify-between items-center mb-1.5">
        {/* Retro Label */}
        <div className="font-press-start text-[9px] uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
          {label}
          {badge && (
            <span
              className={`px-1.5 py-0.5 text-[7px] font-black rounded-sm border border-black shadow-[1px_1px_0px_#000] animate-pulse ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
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
          className={`h-full border-r-4 border-black/35 ${colorClass} relative overflow-hidden`}
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 50%, rgba(0, 0, 0, 0.15) 50%)',
          }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default ProgressBar;
