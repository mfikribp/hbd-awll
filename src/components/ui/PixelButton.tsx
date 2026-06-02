import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'gold' | 'blue' | 'pink' | 'disabled';
  disabled?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'gold',
  disabled = false,
}) => {
  const { playClick } = useAudio();

  const getVariantClass = () => {
    if (disabled || variant === 'disabled') return 'pixel-button-disabled';
    switch (variant) {
      case 'blue':
        return 'pixel-button-blue';
      case 'pink':
        return 'pixel-button-pink';
      case 'gold':
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (disabled) return;
    playClick();
    if (onClick) onClick();
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={handleClick}
      className={`pixel-button ${getVariantClass()} ${className}`}
    >
      {children}
    </motion.button>
  );
};
export default PixelButton;
