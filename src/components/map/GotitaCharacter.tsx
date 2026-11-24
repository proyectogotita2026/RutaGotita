import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WaypointCoordinates } from '../../types/route.types';
import {
  gotaPrincipalImg,
  gotaCuriosaImg,
  gotaViajeraImg,
  gotaValienteImg,
  gotaGenerosaImg,
} from '../../assets/images';

interface GotitaCharacterProps {
  coordinates: WaypointCoordinates;
  isTraveling: boolean;
  onArrive?: () => void;
  stationName?: string;
  stationIndex?: number;
}

/**
 * Waypoints clave que siguen la curva natural del sendero morado
 * entre cada una de las estaciones del mapa (0 = Inicio, 1 = Estación 1, etc.)
 */
const PATH_SEGMENTS: Record<string, { x: number; y: number }[]> = {
  '0-1': [
    { x: 16.5, y: 41.5 },
    { x: 21.5, y: 37.0 },
    { x: 27.5, y: 33.5 },
  ],
  '1-2': [
    { x: 27.5, y: 33.5 },
    { x: 36.5, y: 31.0 },
    { x: 45.5, y: 29.5 },
    { x: 54.5, y: 31.5 },
  ],
  '2-3': [
    { x: 54.5, y: 31.5 },
    { x: 64.0, y: 33.0 },
    { x: 73.0, y: 37.5 },
    { x: 76.5, y: 47.0 },
    { x: 72.5, y: 59.0 },
  ],
  '3-4': [
    { x: 72.5, y: 59.0 },
    { x: 70.0, y: 68.0 },
    { x: 66.0, y: 74.5 },
    { x: 61.5, y: 77.5 },
  ],
  '4-5': [
    { x: 61.5, y: 77.5 },
    { x: 52.0, y: 80.0 },
    { x: 39.0, y: 81.0 },
    { x: 27.0, y: 79.5 },
    { x: 16.5, y: 76.5 },
  ],
};

