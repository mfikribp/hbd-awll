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
    <div className="flex flex-col w-full my-2 font-nunito">
      <div className="flex justify-between items-center mb-1 text-sm font-bold">
        <span className="tracking-wide uppercase text-gray-700">{label}</span>
        <span className="font-mono text-gray-900">{value} / {max}</span>
      </div>
      <div className="w-full bg-gray-300 border-4 border-black h-8 relative pixel-border-inward overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`h-full ${colorClass}`}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
