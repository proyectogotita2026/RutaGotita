import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { gotaGenerosaImg } from '../../../assets/images';

interface RiddleMascotProps {
  isRevealed: boolean;
  variant?: 'mobile' | 'desktop';
}

export const RiddleMascot: React.FC<RiddleMascotProps> = ({
  isRevealed,
  variant = 'mobile',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [loadErrorThinking, setLoadErrorThinking] = useState(false);
  const [loadErrorHappy, setLoadErrorHappy] = useState(false);

  // Rutas esperadas en assets
  const thinkingSrc = '/assets/estacion4/gotita-pensando.png';
  const happySrc = '/assets/estacion4/gotita-feliz.png';

  const isThinkingFailed = loadErrorThinking;
  const isHappyFailed = loadErrorHappy;

  // ============================================================
  // VARIANTE MÓVIL VERTICAL (72-96px, SIN círculo ni recuadro)
  // ============================================================
  if (variant === 'mobile') {
    return (
      <div className="relative shrink-0 flex items-center justify-center select-none w-20 sm:w-24 h-20 sm:h-24">
        <motion.div
          animate={
            isRevealed && !shouldReduceMotion
              ? {
                  y: [0, -8, 0],
                  scale: [1, 1.06, 1],
                }
              : shouldReduceMotion
                ? undefined
                : {
                    rotate: [-1.5, 1.5, -1.5],
                    y: [0, -2, 0],
                  }
          }
          transition={
            isRevealed
              ? { duration: 0.5, ease: 'easeOut' }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative w-full h-full flex items-center justify-center"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(217, 96, 154, 0.35))',
          }}
        >
          {isRevealed ? (
            /* Estado B: Gotita feliz */
            !isHappyFailed ? (
              <img
                src={happySrc}
                alt="Gotita feliz"
                width={96}
                height={96}
                onError={() => setLoadErrorHappy(true)}
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <img
                src={gotaGenerosaImg}
                alt="La Gotita Generosa"
                width={96}
                height={96}
                className="w-full h-full object-contain pointer-events-none"
              />
            )
          ) : (
            /* Estado A: Gotita pensando */
            !isThinkingFailed ? (
              <img
                src={thinkingSrc}
                alt="Gotita pensando"
                width={96}
                height={96}
                onError={() => setLoadErrorThinking(true)}
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <img
                src={gotaGenerosaImg}
                alt="La Gotita Generosa"
                width={96}
                height={96}
                className="w-full h-full object-contain pointer-events-none"
              />
            )
          )}
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // VARIANTE TABLET / DESKTOP (≥768px): Gotita Grande sobre Isla
  // ============================================================
  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full max-w-[380px] mx-auto py-2">
      {/* Isla de pasto y flores rosa/menta */}
      <div className="relative flex flex-col items-center justify-center w-full">
        <div className="absolute -bottom-2 w-64 sm:w-72 h-10 bg-gradient-to-r from-[#BFEBDD]/60 via-[#F6A6C9]/50 to-[#FFE69A]/40 rounded-[50%] blur-xl pointer-events-none" />
        <div className="absolute -bottom-1 w-60 sm:w-68 h-7 bg-gradient-to-t from-[#FEE8F3] to-[#FFF0F7] rounded-[50%] border border-white/70 shadow-xs pointer-events-none flex items-center justify-around px-6 overflow-hidden">
          <span className="text-sm opacity-80">🌸</span>
          <span className="text-sm opacity-70">💖</span>
          <span className="text-sm opacity-80">🌸</span>
        </div>

        {/* Gotita GRANDE (40-50vh) directa, sin círculos ni marcos */}
        <motion.div
          animate={
            isRevealed && !shouldReduceMotion
              ? {
                  y: [0, -12, 0],
                  scale: [1, 1.05, 1],
                }
              : shouldReduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
          }
          transition={
            isRevealed
              ? { duration: 0.6, ease: 'easeOut' }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center"
          style={{
            filter: 'drop-shadow(0 10px 22px rgba(217, 96, 154, 0.3))',
          }}
        >
          {isRevealed ? (
            !isHappyFailed ? (
              <img
                src={happySrc}
                alt="Gotita feliz"
                width={256}
                height={256}
                onError={() => setLoadErrorHappy(true)}
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <img
                src={gotaGenerosaImg}
                alt="La Gotita Generosa"
                width={256}
                height={256}
                className="w-full h-full object-contain pointer-events-none"
              />
            )
          ) : (
            !isThinkingFailed ? (
              <img
                src={thinkingSrc}
                alt="Gotita pensando"
                width={256}
                height={256}
                onError={() => setLoadErrorThinking(true)}
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <img
                src={gotaGenerosaImg}
                alt="La Gotita Generosa"
                width={256}
                height={256}
                className="w-full h-full object-contain pointer-events-none"
              />
            )
          )}
        </motion.div>

        {/* Sombra suave ovalada */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 0.9, 1],
                  opacity: [0.35, 0.2, 0.35],
                }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-44 sm:w-52 h-3.5 bg-[#D9609A]/20 rounded-full blur-[2px] mt-1 z-10"
        />
      </div>
    </div>
  );
};
