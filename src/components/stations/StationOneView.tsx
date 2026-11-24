import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, MapPin, Check } from 'lucide-react';
import { ROUTE_STATIONS } from '../../config/routeData';
import { mapBg, gotitaCuriosaImg, gotitaImg } from '../../assets/images';

interface StationOneViewProps {
  onBackToMap: () => void;
  onCompleteAndAdvance: () => void;
}

// Tokens específicos de la Estación 1: La Gotita Curiosa (Acento Lila)
const E1_THEME = {
  accent: '#B79CE8',
  accentDark: '#6B4FA8',
  accentLight: '#F3EDFC',
  text: '#3B2A5C',
  textMuted: '#6E5C8A',
  badgeBg: '#EFE7FA',
  badgeBorder: 'rgba(183, 156, 232, 0.45)',
  shadowAccent: 'rgba(107, 79, 168, 0.22)',
};

export const StationOneView: React.FC<StationOneViewProps> = ({
  onBackToMap,
  onCompleteAndAdvance,
}) => {
  const station = ROUTE_STATIONS.find((s) => s.id === 'estacion-1');
  const questions = station?.dialogQuestions || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imgError, setImgError] = useState<boolean>(false);

  const currentQ = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-screen h-dvh flex items-center justify-center overflow-hidden select-none bg-[#FFF8F3]">
      {/* ======================================================== */}
      {/* 1. FONDO DE ESCENA: Mapa Acuarela + Overlay Crema + Blur */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Imagen del mapa original de fondo */}
        <img
          src={mapBg}
          alt=""
          className="w-full h-full object-cover filter blur-[8px] scale-105 opacity-35"
        />

        {/* Overlay degradado cálido crema / lila muy sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F3]/92 via-[#FFF8F3]/82 to-[#F6EDF8]/92" />

        {/* Capas decorativas tenues */}
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 left-[6%] w-36 h-16 rounded-full bg-white/70 blur-xl"
        />
        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-8 right-[10%] w-48 h-20 rounded-full bg-[#B79CE8]/20 blur-2xl"
        />

        {/* Destellos suaves */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-4, 4, -4], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-[18%] text-[#B79CE8]/50"
        >
          <Sparkles size={22} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -14, 0], scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-12 right-[14%] text-[#F6A6C9]/50"
        >
          <Sparkles size={20} />
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* 2. CONTENEDOR PRINCIPAL VERTICALMENTE OPTIMIZADO         */}
      {/* ======================================================== */}
      <div className="relative flex flex-col justify-between p-2 sm:p-4 overflow-hidden z-10 w-full h-full max-w-6xl mx-auto">
        {/* ======================================================== */}
        {/* HEADER COMPACTO: py-1.5 px-3 | Círculos 1..5 de w-7 h-7  */}
        {/* ======================================================== */}
        <header className="flex items-center justify-between gap-2 z-30 flex-shrink-0 w-full py-1.5 px-2 sm:px-3 flex-nowrap whitespace-nowrap">
          {/* Botón Volver al mapa */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToMap}
            type="button"
            className="inline-flex items-center gap-1.5 min-h-[32px] sm:min-h-[36px] px-2.5 sm:px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#B79CE8]/30 shadow-xs hover:shadow-sm text-[#6B4FA8] hover:text-[#3B2A5C] transition-all cursor-pointer font-fredoka font-semibold text-xs sm:text-sm"
            aria-label="Volver al mapa interactivo"
          >
            <MapPin size={13} className="text-[#6B4FA8]" />
            <span>Mapa</span>
          </motion.button>

          {/* Chip central de la estación */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#B79CE8]/40 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#B79CE8] animate-pulse" />
            <h1 className="text-xs sm:text-sm font-bold text-[#3B2A5C] tracking-tight font-fredoka">
              1. <span className="text-[#6B4FA8]">La Gotita Curiosa</span>
            </h1>
          </div>

          {/* Camino de 5 gotitas de w-7 h-7 */}
          <nav
            aria-label="Progreso de preguntas"
            className="flex items-center px-2 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#B79CE8]/30 shadow-xs"
          >
            <div className="flex items-center relative">
              <div className="absolute left-2.5 right-2.5 top-1/2 -translate-y-1/2 h-[2px] border-t-2 border-dashed border-[#B79CE8]/40 pointer-events-none" />

              {questions.map((_, idx) => {
                const isActive = idx === currentIndex;
                const isCompleted = idx < currentIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 mx-0.5 sm:mx-1 rounded-full flex items-center justify-center font-fredoka font-bold text-xs transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-[#B79CE8] text-white ring-2 ring-[#B79CE8]/30 scale-110 shadow-xs font-black'
                        : isCompleted
                          ? 'bg-[#6B4FA8] text-white shadow-xs'
                          : 'bg-white/80 text-[#6E5C8A] border border-[#B79CE8]/40 hover:bg-white'
                    }`}
                    aria-label={`Pregunta ${idx + 1} de ${questions.length}${
                      isActive ? ' (actual)' : isCompleted ? ' (completada)' : ''
                    }`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <Check size={13} className="stroke-[3] text-white" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </header>

        {/* ======================================================== */}
        {/* ESCENA PRINCIPAL: SIEMPRE flex-row (Izquierda 35% | Derecha 65%) */}
        {/* ======================================================== */}
        <main className="flex flex-row items-center justify-between gap-3 sm:gap-6 w-full max-w-6xl mx-auto px-2 sm:px-4 flex-1 min-h-0 overflow-hidden my-auto">
          {/* ------------------------------------------------------ */}
          {/* COLUMNA IZQUIERDA: Gotita Protagonista (32% - 35%)     */}
          {/* ------------------------------------------------------ */}
          <div className="w-[32%] sm:w-[35%] flex items-center justify-center shrink-0 h-full relative min-h-0">
            <div className="relative flex flex-col items-center justify-center h-full max-h-full">
              {/* Resplandor y colina de pasto/flores suave */}
              <div className="absolute -bottom-1 w-32 sm:w-48 h-6 bg-gradient-to-t from-[#BFEBDD] to-[#E2F7EF] rounded-[50%] border border-white/60 shadow-xs pointer-events-none flex items-center justify-around px-3 overflow-hidden">
                <span className="text-[9px] sm:text-xs opacity-75">🌸</span>
                <span className="text-[9px] sm:text-xs opacity-60">🌼</span>
                <span className="text-[9px] sm:text-xs opacity-75">🌸</span>
              </div>

              {/* Imagen de la Gotita Curiosa limitada estrictamente a max-h-[58dvh] */}
              <motion.div
                initial={{ opacity: 0, x: -16, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  y: [0, -5, 0],
                }}
                transition={{
                  opacity: { duration: 0.45, ease: 'easeOut' },
                  x: { duration: 0.45, ease: 'easeOut' },
                  scale: { duration: 0.45, ease: 'easeOut' },
                  y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative z-10 w-auto h-auto max-h-[58dvh] flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(107,79,168,0.16)]"
              >
                <img
                  src={imgError ? gotitaImg : gotitaCuriosaImg}
                  alt="La Gotita Curiosa con lupa"
                  className="max-h-[58dvh] w-auto object-contain pointer-events-none select-none"
                  onError={() => setImgError(true)}
                />
              </motion.div>

              {/* Sombra ovalada en el piso */}
              <motion.div
                animate={{ scale: [1, 0.9, 1], opacity: [0.35, 0.22, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 sm:w-36 h-2 bg-[#6B4FA8]/20 rounded-full blur-[2px] mt-0.5 z-10"
              />
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* COLUMNA DERECHA: Globo de Diálogo + Botones (65% - 68%)*/}
          {/* ------------------------------------------------------ */}
          <div className="w-[68%] sm:w-[65%] h-full flex flex-col justify-center gap-2 sm:gap-3 py-1 sm:py-2 min-h-0">
            {/* Contenedor del Globo de Diálogo */}
            <div className="relative w-full flex-1 min-h-0 flex flex-col justify-center">
              {/* Pico orgánico del globo apuntando a la Gotita (visible en todo tamaño) */}
              <div
                className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-0 h-0 z-20 pointer-events-none"
                style={{
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  borderRight: '14px solid rgba(255, 255, 255, 0.92)',
                }}
              />
              <div
                className="absolute top-1/2 -left-4 -translate-y-1/2 w-0 h-0 z-10 pointer-events-none"
                style={{
                  borderTop: '13px solid transparent',
                  borderBottom: '13px solid transparent',
                  borderRight: '16px solid rgba(183, 156, 232, 0.35)',
                }}
              />

              {/* Globo de Diálogo Glass Card con altura flexible (max-h-[62dvh]) */}
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="watercolor-glass-card flex-1 min-h-0 max-h-[62dvh] flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 rounded-3xl relative shadow-md overflow-hidden"
              >
                {/* Píldora compacta: PREGUNTA X DE 5 */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-fredoka font-bold uppercase tracking-wider shadow-xs mb-1.5 sm:mb-2 shrink-0"
                  style={{
                    backgroundColor: E1_THEME.badgeBg,
                    color: E1_THEME.accentDark,
                    border: `1.5px solid ${E1_THEME.badgeBorder}`,
                  }}
                >
                  <Sparkles size={11} className="text-[#6B4FA8]" />
                  <span>Pregunta {currentIndex + 1} de 5</span>
                </div>

                {/* Texto de la PREGUNTA: Centrado y con escala tipográfica proporcional */}
                <div className="flex-1 flex items-center justify-center w-full px-2 sm:px-4 my-auto min-h-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={`question-title-${currentIndex}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="text-lg sm:text-2xl md:text-4xl font-extrabold text-center leading-snug font-fredoka text-[#3B2A5C] tracking-tight drop-shadow-xs select-text"
                    >
                      {currentQ.question}
                    </motion.h2>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* ======================================================== */}
            {/* BOTONES INFERIORES: Alineados en la misma columna derecha*/}
            {/* ======================================================== */}
            <div className="flex justify-between items-center shrink-0 w-full gap-2 px-1">
              {/* Botón Anterior */}
              <div>
                {currentIndex > 0 ? (
                  <motion.button
                    whileHover={{ scale: 1.03, x: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 py-1.5 px-4 sm:py-2.5 sm:px-6 rounded-full bg-white/80 hover:bg-white text-[#6B4FA8] font-fredoka font-bold text-xs sm:text-sm md:text-base border border-[#B79CE8]/30 shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <ArrowLeft size={15} />
                    <span>Anterior</span>
                  </motion.button>
                ) : (
                  <div className="w-16" />
                )}
              </div>

              {/* Botón Siguiente / Completar */}
              <div>
                {!isLastQuestion ? (
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleNext}
                    className="group inline-flex items-center gap-2 py-1.5 px-5 sm:py-2.5 sm:px-7 rounded-full text-white font-fredoka font-bold text-xs sm:text-sm md:text-base shadow-md cursor-pointer transition-all border-b-2 sm:border-b-3 border-[#553C8B]"
                    style={{
                      background: 'linear-gradient(135deg, #B79CE8 0%, #6B4FA8 100%)',
                      boxShadow: '0 6px 18px -4px rgba(107, 79, 168, 0.35)',
                    }}
                  >
                    <span>Siguiente pregunta</span>
                    <motion.span className="inline-flex items-center transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRight size={17} className="stroke-[2.5]" />
                    </motion.span>
                  </motion.button>
                ) : (
                  /* En la pregunta 5: botón de completar y continuar ruta */
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={onCompleteAndAdvance}
                    className="inline-flex items-center gap-2 py-1.5 px-5 sm:py-2.5 sm:px-7 rounded-full text-[#3B2A5C] font-fredoka font-bold text-xs sm:text-sm md:text-base shadow-lg cursor-pointer transition-all border-b-2 sm:border-b-3 border-[#2CA37A]"
                    style={{
                      background: 'linear-gradient(135deg, #BFEBDD 0%, #7FE2C3 100%)',
                      boxShadow: '0 6px 20px -4px rgba(44, 163, 122, 0.32)',
                    }}
                  >
                    <span>¡Completar estación y seguir ruta!</span>
                    <Sparkles size={17} className="text-[#3B2A5C]" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
