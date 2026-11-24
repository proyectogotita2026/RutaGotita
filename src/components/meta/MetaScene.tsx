import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { rutafinalHospitalImg } from '../../assets/images';

interface MetaSceneProps {
  reducedMotion?: boolean;
  className?: string;
}

export const MetaScene: React.FC<MetaSceneProps> = ({
  reducedMotion = false,
  className = '',
}) => {
  const [hospitalImgError, setHospitalImgError] = useState(false);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}
    >
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full h-full flex items-center justify-center p-1 sm:p-2"
      >
        {!hospitalImgError ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={rutafinalHospitalImg}
              alt="Celebración en el Banco de Leche Humana - Hospital Universitario Departamental de Nariño"
              className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl sm:rounded-3xl shadow-[0_12px_32px_-6px_rgba(107,79,168,0.22)] border-2 border-white/90 filter drop-shadow-sm transition-all duration-300"
              loading="eager"
              decoding="async"
              onError={() => setHospitalImgError(true)}
            />

            {/* Chispitas de celebración flotantes */}
            {!reducedMotion && (
              <>
                <motion.div
                  animate={{ y: [0, -8, 0], scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                  className="absolute -top-1 -right-1 sm:top-2 sm:right-2 text-base sm:text-2xl pointer-events-none select-none drop-shadow"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
                  className="absolute bottom-2 -left-1 sm:bottom-3 sm:left-2 text-sm sm:text-xl pointer-events-none select-none drop-shadow"
                >
                  💖
                </motion.div>
              </>
            )}
          </div>
        ) : (
          /* Fallback SVG ilustrado si la imagen faltara */
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <svg
              viewBox="0 0 500 300"
              className="w-full h-full max-h-[300px] object-contain drop-shadow-md"
            >
              <ellipse cx="250" cy="270" rx="220" ry="25" fill="#E2F0D9" />
              <rect x="110" y="70" width="280" height="190" rx="16" fill="#EAF4FF" stroke="#38BDF8" strokeWidth="4" />
              <path d="M 90 70 L 410 70 L 390 50 L 110 50 Z" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="3" />
              <rect x="135" y="85" width="230" height="36" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
              <text x="250" y="102" textAnchor="middle" fill="#0284C7" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="13">
                Banco de Leche Humana
              </text>
              <text x="250" y="115" textAnchor="middle" fill="#6B4FA8" fontFamily="Nunito, sans-serif" fontWeight="700" fontSize="9">
                HOSPITAL UNIVERSITARIO DEP. DE NARIÑO
              </text>
              <rect x="238" y="20" width="24" height="24" rx="4" fill="#38BDF8" />
              <path d="M 245 32 H 255 M 250 27 V 37" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <rect x="140" y="140" width="40" height="40" rx="6" fill="#CBE8F5" stroke="#38BDF8" strokeWidth="2" />
              <rect x="320" y="140" width="40" height="40" rx="6" fill="#CBE8F5" stroke="#38BDF8" strokeWidth="2" />
              <rect x="220" y="175" width="60" height="85" rx="8" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3" />
              <circle cx="250" cy="210" r="16" fill="#FFE3F0" />
              <path
                d="M 250 206 C 248 202 243 202 241 205 C 238 209 242 214 250 219 C 258 214 262 209 259 205 C 257 202 252 202 250 206 Z"
                fill="#D9609A"
              />
            </svg>
          </div>
        )}
      </motion.div>
    </div>
  );
};
