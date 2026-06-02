'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const WalkingMascots: React.FC = () => {
  return (
    <div className="fixed bottom-2 left-0 right-0 h-16 pointer-events-none z-40 overflow-hidden select-none">

      {/* 🦖 Walking Dino */}
      <motion.div
        className="absolute bottom-0 w-12 h-12"
        animate={{
          x: ['-15vw', '115vw', '115vw', '-15vw', '-15vw'],
          scaleX: [1, 1, -1, -1, 1], // Faces right first, then flips to face left
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Step Bobbing Child Container */}
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full relative"
        >
          <Image
            src="/assets/1.png"
            alt="Walking Dino"
            fill
            sizes="48px"
            className="object-contain"
          />
        </motion.div>
      </motion.div>
 
      {/* 🐱 Walking Cat */}
      <motion.div
        className="absolute bottom-0 w-10 h-10"
        animate={{
          x: ['115vw', '-15vw', '-15vw', '115vw', '115vw'],
          scaleX: [-1, -1, 1, 1, -1], // Faces left first (scaleX -1), then flips to face right (scaleX 1)
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'linear',
          delay: 2, // Slight delay so they do not overlap immediately
        }}
      >
        {/* Step Bobbing Child Container */}
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full relative"
        >
          <Image
            src="/assets/2.png"
            alt="Walking Cat"
            fill
            sizes="40px"
            className="object-contain"
          />
        </motion.div>
      </motion.div>

    </div>
  );
};
export default WalkingMascots;
