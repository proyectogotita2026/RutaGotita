import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { FRASES_FINALES } from '../../config/metaConfig';
import { MetaScene } from './MetaScene';
import { Confetti } from './Confetti';
import { StationBadges } from './StationBadges';

interface MetaScreenProps {
  onBackToMap: () => void;
  onRestart: () => void;
}

export const MetaScreen: React.FC<MetaScreenProps> = ({ onBackToMap, onRestart }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [isLowHeight, setIsLowHeight] = useState<boolean>(false);

  // Frase rotativa fija durante la sesión
  const finalPhrase = useMemo(() => {
    const idx = Math.floor(Math.random() * FRASES_FINALES.length);
    return FRASES_FINALES[idx];
  }, []);

  // Detección de dimensiones y orientación
  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth > window.innerHeight && window.innerWidth >= 520;
      setIsLandscape(wide);
      setIsLowHeight(window.innerHeight < 500);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detección de preferencia de movimiento reducido
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Vibración táctil corta con el confeti
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([60, 40, 60]);
        } catch {
          // Ignorar si el navegador bloquea la vibración
        }
      }
    }, 1100);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Acelerar animación al tocar cualquier área neutra
  const handleTapToSkip = useCallback(() => {
    if (!isSkipped) {
      setIsSkipped(true);
    }
  }, [isSkipped]);

  return (
    <div
      onClick={handleTapToSkip}
      className="relative w-screen h-dvh max-h-dvh overflow-hidden select-none bg-gradient-to-b from-[#E0F2FE] via-[#FFF8F3] to-[#FFE3F0] text-[#3B2A5C] flex flex-col justify-between"
    >
      {/* Fondo acuarela sutil decorativo con burbujas de luz */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#BFEBDD]/40 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#F6A6C9]/35 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#FFD36E]/30 blur-3xl" />
      </div>

      {/* Confeti celebrado (dispara una vez) */}
      <Confetti active={!prefersReducedMotion} />

      {/* ======================================================== */}
      {/* 1. HEADER COHESIVO ALINEADO CON EL CONTENIDO             */}
      {/* ======================================================== */}
      <div
        className={`relative z-30 w-full px-3 sm:px-6 lg:px-10 shrink-0 ${
          isLowHeight ? 'pt-1' : 'pt-1.5 sm:pt-2'
        }`}
      >
        <header
          className={`max-w-6xl xl:max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto ${
            isLowHeight ? 'h-9 sm:h-10' : 'h-11 sm:h-12 lg:h-14'
          }`}
        >
          {/* Botón Volver al Mapa */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBackToMap();
            }}
            className={`rounded-full bg-white/90 border border-white shadow-sm hover:bg-white text-[#6B4FA8] flex items-center justify-center transition-all duration-200 active:scale-95 outline-none focus-visible:ring-3 focus-visible:ring-[#B79CE8] ${
              isLowHeight
                ? 'w-8 h-8 min-h-[34px] min-w-[34px]'
                : 'w-10 h-10 min-h-[40px] min-w-[40px] lg:w-11 lg:h-11'
            }`}
            title="Volver al mapa"
            aria-label="Volver al mapa interactivo"
          >
            <ArrowLeft size={isLowHeight ? 17 : 20} className="stroke-[2.5]" />
          </button>

          {/* Chip Central de Meta */}
          <div
            className={`flex items-center gap-1.5 rounded-full bg-white/95 border border-[#FFD36E] shadow-sm ${
              isLowHeight ? 'px-2.5 py-0.5' : 'px-3 sm:px-4 py-1'
            }`}
          >
            <span className={isLowHeight ? 'text-xs' : 'text-xs sm:text-sm lg:text-base'}>
              🏁
            </span>
            <span
              className={`font-black font-fredoka text-[#E0A100] ${
                isLowHeight ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm lg:text-base'
              }`}
            >
              Meta · Banco de Leche HUDN
            </span>
          </div>

          {/* Botón de Sonido */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled((prev) => !prev);
            }}
            className={`rounded-full bg-white/90 border border-white shadow-sm hover:bg-white text-[#6B4FA8] flex items-center justify-center transition-all duration-200 active:scale-95 outline-none focus-visible:ring-3 focus-visible:ring-[#B79CE8] ${
              isLowHeight
                ? 'w-8 h-8 min-h-[34px] min-w-[34px]'
                : 'w-10 h-10 min-h-[40px] min-w-[40px] lg:w-11 lg:h-11'
            }`}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            aria-label={
              soundEnabled ? 'Silenciar sonidos de celebración' : 'Activar sonidos de celebración'
            }
          >
            {soundEnabled ? (
              <Volume2 size={isLowHeight ? 17 : 20} className="stroke-[2.2] text-[#6B4FA8]" />
            ) : (
              <VolumeX size={isLowHeight ? 17 : 20} className="stroke-[2.2] text-slate-400" />
            )}
          </button>
        </header>
      </div>

      {/* ======================================================== */}
      {/* 2. CONTENIDO PRINCIPAL: ADAPTATIVO                       */}
      {/* ======================================================== */}
      {isLandscape ? (
        /* ======================================================== */
        /* VISTA HORIZONTAL (MÓVIL LANDSCAPE, TABLET, COMPUTADOR)   */
        /* ======================================================== */
        <main
          className={`relative z-20 w-full flex-1 min-h-0 flex items-center justify-center px-3 sm:px-6 lg:px-10 overflow-hidden ${
            isLowHeight ? 'py-1 pb-1.5' : 'py-2 sm:py-3'
          }`}
        >
          <div className="max-w-6xl xl:max-w-7xl w-full h-full grid grid-cols-2 gap-3 sm:gap-6 lg:gap-10 xl:gap-14 items-center min-h-0">
            {/* Columna Izquierda: Ilustración de la Meta */}
            <div className="w-full h-full flex items-center justify-center min-h-0 p-0.5 sm:p-2">
              <MetaScene
                reducedMotion={prefersReducedMotion || isSkipped}
                className={
                  isLowHeight
                    ? 'max-h-[min(64dvh,225px)]'
                    : 'max-h-[min(74dvh,540px)] xl:max-h-[min(76dvh,620px)]'
                }
              />
            </div>

            {/* Columna Derecha: Título, Mensaje, Badges y Botones */}
            <div
              className={`w-full flex flex-col justify-center max-w-xl min-h-0 ${
                isLowHeight ? 'gap-1.5' : 'gap-2 sm:gap-3 lg:gap-4'
              }`}
            >
              {/* Banner de Título */}
              <motion.div
                initial={prefersReducedMotion || isSkipped ? { opacity: 1 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.25 }}
                className="text-left"
              >
                {!isLowHeight && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-[#FFF3CC] border border-[#FFD36E] text-[#B87200] text-[11px] sm:text-xs lg:text-sm font-black font-fredoka uppercase tracking-wider mb-1 shadow-xs">
                    <Sparkles size={13} className="text-[#E0A100]" />
                    <span>¡Misión Cumplida!</span>
                  </div>
                )}
                <h1
                  className={`font-black font-fredoka text-[#3B2A5C] leading-tight ${
                    isLowHeight
                      ? 'text-base sm:text-lg lg:text-xl'
                      : 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl'
                  }`}
                >
                  ¡Llegaste a la <span className="text-[#E0A100]">meta!</span>{' '}
                  <span className="inline-block">🏁</span>
                </h1>
                <p
                  className={`text-[#6B4FA8] font-nunito font-bold ${
                    isLowHeight ? 'text-[11px]' : 'text-xs sm:text-sm lg:text-base'
                  }`}
                >
                  Gracias por recorrer la Ruta de la Gotita
                </p>
              </motion.div>

              {/* Tarjeta de Mensaje Glass Crema */}
              <motion.div
                initial={
                  prefersReducedMotion || isSkipped ? { opacity: 1 } : { opacity: 0, scale: 0.97 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={`watercolor-glass-card meta-dotted-border text-center shadow-md ${
                  isLowHeight
                    ? 'rounded-xl p-2'
                    : 'rounded-2xl lg:rounded-3xl p-2.5 sm:p-4 lg:p-5'
                }`}
                role="status"
                aria-live="polite"
              >
                <div
                  className={`flex items-center justify-center gap-1.5 ${
                    isLowHeight ? 'mb-1' : 'mb-2 sm:mb-2.5'
                  }`}
                >
                  <Sparkles size={isLowHeight ? 12 : 14} className="text-[#F6A6C9] shrink-0" />
                  <p
                    className={`font-bold font-nunito text-[#3B2A5C] leading-snug ${
                      isLowHeight
                        ? 'text-[11px] sm:text-xs leading-tight'
                        : 'text-xs sm:text-sm lg:text-base'
                    }`}
                  >
                    &ldquo;{finalPhrase}&rdquo;
                  </p>
                  <Sparkles size={isLowHeight ? 12 : 14} className="text-[#F6A6C9] shrink-0" />
                </div>

                {/* Los 4 Badges de Estaciones */}
                <StationBadges
                  compact={isLowHeight}
                  soundEnabled={soundEnabled}
                  startDelay={isSkipped || prefersReducedMotion ? 0.05 : 0.35}
                />
              </motion.div>

              {/* Botonera de Acciones (Volver al mapa + Repetir ruta) */}
              <motion.div
                initial={prefersReducedMotion || isSkipped ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.25 }}
                className={`flex items-center gap-2 sm:gap-3 ${isLowHeight ? 'pt-0' : 'pt-0.5'}`}
              >
                {/* Botón Principal: Volver al Mapa */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBackToMap();
                  }}
                  className={`flex-1 rounded-full bg-gradient-to-r from-[#F6A6C9] via-[#D9609A] to-[#C04880] text-white font-fredoka font-black flex items-center justify-center gap-1.5 shadow-[0_6px_16px_-4px_rgba(217,96,154,0.45)] hover:brightness-105 active:scale-95 transition-all outline-none focus-visible:ring-3 focus-visible:ring-[#D9609A] ${
                    isLowHeight
                      ? 'min-h-[38px] h-9 px-3 text-xs'
                      : 'min-h-[44px] sm:min-h-[48px] lg:min-h-[52px] px-4 sm:px-6 py-2 text-xs sm:text-sm lg:text-base'
                  }`}
                  aria-label="Volver al mapa interactivo"
                >
                  <MapPin size={isLowHeight ? 14 : 18} />
                  <span>Volver al mapa</span>
                </button>

                {/* Botón Secundario: Repetir Ruta */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRestartModal(true);
                  }}
                  className={`flex-1 rounded-full border-2 border-[#B79CE8] bg-white/95 text-[#6B4FA8] font-fredoka font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#FFF3F8] active:scale-95 transition-all outline-none focus-visible:ring-3 focus-visible:ring-[#B79CE8]/50 ${
                    isLowHeight
                      ? 'min-h-[38px] h-9 px-3 text-xs'
                      : 'min-h-[44px] sm:min-h-[48px] lg:min-h-[52px] px-4 sm:px-6 py-2 text-xs sm:text-sm lg:text-base'
                  }`}
                  aria-label="Repetir la ruta desde el inicio"
                >
                  <RotateCcw size={isLowHeight ? 14 : 17} />
                  <span>Repetir la ruta</span>
                </button>
              </motion.div>
            </div>
          </div>
        </main>
      ) : (
        /* ======================================================== */
        /* VISTA VERTICAL / PORTRAIT (MÓVIL VERTICAL O TABLET 100DVH)*/
        /* ======================================================== */
        <main className="relative z-20 w-full flex-1 min-h-0 flex flex-col justify-between items-center px-3 sm:px-6 max-w-lg mx-auto overflow-hidden pb-2 select-none">
          {/* 1. Título y Banner Superior */}
          <motion.div
            initial={prefersReducedMotion || isSkipped ? { opacity: 1 } : { opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="text-center pt-1"
          >
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF3CC] border border-[#FFD36E] text-[#B87200] text-[10px] sm:text-xs font-black font-fredoka uppercase tracking-wider mb-1 shadow-xs">
              <Sparkles size={11} className="text-[#E0A100]" />
              <span>¡Misión Cumplida!</span>
              <Sparkles size={11} className="text-[#E0A100]" />
            </div>

            <h1 className="text-2xl min-[380px]:text-3xl sm:text-4xl font-black font-fredoka text-[#3B2A5C] leading-none tracking-tight">
              ¡Llegaste a la <span className="text-[#E0A100]">meta!</span> 🏁
            </h1>

            <p className="hidden min-[360px]:block text-xs sm:text-sm text-[#6B4FA8] font-nunito font-bold mt-1 line-clamp-1">
              Gracias por recorrer la Ruta de la Gotita
            </p>
          </motion.div>

          {/* 2. Ilustración Central de la Meta */}
          <div className="w-full flex-1 min-h-0 flex items-center justify-center py-1">
            <MetaScene
              reducedMotion={prefersReducedMotion || isSkipped}
              className="max-h-[min(32dvh,260px)] sm:max-h-[min(36dvh,320px)]"
            />
          </div>

          {/* 3. Tarjeta de Mensaje y Badges */}
          <motion.div
            initial={prefersReducedMotion || isSkipped ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full watercolor-glass-card meta-dotted-border rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center shadow-md mb-2 shrink-0"
            role="status"
            aria-live="polite"
          >
            {/* Frase rotativa */}
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-[#F6A6C9] shrink-0" />
              <p className="text-xs min-[380px]:text-[13px] sm:text-sm font-bold font-nunito text-[#3B2A5C] leading-snug">
                &ldquo;{finalPhrase}&rdquo;
              </p>
              <Sparkles size={14} className="text-[#F6A6C9] shrink-0" />
            </div>

            {/* Badges de las 4 estaciones */}
            <StationBadges
              compact={false}
              soundEnabled={soundEnabled}
              startDelay={isSkipped || prefersReducedMotion ? 0.05 : 0.5}
            />
          </motion.div>

          {/* 4. Botonera Fija Inferior */}
          <motion.footer
            initial={prefersReducedMotion || isSkipped ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.35 }}
            className="w-full flex items-center gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pointer-events-auto shrink-0"
          >
            {/* Botón Principal: Volver al Mapa */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBackToMap();
              }}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-full bg-gradient-to-r from-[#F6A6C9] via-[#D9609A] to-[#C04880] text-white font-fredoka font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(217,96,154,0.4)] hover:brightness-105 active:scale-95 transition-all outline-none focus-visible:ring-3 focus-visible:ring-[#D9609A]"
              aria-label="Volver al mapa interactivo"
            >
              <MapPin size={18} />
              <span>Volver al mapa</span>
            </button>

            {/* Botón Secundario: Repetir Ruta */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowRestartModal(true);
              }}
              className="min-h-[48px] px-4 py-2.5 rounded-full border-2 border-[#B79CE8] bg-white/95 text-[#6B4FA8] font-fredoka font-bold text-sm flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#FFF3F8] active:scale-95 transition-all outline-none focus-visible:ring-3 focus-visible:ring-[#B79CE8]/50"
              aria-label="Repetir la ruta desde el inicio"
            >
              <RotateCcw size={17} />
              <span>Repetir</span>
            </button>
          </motion.footer>
        </main>
      )}

      {/* ======================================================== */}
      {/* MODAL DE CONFIRMACIÓN: REPETIR LA RUTA                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showRestartModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setShowRestartModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] bg-[#FFF8F3] border-2 border-white p-5 text-center shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="restart-dialog-title"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FFE3F0] text-[#D9609A] flex items-center justify-center">
                <AlertCircle size={24} className="stroke-[2.5]" />
              </div>

              <h3
                id="restart-dialog-title"
                className="text-lg font-black font-fredoka text-[#3B2A5C] mb-1"
              >
                ¿Quieres empezar de nuevo?
              </h3>

              <p className="text-xs sm:text-sm text-[#6B4FA8] font-nunito font-semibold mb-5 leading-relaxed">
                Tu progreso se reiniciará para que puedas disfrutar nuevamente toda la aventura de La Ruta de la Gotita.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRestartModal(false)}
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-full border-2 border-[#B79CE8]/40 bg-white font-fredoka font-bold text-xs sm:text-sm text-[#6B4FA8] hover:bg-[#FFF3F8] active:scale-95 transition-all outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRestartModal(false);
                    onRestart();
                  }}
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-full bg-gradient-to-r from-[#F6A6C9] to-[#D9609A] font-fredoka font-bold text-xs sm:text-sm text-white shadow-sm hover:brightness-105 active:scale-95 transition-all outline-none"
                >
                  Sí, reiniciar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
