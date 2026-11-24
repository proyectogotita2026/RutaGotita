import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Puzzle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ROUTE_STATIONS } from '../../config/routeData';
import { mapBg } from '../../assets/images';
import { TimerDial } from './puzzle/TimerDial';
import { MissionSteps } from './puzzle/MissionSteps';
import { MascotBubble } from './puzzle/MascotBubble';

interface StationThreePuzzleTimerViewProps {
  onBackToMap: () => void;
  onCompleteAndAdvance: () => void;
}

export const StationThreePuzzleTimerView: React.FC<StationThreePuzzleTimerViewProps> = ({
  onBackToMap,
  onCompleteAndAdvance,
}) => {
  const station = ROUTE_STATIONS.find((s) => s.id === 'estacion-3');
  const puzzleData = station?.puzzleActivity;

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTimeFinished, setIsTimeFinished] = useState<boolean>(false);
  const [hasPassedTenSeconds, setHasPassedTenSeconds] = useState<boolean>(false);
  const [isEarlyFinished, setIsEarlyFinished] = useState<boolean>(false);

  // Detección de dimensiones
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
  const isShortPortrait = windowDimensions.height < 700 && !isLandscapeShort;
  const isDesktop = windowDimensions.width >= 768 && !isLandscapeShort;

  // Habilitación del CTA
  const isCtaEnabled = isTimeFinished || hasPassedTenSeconds || isEarlyFinished;

  return (
    <div className="relative w-screen h-dvh flex flex-col overflow-hidden select-none bg-[#FFF8F3] text-[#3B2A5C]">
      {/* ======================================================== */}
      {/* 1. FONDO DE ACUARELA DEL MAPA                            */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={mapBg}
          alt=""
          className="w-full h-full object-cover filter blur-[7px] scale-105 opacity-35"
        />
        <div className="absolute inset-0 bg-[#FFF8F3]/88 md:bg-[#FFF8F3]/80 backdrop-blur-[2px]" />

        {/* Decoraciones sutiles en bordes con opacidad .25-.35 */}
        <div className="hidden sm:block">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-4, 4, -4], opacity: [0.25, 0.35, 0.25] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-16 left-[5%] text-[#FFC857]"
          >
            <Puzzle size={56} strokeWidth={1.5} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [5, -5, 5], opacity: [0.22, 0.32, 0.22] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-16 right-[6%] text-[#B79CE8]"
          >
            <Puzzle size={60} strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HEADER COMPACTO (52px en vertical, 44px en landscape)  */}
      {/* ======================================================== */}
      <header
        className={`px-3 sm:px-6 flex items-center justify-between gap-2 z-30 shrink-0 border-b border-[#E08A00]/15 bg-white/80 backdrop-blur-md ${
          isLandscapeShort ? 'h-11 min-h-[44px]' : 'h-[52px] min-h-[52px]'
        }`}
      >
        {/* Botón Volver con icono (44px táctil en móvil, 38px en landscape bajo) */}
        <button
          type="button"
          onClick={onBackToMap}
          className={`${
            isLandscapeShort ? 'w-9 h-9' : 'w-11 h-11'
          } rounded-full bg-white/95 border border-[#E08A00]/30 text-[#E08A00] hover:text-[#3B2A5C] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer`}
          title="Volver al mapa"
          aria-label="Volver al mapa interactivo"
        >
          <ArrowLeft size={isLandscapeShort ? 18 : 20} className="stroke-[2.5]" />
        </button>

        {/* Chip central "3 · La Gotita Valiente" */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3CC] border border-[#FFC857] shadow-2xs">
          <Puzzle size={14} className="text-[#E08A00]" />
          <h1 className="text-xs sm:text-sm font-fredoka font-bold text-[#3B2A5C] tracking-wide">
            3 · <span className="text-[#E08A00]">La Gotita Valiente</span>
          </h1>
        </div>

        {/* Botón Silenciar / Sonido */}
        <button
          type="button"
          onClick={() => setSoundEnabled((prev) => !prev)}
          className={`${
            isLandscapeShort ? 'w-9 h-9' : 'w-11 h-11'
          } rounded-full bg-white/95 border border-[#B79CE8]/30 flex items-center justify-center text-[#6E5C8A] hover:text-[#3B2A5C] shadow-2xs active:scale-95 transition-all cursor-pointer`}
          title={soundEnabled ? 'Silenciar campanita' : 'Activar sonido'}
          aria-label={soundEnabled ? 'Silenciar campanita' : 'Activar sonido'}
        >
          {soundEnabled ? (
            <Volume2 size={isLandscapeShort ? 16 : 18} className="text-[#6B4FA8]" />
          ) : (
            <VolumeX size={isLandscapeShort ? 16 : 18} className="text-[#D9609A]" />
          )}
        </button>
      </header>

      {/* ======================================================== */}
      {/* 3. CONTENIDO PRINCIPAL: 3 MODOS EXACTOS SEGÚN PANTALLA    */}
      {/* ======================================================== */}

      {/* -------------------------------------------------------- */}
      {/* MODO A: ALTURAS BAJAS / LANDSCAPE MÓVIL (≤ 500px, ej 737x352) */}
      {/* 2 Columnas: Izquierda Cronómetro, Derecha Misión + CTA    */}
      {/* -------------------------------------------------------- */}
      {isLandscapeShort ? (
        <main className="flex-1 min-h-0 overflow-hidden px-4 py-2 z-20 w-full max-w-5xl mx-auto grid grid-cols-2 gap-4 items-center">
          {/* Columna Izquierda: Cronómetro compacto (sin barra lineal) */}
          <div className="flex flex-col items-center justify-center h-full">
            <TimerDial
              defaultDuration={puzzleData?.defaultDurationSeconds || 300}
              soundEnabled={soundEnabled}
              isCompactLandscape={true}
              onTimerZero={() => setIsTimeFinished(true)}
              onHasRunAtLeastTenSeconds={() => setHasPassedTenSeconds(true)}
              onEarlyFinish={() => setIsEarlyFinished(true)}
            />
          </div>

          {/* Columna Derecha: Misión con scroll fino + CTA */}
          <div className="flex flex-col gap-2 h-full justify-between overflow-y-auto pr-1 custom-scrollbar">
            <MissionSteps
              fullInstruction={puzzleData?.instruction}
              isCompactLandscape={true}
            />

            {/* CTA en flujo */}
            <div className="pt-1 pb-1 shrink-0">
              <button
                type="button"
                disabled={!isCtaEnabled}
                onClick={onCompleteAndAdvance}
                className={`w-full h-11 rounded-full font-fredoka font-bold text-sm flex items-center justify-center gap-2 transition-all select-none active:scale-[0.98] ${
                  isCtaEnabled
                    ? 'text-[#3B2A5C] shadow-md cursor-pointer border-b-2 border-[#C97B00]'
                    : 'text-slate-400 bg-slate-200/80 border border-slate-300 opacity-50 cursor-not-allowed'
                }`}
                style={
                  isCtaEnabled
                    ? {
                        background: 'linear-gradient(135deg, #FFC857 0%, #E08A00 100%)',
                        boxShadow: '0 4px 14px -2px rgba(224, 138, 0, 0.4)',
                      }
                    : undefined
                }
              >
                <span>¡Completar estación y seguir ruta!</span>
                <ArrowRight size={17} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </main>
      ) : isDesktop ? (
        /* ------------------------------------------------------ */
        /* MODO B: TABLET / DESKTOP (≥ 768px, altura normal)      */
        /* 2 Columnas centradas (40% Gotita grande | 60% Cronómetro) */
        /* ------------------------------------------------------ */
        <main className="flex-1 min-h-0 overflow-y-auto px-6 py-4 z-20 w-full max-w-[1200px] mx-auto flex items-center justify-center custom-scrollbar">
          <div className="grid grid-cols-12 gap-8 items-center w-full my-auto">
            {/* Columna Izquierda (40%): Gotita GRANDE en camafeo e Isla */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <MascotBubble
                isTimeFinished={isTimeFinished || isEarlyFinished}
                isRunning={false}
              />
            </div>

            {/* Columna Derecha (60%): Cronómetro compacto + Misión + CTA */}
            <div className="col-span-7 flex flex-col gap-4">
              <TimerDial
                defaultDuration={puzzleData?.defaultDurationSeconds || 300}
                soundEnabled={soundEnabled}
                isDesktop={true}
                onTimerZero={() => setIsTimeFinished(true)}
                onHasRunAtLeastTenSeconds={() => setHasPassedTenSeconds(true)}
                onEarlyFinish={() => setIsEarlyFinished(true)}
              />

              <MissionSteps fullInstruction={puzzleData?.instruction} />

              {/* Botón CTA desktop */}
              <div className="w-full flex flex-col items-center mt-1">
                <button
                  type="button"
                  disabled={!isCtaEnabled}
                  onClick={onCompleteAndAdvance}
                  className={`w-full h-[52px] min-h-[52px] rounded-full font-fredoka font-bold text-base flex items-center justify-center gap-2 transition-all select-none hover:scale-[1.01] active:scale-[0.99] ${
                    isCtaEnabled
                      ? 'text-[#3B2A5C] shadow-lg cursor-pointer border-b-2 border-[#C97B00]'
                      : 'text-slate-400 bg-slate-200/80 border border-slate-300 opacity-50 cursor-not-allowed'
                  }`}
                  style={
                    isCtaEnabled
                      ? {
                          background: 'linear-gradient(135deg, #FFC857 0%, #E08A00 100%)',
                          boxShadow: '0 8px 24px -4px rgba(224, 138, 0, 0.35)',
                        }
                      : undefined
                  }
                  aria-label="Completar estación y seguir ruta"
                >
                  <span>¡Completar estación y seguir ruta!</span>
                  <ArrowRight size={20} className="stroke-[2.5]" />
                </button>
                <span className="text-xs font-fredoka font-semibold text-[#6E5C8A] mt-1.5">
                  {isCtaEnabled
                    ? '¡Excelente! Haz clic para avanzar a la siguiente estación.'
                    : 'Se activa cuando termine el tiempo o toques "Terminaron antes".'}
                </span>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ------------------------------------------------------ */
        /* MODO C: CELULAR VERTICAL (Base 360-430px)              */
        /* 390x844: Header + Cronómetro compacto + Misión + CTA  */
        /* ------------------------------------------------------ */
        <main
          className={`flex-1 min-h-0 overflow-y-auto px-3.5 py-2.5 z-20 w-full max-w-md mx-auto flex flex-col gap-3 custom-scrollbar ${
            isShortPortrait ? 'pb-4' : 'pb-24'
          }`}
        >
          {/* Cronómetro Compacto (Mini-dial + Dígitos + Botones + Barra) */}
          <TimerDial
            defaultDuration={puzzleData?.defaultDurationSeconds || 300}
            soundEnabled={soundEnabled}
            onTimerZero={() => setIsTimeFinished(true)}
            onHasRunAtLeastTenSeconds={() => setHasPassedTenSeconds(true)}
            onEarlyFinish={() => setIsEarlyFinished(true)}
          />

          {/* Misión en 3 pasos (visible de inmediato) */}
          <MissionSteps fullInstruction={puzzleData?.instruction} />

          {/* Si la altura es baja (<700px), el CTA va dentro del scroll */}
          {isShortPortrait && (
            <div className="pt-2 pb-4 flex flex-col items-center">
              <span className="text-xs font-fredoka font-semibold text-[#6E5C8A] mb-1.5 text-center">
                {isCtaEnabled
                  ? '¡Listo! Ya puedes continuar tu camino'
                  : 'Se activa cuando termine el tiempo'}
              </span>
              <button
                type="button"
                disabled={!isCtaEnabled}
                onClick={onCompleteAndAdvance}
                className={`w-full h-[52px] min-h-[52px] rounded-full font-fredoka font-bold text-base flex items-center justify-center gap-2 transition-all select-none active:scale-[0.98] ${
                  isCtaEnabled
                    ? 'text-[#3B2A5C] shadow-lg cursor-pointer border-b-2 border-[#C97B00]'
                    : 'text-slate-400 bg-slate-200/80 border border-slate-300 opacity-50 cursor-not-allowed'
                }`}
                style={
                  isCtaEnabled
                    ? {
                        background: 'linear-gradient(135deg, #FFC857 0%, #E08A00 100%)',
                        boxShadow: '0 6px 20px -3px rgba(224, 138, 0, 0.4)',
                      }
                    : undefined
                }
              >
                <span>¡Completar estación y seguir ruta!</span>
                <ArrowRight size={20} className="stroke-[2.5]" />
              </button>
            </div>
          )}
        </main>
      )}

      {/* ======================================================== */}
      {/* 4. CTA STICKY EN CELULAR VERTICAL (Solo si altura ≥ 700px) */}
      {/* ======================================================== */}
      {!isLandscapeShort && !isDesktop && !isShortPortrait && (
        <div className="fixed bottom-0 left-0 right-0 z-40 cta-fade-gradient px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] flex flex-col items-center">
          <span className="text-xs font-fredoka font-semibold text-[#6E5C8A] mb-1.5 text-center truncate w-full">
            {isCtaEnabled ? (
              <span className="text-[#8C5400] inline-flex items-center justify-center gap-1 font-bold">
                <Sparkles size={13} className="text-[#E08A00]" />
                ¡Listo! Ya puedes continuar tu camino
              </span>
            ) : (
              'Se activa cuando termine el tiempo'
            )}
          </span>

          <button
            type="button"
            disabled={!isCtaEnabled}
            onClick={onCompleteAndAdvance}
            className={`w-full h-[52px] min-h-[52px] max-w-md rounded-full font-fredoka font-bold text-base flex items-center justify-center gap-2 transition-all select-none active:scale-[0.98] ${
              isCtaEnabled
                ? 'text-[#3B2A5C] shadow-lg cursor-pointer border-b-2 border-[#C97B00]'
                : 'text-slate-400 bg-slate-200/80 border border-slate-300 opacity-50 cursor-not-allowed'
            }`}
            style={
              isCtaEnabled
                ? {
                    background: 'linear-gradient(135deg, #FFC857 0%, #E08A00 100%)',
                    boxShadow: '0 6px 20px -3px rgba(224, 138, 0, 0.4)',
                  }
                : undefined
            }
            aria-label="Completar estación y seguir ruta"
          >
            <span>¡Completar estación y seguir ruta!</span>
            <ArrowRight size={20} className="stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
