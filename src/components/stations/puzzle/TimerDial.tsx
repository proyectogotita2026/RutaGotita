import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, AlertCircle, Clock } from 'lucide-react';

interface TimerDialProps {
  defaultDuration?: number; // 300 segundos (5 minutos)
  soundEnabled?: boolean;
  isCompactLandscape?: boolean;
  isDesktop?: boolean;
  onTimerZero?: () => void;
  onHasRunAtLeastTenSeconds?: () => void;
  onEarlyFinish?: () => void;
  onTimeChange?: (timeLeft: number) => void;
}

export const TimerDial: React.FC<TimerDialProps> = ({
  defaultDuration = 300,
  soundEnabled = true,
  isCompactLandscape = false,
  isDesktop = false,
  onTimerZero,
  onHasRunAtLeastTenSeconds,
  onEarlyFinish,
  onTimeChange,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const [timeLeft, setTimeLeft] = useState<number>(defaultDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [hasPassedTenSeconds, setHasPassedTenSeconds] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Timestamps para cálculo exacto (Date.now)
  const endTimeRef = useRef<number | null>(null);
  const remainingSecondsRef = useRef<number>(defaultDuration);
  const totalElapsedSecondsRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastAriaAnnounced = useRef<number>(defaultDuration);
  const audioPlayedRef = useRef<boolean>(false);

  // Campanita suave Web Audio API
  const playBellSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      [783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.25, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + 1.9 + idx * 0.1);
      });
    } catch {
      // Ignorar bloqueos de audio
    }
  }, [soundEnabled]);

  // Vibración háptica en móvil
  const triggerHaptic = useCallback(() => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch {
      // Fallback silencioso
    }
  }, []);

  // Screen Wake Lock API
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Fallback silencioso
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {
      // Fallback silencioso
    }
  }, []);

  // Visibilidad de pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && endTimeRef.current) {
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
        setTimeLeft(diffSeconds);
        remainingSecondsRef.current = diffSeconds;
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, requestWakeLock]);

  // Ciclo del temporizador
  useEffect(() => {
    if (isRunning) {
      requestWakeLock();
      endTimeRef.current = Date.now() + remainingSecondsRef.current * 1000;

      timerIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.ceil((endTimeRef.current! - now) / 1000));

        totalElapsedSecondsRef.current += 1;
        if (totalElapsedSecondsRef.current >= 10 && !hasPassedTenSeconds) {
          setHasPassedTenSeconds(true);
          onHasRunAtLeastTenSeconds?.();
        }

        setTimeLeft(diffSeconds);
        remainingSecondsRef.current = diffSeconds;
        onTimeChange?.(diffSeconds);

        if (diffSeconds <= 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setIsRunning(false);
          setShowConfetti(true);
          triggerHaptic();
          releaseWakeLock();

          if (!audioPlayedRef.current) {
            audioPlayedRef.current = true;
            playBellSound();
          }
          onTimerZero?.();
        }
      }, 500);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      releaseWakeLock();
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      releaseWakeLock();
    };
  }, [
    isRunning,
    hasPassedTenSeconds,
    onHasRunAtLeastTenSeconds,
    onTimeChange,
    onTimerZero,
    playBellSound,
    triggerHaptic,
    requestWakeLock,
    releaseWakeLock,
  ]);

  // aria-live cada 30 segundos
  useEffect(() => {
    if (timeLeft % 30 === 0 && timeLeft !== lastAriaAnnounced.current) {
      lastAriaAnnounced.current = timeLeft;
    }
  }, [timeLeft]);

  const togglePlay = () => {
    if (timeLeft === 0) {
      remainingSecondsRef.current = defaultDuration;
      setTimeLeft(defaultDuration);
      audioPlayedRef.current = false;
      setShowConfetti(false);
      setIsRunning(true);
      setHasStarted(true);
      return;
    }
    setHasStarted(true);
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    remainingSecondsRef.current = defaultDuration;
    totalElapsedSecondsRef.current = 0;
    setTimeLeft(defaultDuration);
    setHasStarted(false);
    setHasPassedTenSeconds(false);
    audioPlayedRef.current = false;
    setShowConfetti(false);
    releaseWakeLock();
    onTimeChange?.(defaultDuration);
  };

  // Formato mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressRatio = timeLeft / defaultDuration;
  const isFinished = timeLeft === 0;
  const isUrgent = timeLeft <= 30 && timeLeft > 0;

  // Estados visuales del Pill
  let statusLabel = 'Listos';
  let statusBg = '#F3EDFC';
  let statusText = '#6B4FA8';
  let statusBorder = 'rgba(183, 156, 232, 0.4)';

  if (isFinished) {
    statusLabel = '¡Tiempo cumplido!';
    statusBg = '#FDF0F6';
    statusText = '#D9609A';
    statusBorder = 'rgba(246, 166, 201, 0.5)';
  } else if (isUrgent) {
    statusLabel = '¡Últimos 30s!';
    statusBg = '#FFF3CC';
    statusText = '#E08A00';
    statusBorder = 'rgba(255, 200, 87, 0.6)';
  } else if (isRunning) {
    statusLabel = 'En marcha';
    statusBg = '#FFF3CC';
    statusText = '#E08A00';
    statusBorder = 'rgba(224, 138, 0, 0.35)';
  } else if (hasStarted) {
    statusLabel = 'Pausado';
    statusBg = '#EAF4FF';
    statusText = '#0284C7';
    statusBorder = 'rgba(126, 193, 255, 0.4)';
  }

  // Porcentaje de la barra lineal (0 a 100%)
  const percentage = Math.max(0, Math.min(100, Math.round(progressRatio * 100)));

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Cronómetro: ${minutes} minutos y ${seconds} segundos restantes`}
      className={`watercolor-glass-card rounded-3xl ${
        isCompactLandscape ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4 md:p-5'
      } flex flex-col justify-between w-full border border-white/90 shadow-sm relative overflow-hidden select-none`}
    >
      {/* ======================================================== */}
      {/* FILA PRINCIPAL: 2 BLOQUES CLAROS (TIEMPO Y CONTROLES)    */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* BLOQUE IZQUIERDO: Dígitos 05:00 + Pill de Estado */}
        <div className="flex flex-col items-start justify-center">
          <span className="font-fredoka font-bold tabular-nums tracking-tight text-4xl sm:text-5xl md:text-6xl text-[#3B2A5C] leading-none drop-shadow-2xs">
            {formattedTime}
          </span>

          <div className="flex items-center gap-2 mt-1.5">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-fredoka font-bold uppercase tracking-wider shadow-2xs transition-colors"
              style={{
                backgroundColor: statusBg,
                color: statusText,
                border: `1.5px solid ${statusBorder}`,
              }}
            >
              {isFinished ? (
                <Sparkles size={12} className="text-[#D9609A]" />
              ) : isUrgent ? (
                <AlertCircle size={12} className="text-[#E08A00] animate-pulse" />
              ) : isRunning ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E08A00] animate-ping" />
              ) : (
                <Clock size={12} />
              )}
              <span>{statusLabel}</span>
            </div>

            {/* Opción rápida si terminaron antes */}
            {hasStarted && !isFinished && onEarlyFinish && (
              <button
                type="button"
                onClick={onEarlyFinish}
                className="text-[11px] font-fredoka font-semibold text-[#8C5400] hover:underline cursor-pointer"
                title="Avanzar anticipadamente"
              >
                ¿Terminaron antes?
              </button>
            )}
          </div>
        </div>

        {/* BLOQUE DERECHO: Botones táctiles cómodos */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Botón Ghost Reiniciar (40px) */}
          <button
            type="button"
            onClick={resetTimer}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#6E5C8A] hover:text-[#3B2A5C] border border-[#B79CE8]/30 flex items-center justify-center shadow-2xs cursor-pointer transition-all active:scale-95 shrink-0"
            title="Reiniciar a 05:00"
            aria-label="Reiniciar tiempo a 5 minutos"
          >
            <RotateCcw size={17} />
          </button>

          {/* Botón Principal Play / Pausa (52px) */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={togglePlay}
            className={`${
              isDesktop
                ? 'h-12 px-5 rounded-full font-fredoka font-bold text-sm sm:text-base inline-flex items-center gap-2'
                : 'w-13 h-13 min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center'
            } text-[#3B2A5C] shadow-md cursor-pointer transition-all border-b-2 border-[#C97B00] shrink-0`}
            style={{
              background: 'linear-gradient(135deg, #FFC857 0%, #E08A00 100%)',
              boxShadow: '0 4px 14px -2px rgba(224, 138, 0, 0.4)',
            }}
            aria-label={isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'}
          >
            {isRunning ? (
              <>
                <Pause size={20} className="fill-[#3B2A5C]" />
                {isDesktop && <span>Pausar</span>}
              </>
            ) : isFinished ? (
              <>
                <RotateCcw size={20} />
                {isDesktop && <span>Reiniciar</span>}
              </>
            ) : (
              <>
                <Play size={20} className="fill-[#3B2A5C] translate-x-0.5" />
                {isDesktop && <span>{hasStarted ? 'Reanudar' : 'Iniciar'}</span>}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRA DE PROGRESO LINEAL (Limpia en la base)             */}
      {/* ======================================================== */}
      <div className="w-full mt-3 h-1.5 rounded-full bg-[#FFF3CC] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-linear ${
            isUrgent && !shouldReduceMotion ? 'animate-pulse' : ''
          }`}
          style={{
            width: `${percentage}%`,
            background: isUrgent
              ? 'linear-gradient(90deg, #F6A6C9 0%, #D9609A 100%)'
              : 'linear-gradient(90deg, #FFC857 0%, #E08A00 100%)',
          }}
        />
      </div>

      {/* Confeti al finalizar */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: 0,
                  scale: [0, 1.2, 0.8],
                  x: (i % 2 === 0 ? 1 : -1) * (45 + i * 15),
                  y: (i % 3 === 0 ? -1 : 1) * (30 + i * 12),
                  rotate: i * 45,
                }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="absolute text-xl"
              >
                {i % 3 === 0 ? '🧩' : i % 2 === 0 ? '✨' : '💖'}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
