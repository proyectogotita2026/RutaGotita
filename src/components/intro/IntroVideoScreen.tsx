import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';
import { videoInicioPrincipal } from '../../assets/images';

interface IntroVideoScreenProps {
  onComplete: () => void;
}

export const IntroVideoScreen: React.FC<IntroVideoScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);

  // Intentar reproducir automáticamente con sonido
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => {
          setAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Al finalizar el video, pasar al mapa automáticamente
  const handleVideoEnded = useCallback(() => {
    setTimeout(() => {
      onComplete();
    }, 300);
  }, [onComplete]);

  // Atajos de teclado: Espacio para play/pausa, Escape o Flecha para avanzar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'Escape' || e.key === 'ArrowRight') {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  return (
    <div
      onClick={togglePlayPause}
      className="relative w-screen h-dvh overflow-hidden select-none bg-slate-950 flex items-center justify-center cursor-pointer group"
    >
      {/* ======================================================== */}
      {/* 1. VIDEO A PANTALLA COMPLETA                             */}
      {/* ======================================================== */}
      <video
        ref={videoRef}
        src={videoInicioPrincipal}
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        className="w-full h-full object-cover sm:object-contain bg-black"
      />

      {/* ======================================================== */}
      {/* 2. CONTROLES SUPERIORES FLOTANTES SOBRE EL VIDEO         */}
      {/* ======================================================== */}
      <div className="absolute top-2 sm:top-4 left-3 sm:left-6 right-3 sm:right-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Chip discreto de bienvenida */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 shadow-md pointer-events-auto">
          <Sparkles size={13} className="text-[#FFD36E]" />
          <span className="text-xs sm:text-sm font-bold font-fredoka text-white tracking-tight">
            Bienvenida · La Ruta de la Gotita
          </span>
        </div>

        {/* Botón flotante para saltar directamente al mapa */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 font-fredoka font-black text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-lg border border-white backdrop-blur-md cursor-pointer pointer-events-auto"
          title="Saltar video e ir al mapa (Escape o Flecha)"
          aria-label="Saltar video e ir al mapa"
        >
          <span>Ir al mapa</span>
          <ArrowRight size={15} className="stroke-[2.5] text-[#6B4FA8]" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTÓN FLOTANTE INFERIOR: SILENCIAR / ACTIVAR AUDIO    */}
      {/* ======================================================== */}
      <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-6 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={toggleMute}
          className="min-h-[40px] min-w-[40px] w-10 h-10 rounded-full bg-slate-900/65 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg"
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-rose-300" />
          ) : (
            <Volume2 size={18} className="text-white" />
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* 4. OVERLAY DE PAUSA / AUTOPLAY BLOQUEADO                 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {(!isPlaying || autoplayBlocked) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[3px] flex flex-col items-center justify-center text-white pointer-events-none p-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#F6A6C9] to-[#6B4FA8] flex items-center justify-center shadow-2xl border-2 border-white/90 mb-2 transform-gpu group-hover:scale-105 transition-transform">
              <Play size={28} className="translate-x-0.5 text-white" />
            </div>
            <p className="font-fredoka font-black text-sm sm:text-base text-white drop-shadow-md">
              {autoplayBlocked ? 'Toca para iniciar el video' : 'Toca para continuar'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
