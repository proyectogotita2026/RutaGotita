import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { gotaValienteImg } from '../../../assets/images';



interface MascotBubbleProps {
  isTimeFinished?: boolean;
  isRunning?: boolean;
}

export const MascotBubble: React.FC<MascotBubbleProps> = ({
  isTimeFinished = false,
  isRunning = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  let speechText = '¡Vamos, equipo, a armar el rompecabezas! 🧩';
  if (isTimeFinished) {
    speechText = '¡Gran trabajo en equipo! ¡Misión completada! 🏆';
  } else if (isRunning) {
    speechText = '¡Concentración y mucho amor, ustedes pueden! ✨';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full max-w-[420px] mx-auto py-2">
      {/* Globo grande y legible (Fredoka 20px) con pico apuntando a la Gotita */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl bg-white/95 px-5 py-3 border-2 border-[#FFC857] shadow-sm mb-3 max-w-[340px] text-center"
      >
        <p className="text-lg lg:text-xl font-fredoka font-bold text-[#3B2A5C] leading-snug">
          {speechText}
        </p>
        {/* Pico apuntando hacia abajo hacia la Gotita */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 z-20 pointer-events-none"
          style={{
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderTop: '10px solid #ffffff',
          }}
        />
        <div
          className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 z-10 pointer-events-none"
          style={{
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '11px solid #FFC857',
          }}
        />
      </motion.div>

      {/* Escena de la Gotita Grande e Isla Ilustrada */}
      <div className="relative flex flex-col items-center justify-center w-full">
        {/* Isla de pasto y flores */}
        <div className="absolute -bottom-2 w-64 sm:w-72 lg:w-80 h-10 bg-gradient-to-r from-[#BFEBDD]/70 via-[#FFE69A]/60 to-[#F6A6C9]/50 rounded-[50%] blur-xl pointer-events-none" />
        <div className="absolute -bottom-1.5 w-60 sm:w-68 lg:w-72 h-8 bg-gradient-to-t from-[#BFEBDD] to-[#E2F7EF] rounded-[50%] border border-white/70 shadow-xs pointer-events-none flex items-center justify-around px-6 overflow-hidden">
          <span className="text-sm opacity-80">🌸</span>
          <span className="text-sm opacity-70">🌼</span>
          <span className="text-sm opacity-80">🌸</span>
        </div>

        {/* Gotita Valiente LIBRE (sin marco circular ni fondo artificial) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -8, 0],
                }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(224,138,0,0.22)]"
        >
          <img
            src={gotaValienteImg}
            alt="La Gotita Valiente"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </motion.div>

        {/* Sombra ovalada interactiva */}
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
          className="w-44 sm:w-52 h-3.5 bg-[#E08A00]/25 rounded-full blur-[2px] mt-1 z-10"
        />
      </div>
    </div>
  );
};
