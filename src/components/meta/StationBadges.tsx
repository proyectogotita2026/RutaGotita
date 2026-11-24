import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ESTACIONES_RECORRIDAS, type StationBadgeItem } from '../../config/metaConfig';

interface StationBadgesProps {
  soundEnabled?: boolean;
  startDelay?: number; // en segundos antes de iniciar la secuencia
  compact?: boolean;
  onAllCompleted?: () => void;
}

export const StationBadges: React.FC<StationBadgesProps> = ({
  soundEnabled = true,
  startDelay = 0.5,
  compact = false,
  onAllCompleted,
}) => {
  const [unlockedCount, setUnlockedCount] = useState<number>(0);

  // Sintetizador Web Audio API para "ding" suave de éxito
  const playDingSound = useCallback(
    (pitchFactor = 1.0) => {
      if (!soundEnabled) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Tono cálido de campanita/xilófono (de 880Hz a 1320Hz según la estación)
        const baseFreq = 784 * pitchFactor;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
      } catch {
        // Ignorar bloqueos de autoplay
      }
    },
    [soundEnabled]
  );

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const stepDuration = 260; // ms entre cada estación

    ESTACIONES_RECORRIDAS.forEach((_, idx) => {
      const timeout = setTimeout(() => {
        setUnlockedCount(idx + 1);
        playDingSound(1 + idx * 0.15);

        if (idx === ESTACIONES_RECORRIDAS.length - 1 && onAllCompleted) {
          onAllCompleted();
        }
      }, (startDelay * 1000) + idx * stepDuration);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [startDelay, playDingSound, onAllCompleted]);

  return (
    <div className="w-full">
      <div className={`flex items-center justify-between px-0.5 ${compact ? 'mb-1' : 'mb-1.5 sm:mb-2'}`}>
        <span className="text-[10px] sm:text-xs lg:text-sm font-black tracking-wider uppercase text-[#6B4FA8]/80 font-nunito">
          Lo que te llevas
        </span>
        <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-[#E08A00] font-fredoka flex items-center gap-1">
          <span>{unlockedCount} / 4 completadas</span>
        </span>
      </div>

      <div className={`grid grid-cols-4 ${compact ? 'gap-1 sm:gap-1.5' : 'gap-1.5 sm:gap-2 lg:gap-3'}`}>
        {ESTACIONES_RECORRIDAS.map((badge: StationBadgeItem, idx: number) => {
          const isDone = idx < unlockedCount;

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * idx, duration: 0.22 }}
              style={{
                backgroundColor: badge.bgLight,
                borderColor: isDone ? badge.borderColor : 'rgba(107, 79, 168, 0.15)',
              }}
              className={`relative rounded-xl lg:rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xs ${
                compact ? 'p-1 sm:p-1.5' : 'p-1.5 sm:p-2 lg:p-2.5'
              } ${isDone ? 'ring-2 ring-emerald-400/40' : 'opacity-70 grayscale-[0.3]'}`}
            >
              {/* Badge Icon / Emoji */}
              <div
                className={`transform-gpu select-none leading-none ${
                  compact
                    ? 'text-sm sm:text-base mb-0.5'
                    : 'text-base sm:text-lg lg:text-2xl mb-0.5 sm:mb-1'
                }`}
              >
                {badge.emoji}
              </div>

              {/* Nombre corto (nunca truncado con ellipsis) */}
              <div
                className={`font-black font-fredoka leading-none tracking-tight flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1 ${
                  compact
                    ? 'text-[9.5px] sm:text-[11px] lg:text-xs'
                    : 'text-[10px] sm:text-xs lg:text-sm'
                }`}
                style={{ color: badge.color }}
              >
                <span>{badge.name.split('. ')[0]}.</span>
                <span className="truncate max-w-full">{badge.name.split('. ')[1]}</span>
              </div>

              {/* Subtítulo mini en pantallas con espacio */}
              {!compact && (
                <div className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#3B2A5C]/75 font-nunito font-semibold hidden min-[400px]:block line-clamp-1 mt-0.5">
                  {badge.shortTitle}
                </div>
              )}

              {/* Check verde animado */}
              <div
                className={`absolute -top-1 -right-1 rounded-full flex items-center justify-center border border-white shadow-xs transition-all duration-300 ${
                  compact
                    ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5'
                    : 'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
                } ${
                  isDone
                    ? 'bg-emerald-500 text-white scale-100 rotate-0'
                    : 'bg-slate-200 text-slate-400 scale-75'
                }`}
                aria-label={isDone ? `Estación ${idx + 1} completada` : `Estación ${idx + 1}`}
              >
                <Check
                  size={compact ? 9 : 12}
                  className={`transition-opacity duration-200 stroke-[3] ${
                    isDone ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
