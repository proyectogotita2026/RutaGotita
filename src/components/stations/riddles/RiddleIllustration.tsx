import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { RiddleItem } from '../../../types/riddle.types';
import { Sparkles, Heart } from 'lucide-react';

interface RiddleIllustrationProps {
  riddle: RiddleItem;
  isRevealed: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiddleIllustration: React.FC<RiddleIllustrationProps> = ({
  riddle,
  isRevealed,
  size = 'md',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [imgError, setImgError] = useState(false);

  // Dimensiones según tamaño
  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20 text-3xl',
    md: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-4xl sm:text-5xl',
    lg: 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 text-6xl sm:text-7xl',
  }[size];

  return (
    <div className="relative flex items-center justify-center shrink-0 select-none">
      {/* Resplandor y halo al revelarse */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.45, scale: 1.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F6A6C9] via-[#FFE69A] to-[#BFEBDD] blur-lg pointer-events-none"
        />
      )}

      {/* Contenedor principal con Camafeo acuarela */}
      <motion.div
        animate={
          isRevealed
            ? shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : {
                  scale: [0.85, 1.06, 1],
                  rotate: [0, -3, 2, 0],
                }
            : {
                scale: 1,
              }
        }
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className={`relative ${sizeClasses} rounded-full flex items-center justify-center border-2 transition-all overflow-hidden ${
          isRevealed
            ? 'bg-gradient-to-b from-[#FFF8F3] to-[#FFE3F0] border-[#D9609A]/60 shadow-md'
            : 'bg-[#FFF8F3]/60 border-dashed border-[#D9609A]/30'
        }`}
        style={{
          filter: isRevealed
            ? 'drop-shadow(0 6px 14px rgba(217, 96, 154, 0.25))'
            : 'none',
        }}
      >
        {/* Intento de cargar imagen PNG oficial */}
        {!imgError ? (
          <img
            src={`/assets/images/riddles/${riddle.imagen}`}
            alt={riddle.altText}
            onError={() => setImgError(true)}
            className={`w-[82%] h-[82%] object-contain transition-all duration-700 ${
              isRevealed
                ? 'brightness-100 opacity-100 filter drop-shadow-sm'
                : 'brightness-0 opacity-12 blur-[0.6px]'
            }`}
          />
        ) : (
          /* Fallback visual enriquecido con emoji grande y silueta misteriosa */
          <div className="relative w-full h-full flex items-center justify-center">
            <span
              className={`transition-all duration-700 transform ${
                isRevealed
                  ? 'scale-100 filter-none opacity-100 drop-shadow-xs'
                  : 'scale-90 filter grayscale brightness-0 opacity-15 blur-[0.8px]'
              }`}
            >
              {riddle.emojiFallback}
            </span>
          </div>
        )}

        {/* Destellos y corazoncitos decorativos en Estado B */}
        {isRevealed && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute top-1 right-1 text-[#D9609A] pointer-events-none"
          >
            <Sparkles size={16} />
          </motion.div>
        )}
      </motion.div>

      {/* Mini indicador "?" parpadeante en Estado A sobre la silueta */}
      {!isRevealed && (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FFE3F0] border border-[#D9609A] flex items-center justify-center text-[#D9609A] font-fredoka font-bold text-xs shadow-2xs"
        >
          ?
        </motion.div>
      )}

      {/* Mini insignia con corazón en Estado B */}
      {isRevealed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: 'spring' }}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D9609A] border-2 border-white flex items-center justify-center text-white shadow-2xs"
        >
          <Heart size={11} className="fill-white" />
        </motion.div>
      )}
    </div>
  );
};
