import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import {
  CUENTO_SCENES,
  type CuentoScene,
  cuentoAudioUrl,
} from '../../config/cuentoViajeraData';
import { useFullscreen } from '../../hooks/useFullscreen';
import { mapBg } from '../../assets/images';

interface StationTwoStoryViewProps {
  onBackToMap: () => void;
  onCompleteAndAdvance: () => void;
}

export const StationTwoStoryView: React.FC<StationTwoStoryViewProps> = ({
  onBackToMap,
  onCompleteAndAdvance,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const totalDuration = 218; // Duración total de la narración en segundos (03:38)

  // Determinar la escena actual según el tiempo del audio
  const getCurrentScene = (): CuentoScene => {
    if (!isStarted && currentTime === 0) {
      return CUENTO_SCENES[0]; // Portada
    }
    // Buscar la escena correspondiente en los rangos de tiempo
    const storyScenes = CUENTO_SCENES.slice(1);
    const found = storyScenes.find(
      (s) => currentTime >= s.startTime && currentTime < s.endTime
    );
    if (found) return found;
    if (currentTime >= totalDuration) {
      return CUENTO_SCENES[CUENTO_SCENES.length - 1];
    }
    return CUENTO_SCENES[1];
  };

  const currentScene = getCurrentScene();

  // Iniciar la narración
  const startStory = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsStarted(true);
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  // Alternar Play / Pausa
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isStarted) {
      startStory();
      return;
    }

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isStarted, startStory]);

  // Reiniciar cuento desde el principio
  const handleRestart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    setHasEnded(false);
    setIsStarted(true);
    audio.play().then(() => setIsPlaying(true));
  }, []);

  // Listener del tiempo del audio
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = audio.currentTime;
    setCurrentTime(time);

    if (time >= totalDuration) {
      setIsPlaying(false);
      setHasEnded(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  // Atajos de teclado: ESCAPE o ESPACIO para pausar/reanudar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape' || e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, toggleFullscreen, handleRestart]);

  const progressPercent = Math.min(100, (currentTime / totalDuration) * 100);

  return (
    <div className="relative w-screen h-dvh max-h-dvh flex items-center justify-center overflow-hidden select-none bg-gradient-to-b from-[#E0F2FE] via-[#FFF8F3] to-[#F0F9FF] text-[#3B2A5C]">
      {/* Elemento de Audio HTML5 con narración continua */}
      <audio
        ref={audioRef}
        src={cuentoAudioUrl}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Fondo de acuarela suave */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <img
          src={mapBg}
          alt=""
          className="w-full h-full object-cover filter blur-[14px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#E0F2FE]/80 via-[#FFF8F3]/70 to-[#E0F2FE]/80" />
      </div>

      {/* ======================================================== */}
      {/* 1. LÍNEA DE PROGRESO ULTRA FINA SUPERIOR (1px)           */}
      {/* ======================================================== */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-sky-200/50 z-40">
        <div
          className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0284C7] transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ======================================================== */}
      {/* 2. CONTROLES SUPERIORES FLOTANTES (Overlay en esquinas)  */}
      {/*    No consumen espacio vertical para la imagen           */}
      {/* ======================================================== */}

      {/* Esquina Superior Izquierda: Volver al Mapa */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-4 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            const audio = audioRef.current;
            if (audio) audio.pause();
            onBackToMap();
          }}
          className="min-h-[34px] min-w-[34px] w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-white shadow-md hover:bg-white text-[#0284C7] flex items-center justify-center transition-all duration-150 active:scale-95 outline-none backdrop-blur-md"
          title="Volver al mapa"
          aria-label="Volver al mapa"
        >
          <ArrowLeft size={18} className="stroke-[2.5]" />
        </button>
      </div>

      {/* Esquina Superior Derecha: Botón Pausar/Play + Pantalla Completa + Continuar */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Botón Pausar / Reanudar (Arriba para NO tapar los textos de las viñetas abajo) */}
        {isStarted && !hasEnded && (
          <button
            type="button"
            onClick={togglePlayPause}
            className="h-8 sm:h-10 px-3 sm:px-4 rounded-full bg-white/95 hover:bg-white text-[#0284C7] shadow-md border border-white backdrop-blur-md flex items-center gap-1.5 font-fredoka font-black text-xs sm:text-sm transition-all duration-150 active:scale-95 outline-none"
            title={isPlaying ? 'Pausar narración (Escape)' : 'Reanudar narración (Escape)'}
            aria-label={isPlaying ? 'Pausar narración' : 'Reanudar narración'}
          >
            {isPlaying ? (
              <>
                <Pause size={14} className="stroke-[2.5]" />
                <span className="hidden xs:inline sm:inline">Pausar</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-[#0284C7] translate-x-0.5" />
                <span className="hidden xs:inline sm:inline">Reanudar</span>
              </>
            )}
          </button>
        )}

        {/* Botón Pantalla Completa */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="min-h-[34px] min-w-[34px] w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-white shadow-md hover:bg-white text-slate-700 flex items-center justify-center transition-all duration-150 active:scale-95 outline-none backdrop-blur-md"
          title={isFullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
          aria-label="Pantalla completa"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Botón Continuar */}
        <button
          type="button"
          onClick={() => {
            const audio = audioRef.current;
            if (audio) audio.pause();
            onCompleteAndAdvance();
          }}
          className="h-8 sm:h-10 px-3 sm:px-4 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-fredoka font-bold flex items-center gap-1 shadow-md transition-all active:scale-95 outline-none border border-white/40"
          title="Avanzar a Estación 3"
        >
          <span>Continuar</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 3. LÁMINA ENORME APROVECHANDO TODO EL CAMPO DISPONIBLE   */}
      {/*    Ocupa el 100% de la pantalla sin cortes ni bordes gruesos */}
      {/* ======================================================== */}
      <main
        onClick={togglePlayPause}
        className="relative z-20 w-full h-full flex items-center justify-center p-1 sm:p-2 cursor-pointer overflow-hidden"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img
                src={currentScene.image}
                alt={currentScene.title}
                className="w-auto h-auto max-h-[98dvh] max-w-[99vw] object-contain rounded-xl sm:rounded-2xl shadow-[0_16px_40px_-8px_rgba(2,132,199,0.25)] border-2 sm:border-3 border-white select-none pointer-events-auto filter drop-shadow-md"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>

          {/* Botón inicial en la Portada */}
          {!isStarted && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startStory();
                }}
                className="px-7 py-3 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-[#0369A1] text-white font-fredoka font-black text-sm sm:text-base md:text-lg flex items-center gap-2.5 shadow-[0_12px_32px_-4px_rgba(2,132,199,0.6)] hover:scale-105 active:scale-95 transition-all duration-150 border-2 border-white outline-none animate-pulse"
              >
                <Play size={22} className="fill-white translate-x-0.5" />
                <span>Iniciar Cuento con Audio ▶</span>
              </button>
            </div>
          )}

          {/* Overlay suave cuando se pausa el audio */}
          <AnimatePresence>
            {isStarted && !isPlaying && !hasEnded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white/95 text-[#0284C7] shadow-2xl flex items-center justify-center backdrop-blur-md border-2 border-white">
                  <Play size={30} className="translate-x-0.5 fill-[#0284C7]" />
                </div>
                <span className="mt-2.5 px-3.5 py-1 rounded-full bg-black/70 text-white text-xs sm:text-sm font-fredoka font-bold backdrop-blur-sm">
                  Pausado · Toca o presiona Escape para continuar
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal de Finalización al terminar la narración */}
          <AnimatePresence>
            {hasEnded && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-w-md w-full bg-white text-[#3B2A5C] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#38BDF8] flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shadow-inner">
                    <Sparkles size={32} />
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-black font-fredoka text-[#0284C7]">
                      ¡Cuento Completado!
                    </h2>
                    <p className="text-xs sm:text-sm font-nunito text-slate-600 mt-1">
                      La Gotita Viajera ha recorrido la ruta de la leche materna. ¡Es hora de continuar a la Estación 3!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-fredoka font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      <RotateCcw size={16} />
                      <span>Escuchar de nuevo</span>
                    </button>

                    <button
                      type="button"
                      onClick={onCompleteAndAdvance}
                      className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-fredoka font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 hover:brightness-105 transition-all active:scale-95 animate-pulse"
                    >
                      <span>¡Avanzar a Estación 3!</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
