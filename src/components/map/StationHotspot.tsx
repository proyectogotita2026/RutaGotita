import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import type { StationData } from '../../types/route.types';

interface StationHotspotProps {
  station: StationData;
  isCurrent: boolean;
  isUnlocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
  debugMode?: boolean;
}

export const StationHotspot: React.FC<StationHotspotProps> = ({
  station,
  isCurrent,
  isUnlocked,
  isCompleted,
  onClick,
  debugMode = false,
}) => {
  const isClickable = isUnlocked || debugMode;
  const isGoal = station.type === 'goal';

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
      style={{
        left: `${station.coordinates.x}%`,
        top: `${station.coordinates.y}%`,
      }}
    >
      {/* ======================================================== */}
      {/* MAGIA SENDERO VIVO: FLORECITA FLORECIENDO AL COMPLETAR   */}
      {/* ======================================================== */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -45, y: 5 }}
          animate={{ scale: 1, rotate: [0, 10, -5, 0], y: 0 }}
          transition={{
            scale: { type: 'spring', stiffness: 300, damping: 18 },
            rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          }}
          className="absolute -top-4 -right-2.5 z-30 text-xs sm:text-sm select-none pointer-events-none drop-shadow"
          title="¡Estación florecida con amor!"
        >
          {station.index % 2 === 0 ? '🌸' : '🌼'}
        </motion.div>
      )}

      {/* Botón interactivo táctil amplio */}
      <motion.button
        type="button"
        disabled={!isClickable}
        onClick={onClick}
        whileHover={isClickable ? { scale: 1.15 } : undefined}
        whileTap={isClickable ? { scale: 0.95 } : undefined}
        className={`relative flex items-center justify-center rounded-full transition-transform duration-200 cursor-pointer disabled:cursor-not-allowed select-none min-w-[44px] min-h-[44px] ${
          isGoal ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12'
        }`}
        aria-label={`${station.name} (${station.numberLabel || 'Parada'})`}
      >
        {/* Aro indicador pulsante sobre la parada actual */}
        {isCurrent && (
          <>
            <span className="absolute inset-0 rounded-full bg-blh-sky-400/35 animate-ping pointer-events-none" />
            <span className="absolute -inset-1 rounded-full border-2 border-blh-sky-400 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Resplandor suave del Sendero Vivo para estaciones completadas */}
        {isCompleted && (
          <span className="absolute -inset-1 rounded-full bg-emerald-400/25 blur-[3px] pointer-events-none" />
        )}

        {/* Punto central con icono o check */}
        <div
          className={`flex items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all ${
            isGoal
              ? 'w-8 h-8 sm:w-10 sm:h-10 bg-amber-400/90 text-amber-950 border-2 border-white'
              : isCompleted
                ? 'w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500/90 text-white border-2 border-white'
                : isCurrent
                  ? 'w-7 h-7 sm:w-8 sm:h-8 bg-blh-sky-500/95 text-white border-2 border-white'
                  : isUnlocked
                    ? 'w-6 h-6 sm:w-7 sm:h-7 bg-white/80 text-blh-pink-500 border border-blh-pink-300 hover:bg-white'
                    : 'w-5 h-5 sm:w-6 sm:h-6 bg-slate-300/40 border border-slate-300/60 opacity-60'
          }`}
        >
          {isCompleted ? (
            <Check size={14} className="stroke-[3.5]" />
          ) : isGoal ? (
            <Sparkles size={16} className="text-amber-950" />
          ) : isCurrent ? (
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          ) : (
            <span className="text-[10px] sm:text-xs font-black">
              {station.type === 'start' ? '🌱' : station.index}
            </span>
          )}
        </div>
      </motion.button>

      {/* Etiqueta solo visible en Modo Debug para calibrar coordenadas */}
      {debugMode && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-300 text-[10px] font-mono px-1.5 py-0.5 rounded shadow border border-emerald-400/50 pointer-events-none whitespace-nowrap z-50">
          #{station.index}: {station.coordinates.x}%, {station.coordinates.y}%
        </div>
      )}
    </div>
  );
};
