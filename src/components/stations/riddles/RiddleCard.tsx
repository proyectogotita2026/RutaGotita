import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { RiddleItem } from '../../../types/riddle.types';
import { AnswerReveal } from './AnswerReveal';
import { RiddleMascot } from './RiddleMascot';
import { Heart } from 'lucide-react';

interface RiddleCardProps {
  riddle: RiddleItem;
  isRevealed: boolean;
  onReveal: () => void;
  variant?: 'mobile' | 'desktop' | 'compact';
}

export const RiddleCard: React.FC<RiddleCardProps> = ({
  riddle,
  isRevealed,
  onReveal,
  variant = 'mobile',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = variant === 'desktop';
  const isCompact = variant === 'compact';

  return (
    <div className="relative w-full flex flex-col justify-between gap-2.5 sm:gap-3 select-none">
      {/* ======================================================== */}
      {/* 1. NUBE DE DIÁLOGO (+ Gotita a la izquierda en móvil)     */}
      {/* ======================================================== */}
      {variant === 'mobile' ? (
        /* Modo Móvil: Gotita 64-80px a la izquierda + Nube a la derecha */
        <div className="flex items-start gap-2.5 w-full">
          <div className="pt-1 shrink-0">
            <RiddleMascot isRevealed={isRevealed} variant="mobile" />
          </div>

          <motion.div
            animate={
              isRevealed && !shouldReduceMotion
                ? { scale: [1, 1.015, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1 min-w-0 watercolor-glass-card rounded-[28px] p-3 sm:p-4 border-2 border-dashed border-[#F6A6C9] relative shadow-xs"
          >
            {/* Pico de la nube apuntando a la Gotita */}
            <div
              className="absolute top-5 -left-2.5 w-0 h-0 z-20 pointer-events-none"
              style={{
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '8px solid #FFF8F3',
              }}
            />

            {/* Texto de la adivinanza Nunito clamp(15px, 4.2vw, 18px) */}
            <p className="text-[clamp(14px,3.8vw,17px)] font-sans font-medium text-[#3B2A5C] leading-snug">
              {riddle.texto}
            </p>

            {/* Pregunta en Fredoka lila clamp(20px, 5.5vw, 26px) */}
            <h3 className="mt-1.5 text-[clamp(18px,4.8vw,23px)] font-fredoka font-black text-[#6B4FA8] tracking-tight leading-tight">
              {riddle.pregunta}
            </h3>
          </motion.div>
        </div>
      ) : (
        /* Modo Desktop / Compact: Nube grande */
        <motion.div
          animate={
            isRevealed && !shouldReduceMotion
              ? { scale: [1, 1.015, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`watercolor-glass-card rounded-[28px] ${
            isCompact ? 'p-3' : 'p-5 md:p-6 lg:p-7'
          } border-2 border-dashed border-[#F6A6C9] relative overflow-hidden shadow-xs flex flex-col justify-between`}
        >
          {/* Logo sutil solo en desktop ≥768px */}
          {isDesktop && (
            <div className="flex items-center gap-1.5 absolute top-3.5 right-5 text-xs font-fredoka font-bold text-[#D9609A]/80 uppercase tracking-wider">
              <Heart size={14} className="fill-[#F6A6C9]" />
              <span>La Ruta de la Gotita</span>
            </div>
          )}

          {/* Pico de la nube a la izquierda */}
          <div
            className="hidden md:block absolute top-10 -left-3 w-0 h-0 z-20 pointer-events-none"
            style={{
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '12px solid #FFF8F3',
            }}
          />

          {/* Texto de la adivinanza */}
          <p
            className={`${
              isCompact
                ? 'text-[clamp(13px,2.6vw,16px)]'
                : 'text-lg md:text-[22px] lg:text-[24px]'
            } font-sans font-medium text-[#3B2A5C] leading-snug sm:leading-relaxed`}
          >
            {riddle.texto}
          </p>

          {/* Pregunta en Fredoka Lila */}
          <h3
            className={`${
              isCompact
                ? 'text-[clamp(17px,3.6vw,21px)] mt-1.5'
                : 'text-2xl md:text-3xl lg:text-[34px] mt-3'
            } font-fredoka font-black text-[#6B4FA8] tracking-tight leading-tight`}
          >
            {riddle.pregunta}
          </h3>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* 2. TARJETA DE RESPUESTA: Píldora en Estado A / Fila en B */}
      {/* (UNA SOLA INSTANCIA DE LA ILUSTRACIÓN, NUNCA DUPLICADA)  */}
      {/* ======================================================== */}
      <div className="w-full">
        <AnswerReveal
          riddle={riddle}
          isRevealed={isRevealed}
          onRevealClick={onReveal}
          isDesktop={isDesktop}
        />
      </div>
    </div>
  );
};