export const GotitaCharacter: React.FC<GotitaCharacterProps> = ({
  coordinates,
  isTraveling,
  onArrive,
  stationName,
  stationIndex = 0,
}) => {
  const [imageError, setImageError] = useState(false);
  const lastArrivedIndexRef = useRef<number>(stationIndex);

  // Gotita temática dinámica según la estación de la ruta
  const getGotitaImage = (index: number): string => {
    switch (index) {
      case 0:
        return gotaPrincipalImg;
      case 1:
        return gotaCuriosaImg;
      case 2:
        return gotaViajeraImg;
      case 3:
        return gotaValienteImg;
      case 4:
        return gotaGenerosaImg;
      case 5:
        return gotaGenerosaImg;
      default:
        return gotaGenerosaImg;
    }
  };

  const gotitaImageUrl = getGotitaImage(stationIndex);

  // Frases emotivas según la estación o si está viajando
  const speechText = isTraveling
    ? '¡Allá vamos! 🏃‍♀️💨'
    : stationIndex === 0
      ? '¡Lista para explorar! 💧'
      : stationIndex === 1
        ? '¡Descubrí el calostro! ✨'
        : stationIndex === 2
          ? '¡Cadena de frío lista! ❄️'
          : stationIndex === 3
            ? '¡Valiente y pasteurizada! 🧩'
            : stationIndex === 4
              ? '¡Donar es amor puro! 💖'
              : '¡Llegamos al hospital! 🏁🏥';

  // Trazar el camino a través de los waypoints del sendero morado
  const getWaypoints = (fromIdx: number, toIdx: number): { x: number; y: number }[] => {
    if (fromIdx === toIdx) {
      return [{ x: coordinates.x, y: coordinates.y }];
    }
    const forward = fromIdx < toIdx;
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    const points: { x: number; y: number }[] = [];

    for (let i = start; i < end; i++) {
      const segKey = `${i}-${i + 1}`;
      const seg = PATH_SEGMENTS[segKey];
      if (seg) {
        seg.forEach((pt, idx) => {
          if (points.length === 0 || idx > 0) {
            points.push(pt);
          }
        });
      }
    }

    if (!forward) {
      points.reverse();
    }

    return points.length > 0 ? points : [{ x: coordinates.x, y: coordinates.y }];
  };

  const waypoints = isTraveling
    ? getWaypoints(lastArrivedIndexRef.current, stationIndex)
    : [{ x: coordinates.x, y: coordinates.y }];

  const xKeyframes = waypoints.map((p) => `${p.x}%`);
  const yKeyframes = waypoints.map((p) => `${p.y}%`);
  const travelDuration = isTraveling ? Math.max(1.3, (waypoints.length - 1) * 0.38) : 0.2;

  return (
    <motion.div
      className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-[85%] flex flex-col items-center select-none"
      initial={false}
      animate={{
        left: xKeyframes,
        top: yKeyframes,
      }}
      transition={{
        duration: travelDuration,
        ease: 'easeInOut',
      }}
      onAnimationComplete={() => {
        lastArrivedIndexRef.current = stationIndex;
        if (isTraveling && onArrive) {
          onArrive();
        }
      }}
    >
      {/* ======================================================== */}
      {/* GLOBO DE DIÁLOGO TIERNO (Speech Bubble animado)          */}
      {/* ======================================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={speechText}
          initial={{ opacity: 0, y: 3, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.22 }}
          className="relative mb-0.5 sm:mb-1 lg:mb-1.5 flex flex-col items-center"
        >
          <div className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 lg:px-3 lg:py-1 rounded-xl bg-white/95 backdrop-blur-md border-[1.5px] border-[#F6A6C9] shadow-md flex items-center gap-1.5 max-w-[200px] sm:max-w-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E08A00] animate-ping shrink-0" />
            <span className="text-[9px] sm:text-xs lg:text-sm font-fredoka font-black text-[#3B2A5C] whitespace-nowrap tracking-tight">
              {speechText}
            </span>
          </div>
          {/* Cola de la nube de diálogo */}
          <div className="w-2 h-1.5 bg-white border-r-[1.5px] border-b-[1.5px] border-[#F6A6C9] rotate-45 -mt-0.5 shadow-2xs" />
        </motion.div>
      </AnimatePresence>

      {/* ======================================================== */}
      {/* RASTRO DE CHISPAS Y GOTITAS DORADAS DURANTE EL VIAJE     */}
      {/* ======================================================== */}
      {isTraveling && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 pointer-events-none z-10">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, scale: 0.4, x: 0, y: 0 }}
              animate={{
                opacity: [1, 0.8, 0],
                scale: [0.4, 1.1, 0.6],
                x: (i % 2 === 0 ? -1 : 1) * (14 + i * 10),
                y: 10 + i * 8,
              }}
              transition={{
                repeat: Infinity,
                duration: 0.55,
                delay: i * 0.12,
                ease: 'easeOut',
              }}
              className="absolute text-[10px] sm:text-xs lg:text-sm select-none"
            >
              {i % 2 === 0 ? '✨' : '💧'}
            </motion.div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* CONTENEDOR DEL PERSONAJE CON BRINCO Y FLOTACIÓN          */}
      {/* Escalado proporcional con container queries (cqh)       */}
      {/* ======================================================== */}
      <motion.div
        animate={
          isTraveling
            ? {
                y: [0, -12, 0, -12, 0],
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.06, 0.96, 1.06, 1],
              }
            : {
                y: [0, -6, 0],
                rotate: [0, 2, -2, 0],
              }
        }
        transition={{
          repeat: Infinity,
          duration: isTraveling ? 0.38 : 2.4,
          ease: 'easeInOut',
        }}
        style={{
          width: 'clamp(46px, 13.5cqh, 142px)',
          height: 'clamp(52px, 15.5cqh, 160px)',
        }}
        className="relative filter drop-shadow-[0_8px_18px_rgba(107,79,168,0.28)] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {!imageError ? (
            <motion.img
              key={gotitaImageUrl}
              src={gotitaImageUrl}
              alt={stationName || 'La Gotita'}
              initial={{ scale: 0.85, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full h-full object-contain pointer-events-none"
              onError={() => setImageError(true)}
            />
          ) : (
            <GotitaVectorGraphic isTraveling={isTraveling} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sombra proyectada en el piso proporcional */}
      <motion.div
        animate={{
          scale: isTraveling ? [1, 0.5, 1] : [1, 0.85, 1],
          opacity: isTraveling ? [0.4, 0.15, 0.4] : [0.35, 0.2, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: isTraveling ? 0.38 : 2.4,
          ease: 'easeInOut',
        }}
        style={{
          width: 'clamp(40px, 12cqh, 128px)',
          height: 'clamp(8px, 1.8cqh, 16px)',
        }}
        className="bg-slate-900/30 rounded-full blur-[2px] sm:blur-[3px] -mt-1 sm:-mt-2"
      />
    </motion.div>
  );
};

/**
 * Renderizado vectorial de respaldo para la Gotita
 */
const GotitaVectorGraphic: React.FC<{ isTraveling: boolean }> = ({ isTraveling }) => {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <defs>
        <radialGradient id="dropShine" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="45%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
      </defs>

      {/* Silueta de Gota */}
      <path
        d="M50 6 C50 6 16 55 16 82 C16 102 31 116 50 116 C69 116 84 102 84 82 C84 55 50 6 50 6 Z"
        fill="url(#dropShine)"
        stroke="#ffffff"
        strokeWidth="3.5"
      />

      {/* Brillo especular superior izquierdo */}
      <path d="M32 45 C36 34 45 25 50 22 C46 32 38 43 32 48 Z" fill="#ffffff" opacity="0.8" />

      {/* Ojos expresivos */}
      <ellipse cx="38" cy="74" rx="4.5" ry="6" fill="#0f172a" />
      <ellipse cx="62" cy="74" rx="4.5" ry="6" fill="#0f172a" />
      <circle cx="36" cy="71" r="1.8" fill="#ffffff" />
      <circle cx="60" cy="71" r="1.8" fill="#ffffff" />

      {/* Sonrosado de mejillas */}
      <circle cx="28" cy="82" r="5" fill="#f43f5e" opacity="0.55" />
      <circle cx="72" cy="82" r="5" fill="#f43f5e" opacity="0.55" />

      {/* Sonrisa alegre */}
      <path
        d={isTraveling ? 'M42 84 Q50 95 58 84' : 'M42 84 Q50 91 58 84'}
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
