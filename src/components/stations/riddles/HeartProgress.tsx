import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartProgressProps {
  total: number;
  currentIndex: number;
  revealedIndices: Set<number>;
  onSelectIndex?: (index: number) => void;
}

export const HeartProgress: React.FC<HeartProgressProps> = ({
  total,
  currentIndex,
  revealedIndices,
  onSelectIndex,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="progressbar"
      aria-label={`Progreso de adivinanzas: ${currentIndex + 1} de ${total}`}
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      className="h-5 min-h-[20px] flex items-center justify-center gap-1.5 sm:gap-2.5 select-none w-full max-w-xs mx-auto bg-transparent"
    >
      {Array.from({ length: total }).map((_, idx) => {
        const isCurrent = idx === currentIndex;
        const isCompleted = revealedIndices.has(idx);

        return (
          <React.Fragment key={idx}>
            <button
              type="button"
              onClick={() => onSelectIndex?.(idx)}
              className="relative flex items-center justify-center p-0.5 rounded-full transition-transform cursor-pointer focus:outline-none"
              title={`Ir a adivinanza ${idx + 1}`}
              aria-label={`Adivinanza ${idx + 1}${isCompleted ? ' (completada)' : isCurrent ? ' (actual)' : ''}`}
            >
              {isCurrent ? (
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: [1, 1.18, 1],
                        }
                  }
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center justify-center"
                >
                  <Heart
                    size={18}
                    className="fill-[#D9609A] text-[#D9609A] filter drop-shadow-[0_1px_4px_rgba(217,96,154,0.4)]"
                  />
                </motion.div>
              ) : isCompleted ? (
                <Heart
                  size={14}
                  className="fill-[#F6A6C9] text-[#D9609A] hover:scale-110 transition-transform"
                />
              ) : (
                <Heart
                  size={13}
                  className="fill-transparent text-[#D9609A]/40 hover:text-[#D9609A]/70 hover:scale-105 transition-all stroke-[2]"
                />
              )}
            </button>

            {/* Línea punteada de conexión muy fina */}
            {idx < total - 1 && (
              <span
                className={`h-0.5 w-2.5 sm:w-4 border-b border-dashed transition-colors ${
                  idx < currentIndex ? 'border-[#D9609A]' : 'border-[#D9609A]/25'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
