import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { RiddleItem } from '../../../types/riddle.types';
import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

interface AnswerRevealProps {
  riddle: RiddleItem;
  isRevealed: boolean;
  onRevealClick?: () => void;
  isDesktop?: boolean;
}

export const AnswerReveal: React.FC<AnswerRevealProps> = ({
  riddle,
  isRevealed,
  onRevealClick,
  isDesktop = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [imgError, setImgError] = useState(false);

  // Ruta oficial en /assets/estacion4/
  const imageSrc = `/assets/estacion4/${riddle.imagen}`;

  return (
    <div
      role="region"
      aria-live="polite"
      className="relative w-full max-h-[110px] md:max-h-[140px] flex items-center justify-center select-none"
    >
      {!isRevealed ? (
        /* ======================================================== */
        /* ESTADO A: PÍLDORA MISTERIOSA CON "?" Y SILUETA CSS      */
        /* ======================================================== */
        <motion.button
          type="button"
          onClick={onRevealClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-[68px] sm:h-[76px] rounded-2xl bg-gradient-to-r from-[#FFF8F3] via-[#FFE3F0]/60 to-[#FFF8F3] border-2 border-dashed border-[#D9609A]/40 px-3.5 py-2 flex items-center justify-between gap-3 shadow-2xs hover:border-[#D9609A]/70 transition-all cursor-pointer group"
          aria-label="Respuesta oculta. Haz clic para descubrirla."
        >
          {/* Lado izquierdo: Icono ? parpadeante + Texto de invitación */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#FFE3F0] border border-[#F6A6C9] flex items-center justify-center text-[#D9609A] shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <HelpCircle size={22} className="stroke-[2.5]" />
            </div>
            <div className="text-left min-w-0">
              <span className="block text-xs font-fredoka font-bold uppercase tracking-wider text-[#D9609A]">
                Pista Secreta
              </span>
              <span className="text-sm sm:text-base font-fredoka font-bold text-[#6E5C8A] group-hover:text-[#3B2A5C] transition-colors truncate">
                ¿Adivinaste? Toca para revelar...
              </span>
            </div>
          </div>

          {/* Lado derecho: SILUETA generada desde la MISMA imagen con filtros CSS */}
          <div className="shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
            {!imgError ? (
              <img
                src={imageSrc}
                alt={riddle.altText}
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain pointer-events-none filter brightness-0 opacity-12 blur-[0.8px] transition-all"
              />
            ) : (
              <span className="text-2xl filter grayscale brightness-0 opacity-15 blur-[0.8px]">
                {riddle.emojiFallback}
              </span>
            )}
          </div>
        </motion.button>
      ) : (
        /* ======================================================== */
        /* ESTADO B: RESPUESTA REVELADA EN UNA SOLA FILA HORIZONTAL */
        /* ======================================================== */
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full h-[76px] sm:h-[88px] md:h-[105px] rounded-2xl bg-gradient-to-r from-[#F3EDFC] via-[#FFF8F3] to-[#E8F8F2] border-2 border-[#BFEBDD] px-3.5 py-2 flex items-center gap-3 sm:gap-4 shadow-sm relative overflow-hidden"
        >
          {/* Ilustración de la respuesta (64-88px en móvil, hasta 110px en desktop) */}
          <motion.div
            initial={
              shouldReduceMotion
                ? undefined
                : { scale: 0.8 }
            }
            animate={{ scale: [0.8, 1.05, 1] }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center relative"
          >
            {/* Resplandor y halo suave */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F6A6C9] via-[#FFE69A] to-[#BFEBDD] blur-md opacity-50 pointer-events-none" />

            {!imgError ? (
              <img
                src={imageSrc}
                alt={riddle.altText}
                width={isDesktop ? 96 : 72}
                height={isDesktop ? 96 : 72}
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(217,96,154,0.3)] pointer-events-none"
              />
            ) : (
              <span className="relative z-10 text-3xl sm:text-4xl filter drop-shadow-xs">
                {riddle.emojiFallback}
              </span>
            )}
          </motion.div>

          {/* Texto y etiqueta de respuesta en la misma fila */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="inline-block text-[11px] sm:text-xs font-fredoka font-bold uppercase tracking-wider text-[#6B4FA8] bg-[#F3EDFC] px-2 py-0.5 rounded-md border border-[#B79CE8]/40">
                Respuesta:
              </span>
              <CheckCircle2 size={14} className="text-emerald-600 stroke-[2.5]" />
            </div>
            <p className="text-sm sm:text-base md:text-lg font-fredoka font-extrabold text-[#3B2A5C] leading-snug line-clamp-2">
              {riddle.respuesta}
            </p>
          </div>

          {/* Destello sutil en esquina */}
          <div className="absolute top-1.5 right-2 text-[#F6A6C9] pointer-events-none opacity-70">
            <Sparkles size={14} />
          </div>
        </motion.div>
      )}
    </div>
  );
};
