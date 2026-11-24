import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Maximize2, Minimize2 } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';
import { useFullscreen } from '../../hooks/useFullscreen';
import { coverBg } from '../../assets/images';

interface CoverScreenProps {
  onStart: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStart }) => {
  const [imageError, setImageError] = useState(false);
  const { isFullscreen, toggleFullscreen, enterFullscreen } = useFullscreen();
  const coverBgUrl = coverBg;

  // Intenta activar pantalla completa de forma inmediata con el primer gesto del usuario
  const handleStart = async () => {
    await enterFullscreen();
    onStart();
  };

  // Tecla 'F' para pantalla completa desde la portada
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      if (e.key === ' ' || e.key === 'Enter') {
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFullscreen]);

  return (
    <div
      onClick={enterFullscreen}
      className="relative w-screen h-dvh overflow-hidden select-none flex items-center justify-center bg-gradient-to-b from-[#fce4ec] via-[#e1f5fe] to-[#e8f5e9]"
    >
      {/* Botón flotante sutil de Pantalla Completa / Modo Proyector */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        title={isFullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa / Modo proyector (F)'}
        aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa / Modo proyector'}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 min-h-[36px] min-w-[36px] w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-sm border border-white/60 text-slate-700 flex items-center justify-center transition-all duration-200 active:scale-95"
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Contenedor dinámico 16:9 ajustado al 100% del viewport sin cortes */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: 'min(100vw, calc(100dvh * (16 / 9)))',
          height: 'min(100dvh, calc(100vw * (9 / 16)))',
          aspectRatio: '16 / 9',
        }}
      >
        {/* Ilustración de portada */}
        {!imageError ? (
          <img
            src={coverBgUrl}
            alt="La Ruta de la Gotita - Portada"
            className="w-full h-full object-contain pointer-events-none block"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderCoverGraphic />
        )}

        {/* Botón de Inicio estilizado y no invasivo en la parte inferior */}
        <div className="absolute inset-x-0 bottom-2.5 sm:bottom-4 md:bottom-6 lg:bottom-8 z-20 flex flex-col items-center justify-center pointer-events-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <ActionButton
              size="lg"
              variant="pink"
              pulse
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
              icon={
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white text-blh-pink-500 flex items-center justify-center shadow-inner">
                  <Play size={16} className="fill-blh-pink-500 translate-x-0.5 sm:size-18" />
                </div>
              }
              className="min-h-[40px] sm:min-h-[46px] px-5 py-1.5 sm:px-8 sm:py-2.5 text-xs sm:text-base md:text-lg font-black shadow-bubble cursor-pointer rounded-full"
            >
              ¡Iniciar la Aventura!
            </ActionButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderCoverGraphic: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-blh-sky-200 via-blh-pink-100 to-blh-mint-100 flex items-center justify-center">
      <span className="text-slate-600 font-bold text-sm">Cargando portada...</span>
    </div>
  );
};
