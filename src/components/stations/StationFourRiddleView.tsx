import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Volume2, Sparkles, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { RIDDLES_DATA } from '../../config/riddleData';
import { mapBg } from '../../assets/images';
import { HeartProgress } from './riddles/HeartProgress';
import { RiddleCard } from './riddles/RiddleCard';
import { RiddleMascot } from './riddles/RiddleMascot';

interface StationFourRiddleViewProps {
  onBackToMap: () => void;
  onCompleteAndAdvance: () => void;
}

export const StationFourRiddleView: React.FC<StationFourRiddleViewProps> = ({
  onBackToMap,
  onCompleteAndAdvance,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // Dimensiones de ventana
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLandscapeShort = windowDimensions.height <= 500;
  const isDesktop = windowDimensions.width >= 768 && !isLandscapeShort;

  const currentRiddle = RIDDLES_DATA[currentIndex];
  const isCurrentRevealed = revealedIndices.has(currentIndex);
  const isLastRiddle = currentIndex === RIDDLES_DATA.length - 1;

  // Precargar imagen de la siguiente adivinanza
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % RIDDLES_DATA.length;
    const nextImgSrc = `/assets/estacion4/${RIDDLES_DATA[nextIdx].imagen}`;
    const img = new Image();
    img.src = nextImgSrc;
  }, [currentIndex]);

  // Sonido con Web Audio API
  const playPopSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      [659.25, 880.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + 1.3 + idx * 0.08);
      });
    } catch {
      // Ignorar bloqueos de audio
    }
  }, []);

  // Leer en voz alta con SpeechSynthesis
  const speakCurrentRiddle = useCallback(() => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${currentRiddle.texto}. ${currentRiddle.pregunta}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    const voices = window.speechSynthesis.getVoices();
    const esVoice =
      voices.find((v) => v.lang.startsWith('es-CO')) ||
      voices.find((v) => v.lang.startsWith('es-MX')) ||
      voices.find((v) => v.lang.startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [currentRiddle, isSpeaking]);

  // Revelar adivinanza
  const handleReveal = () => {
    if (isCurrentRevealed) return;

    setRevealedIndices((prev) => new Set(prev).add(currentIndex));
    setConfettiActive(true);
    playPopSound();

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 150]);
      } catch {
        // Fallback silencioso
      }
    }

    setTimeout(() => {
      setConfettiActive(false);
    }, 1600);
  };

  // Siguiente adivinanza
  const handleNext = () => {
    if (isLastRiddle) {
      onCompleteAndAdvance();
      return;
    }
    if (currentIndex < RIDDLES_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Anterior adivinanza
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Repetir / ocultar respuesta
  const handleResetCurrent = () => {
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      next.delete(currentIndex);
      return next;
    });
  };

  // Teclado: Espacio/Enter = revelar/siguiente, Flechas = navegar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isCurrentRevealed) {
          handleReveal();
        } else {
          handleNext();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCurrentRevealed, currentIndex]);

  // Swipe táctil
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-dvh max-h-dvh overflow-hidden select-none bg-[#FFF8F3] text-[#3B2A5C] flex flex-col justify-between"
    >
      {/* ======================================================== */}
      {/* FONDO DE ACUARELA CON OVERLAY 88% Y BLUR 10px           */}
      {/* (Sin textos fantasma del mapa que se trasluzcan)         */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={mapBg}
          alt=""
          className="w-full h-full object-cover filter blur-[10px] scale-105 opacity-25"
        />
        {/* Overlay crema al 88% para bloquear textos del mapa */}
        <div className="absolute inset-0 bg-[#FFF8F3]/88 backdrop-blur-[4px]" />

        {/* Decoraciones sutiles en bordes con opacidad .25 */}
        {!isLandscapeShort && (
          <div className="hidden sm:block pointer-events-none">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-4, 4, -4], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-16 left-[5%] text-[#F6A6C9]"
            >
              <Heart size={48} strokeWidth={1.5} className="fill-[#FFE3F0]" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [5, -5, 5], opacity: [0.18, 0.28, 0.18] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-16 right-[6%] text-[#B79CE8]"
            >
              <Sparkles size={46} />
            </motion.div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. FILA DE HEADER: 48px + PROGRESO CORAZONES (20px)      */}
      {/* ======================================================== */}
      <header className="z-30 shrink-0 flex flex-col bg-white/75 backdrop-blur-md border-b border-[#D9609A]/15">
        <div
          className={`px-3 sm:px-6 flex items-center justify-between gap-2 ${
            isLandscapeShort ? 'h-10 min-h-[40px]' : 'h-12 min-h-[48px]'
          }`}
        >
          {/* Botón Volver (44px táctil) */}
          <button
            type="button"
            onClick={onBackToMap}
            className={`${
              isLandscapeShort ? 'w-9 h-9' : 'w-11 h-11'
            } rounded-full bg-white/95 border border-[#D9609A]/30 text-[#D9609A] hover:text-[#3B2A5C] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer`}
            title="Volver al mapa"
            aria-label="Volver al mapa interactivo"
          >
            <ArrowLeft size={isLandscapeShort ? 17 : 20} className="stroke-[2.5]" />
          </button>

          {/* Chip central "4 · La Gotita Generosa" */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE3F0] border border-[#F6A6C9] shadow-2xs">
            <Heart size={14} className="fill-[#D9609A] text-[#D9609A]" />
            <h1 className="text-xs sm:text-sm font-fredoka font-bold text-[#3B2A5C] tracking-wide">
              4 · <span className="text-[#D9609A]">La Gotita Generosa</span>
            </h1>
          </div>

          {/* Progreso inline en Landscape */}
          {isLandscapeShort && (
            <div className="flex-1 max-w-xs mx-2">
              <HeartProgress
                total={RIDDLES_DATA.length}
                currentIndex={currentIndex}
                revealedIndices={revealedIndices}
                onSelectIndex={(idx) => setCurrentIndex(idx)}
              />
            </div>
          )}

          {/* Un solo botón de sonido/voz (44px táctil) */}
          <button
            type="button"
            onClick={speakCurrentRiddle}
            className={`${
              isLandscapeShort ? 'w-9 h-9' : 'w-11 h-11'
            } rounded-full bg-white/95 border border-[#B79CE8]/30 flex items-center justify-center ${
              isSpeaking ? 'text-[#D9609A] bg-[#FFE3F0] animate-pulse' : 'text-[#6E5C8A] hover:text-[#3B2A5C]'
            } shadow-2xs active:scale-95 transition-all cursor-pointer`}
            title={isSpeaking ? 'Detener lectura en voz alta' : 'Leer adivinanza en voz alta'}
            aria-label="Leer adivinanza en voz alta"
          >
            <Volume2 size={isLandscapeShort ? 16 : 19} />
          </button>
        </div>

        {/* Línea de progreso de corazones (20px, sin fondo propio) */}
        {!isLandscapeShort && (
          <div className="w-full py-0.5">
            <HeartProgress
              total={RIDDLES_DATA.length}
              currentIndex={currentIndex}
              revealedIndices={revealedIndices}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
            />
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 2. FILA DE ESCENA (1fr min-h-0, CERO scroll de página)   */}
      {/* ======================================================== */}
      {isLandscapeShort ? (
        /* ------------------------------------------------------ */
        /* MODO LANDSCAPE / ALTURAS BAJAS (max-height: 500px)     */
        /* 2 Columnas: Izq 35% Gotita, Der 65% Nube + Respuesta   */
        /* ------------------------------------------------------ */
        <main className="flex-1 min-h-0 overflow-hidden px-4 py-1.5 z-20 w-full max-w-5xl mx-auto grid grid-cols-12 gap-3 items-center">
          {/* Columna Izquierda: Gotita 80-100px */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <RiddleMascot isRevealed={isCurrentRevealed} variant="mobile" />
          </div>

          {/* Columna Derecha: Nube + Tarjeta de respuesta */}
          <div className="col-span-8 flex flex-col justify-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRiddle.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <RiddleCard
                  riddle={currentRiddle}
                  isRevealed={isCurrentRevealed}
                  onReveal={handleReveal}
                  variant="compact"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      ) : isDesktop ? (
        /* ------------------------------------------------------ */
        /* MODO TABLET / DESKTOP (≥768px, Max 1200px)            */
        /* Ocupando ≥80% del alto, centrado vertical              */
        /* ------------------------------------------------------ */
        <main className="flex-1 min-h-0 overflow-hidden px-6 py-4 z-20 w-full max-w-[1200px] mx-auto flex items-center justify-center">
          <div className="grid grid-cols-12 gap-8 items-center w-full my-auto h-[82%]">
            {/* Columna Izquierda (36%): Gotita Grande sobre Isla */}
            <div className="col-span-5 flex flex-col items-center justify-center h-full">
              <RiddleMascot isRevealed={isCurrentRevealed} variant="desktop" />
            </div>

            {/* Columna Derecha (64%): Nube + Respuesta */}
            <div className="col-span-7 flex flex-col justify-center gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRiddle.id}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <RiddleCard
                    riddle={currentRiddle}
                    isRevealed={isCurrentRevealed}
                    onReveal={handleReveal}
                    variant="desktop"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      ) : (
        /* ------------------------------------------------------ */
        /* MODO MÓVIL VERTICAL (390×844, 360×640)                 */
        /* Escena fluida compacta: Gotita 64-80px + Nube + Resp  */
        /* ------------------------------------------------------ */
        <main className="flex-1 min-h-0 px-3.5 py-1.5 z-20 w-full max-w-md mx-auto flex flex-col justify-center gap-2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRiddle.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full"
            >
              <RiddleCard
                riddle={currentRiddle}
                isRevealed={isCurrentRevealed}
                onReveal={handleReveal}
                variant="mobile"
              />
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {/* ======================================================== */}
      {/* 3. FILA DE ACCIONES (Fija en el grid con safe-area)      */}
      {/* Botón principal 52px + Botón repetir 44px                */}
      {/* ======================================================== */}
      <footer className="z-30 shrink-0 w-full px-4 pt-1.5 pb-[max(10px,env(safe-area-inset-bottom))] bg-white/70 backdrop-blur-md border-t border-[#D9609A]/15 flex items-center justify-center">
        <div className="w-full max-w-md flex items-center gap-2.5">
          {/* Botón Principal (52px de alto) */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={isCurrentRevealed ? handleNext : handleReveal}
            className="flex-1 h-[52px] min-h-[52px] rounded-full font-fredoka font-bold text-base text-white shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all border-b-2 border-[#B5457D] active:scale-[0.98]"
            style={{
              background: isCurrentRevealed
                ? 'linear-gradient(135deg, #F6A6C9 0%, #D9609A 100%)'
                : 'linear-gradient(135deg, #FF80B3 0%, #D9609A 100%)',
              boxShadow: '0 6px 18px -3px rgba(217, 96, 154, 0.4)',
            }}
            aria-label={
              isCurrentRevealed
                ? isLastRiddle
                  ? 'Llegar a la meta final'
                  : 'Siguiente adivinanza'
                : 'Descubrir respuesta de la adivinanza'
            }
          >
            {isCurrentRevealed ? (
              isLastRiddle ? (
                <>
                  <Award size={20} className="stroke-[2.5]" />
                  <span>¡Llegar a la meta!</span>
                </>
              ) : (
                <>
                  <span>Siguiente adivinanza</span>
                  <ArrowRight size={19} className="stroke-[2.5]" />
                </>
              )
            ) : (
              <>
                <Sparkles size={18} className="text-[#FFE69A] animate-pulse" />
                <span>¡Descubrir respuesta!</span>
              </>
            )}
          </motion.button>

          {/* Botón Repetir (44px) cuando está revelada */}
          {isCurrentRevealed && (
            <button
              type="button"
              onClick={handleResetCurrent}
              className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#6E5C8A] hover:text-[#D9609A] border border-[#F6A6C9]/40 flex items-center justify-center shadow-2xs transition-colors cursor-pointer shrink-0"
              title="Ocultar respuesta y pensar de nuevo"
              aria-label="Repetir adivinanza"
            >
              <RotateCcw size={17} />
            </button>
          )}
        </div>
      </footer>

      {/* Confeti ligero */}
      <AnimatePresence>
        {confettiActive && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: 0,
                  scale: [0, 1.2, 0.8],
                  x: (i % 2 === 0 ? 1 : -1) * (45 + i * 14),
                  y: (i % 3 === 0 ? -1 : 1) * (35 + i * 12),
                  rotate: i * 36,
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute text-xl"
              >
                {i % 3 === 0 ? '💖' : i % 2 === 0 ? '✨' : '💧'}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
