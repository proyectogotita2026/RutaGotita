import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { mapBg } from '../../assets/images';

export type StationSignVariant = 'lavender' | 'amber' | 'pink';

interface StationIntroSignProps {
  stationNumberLabel: string;
  stationTitle: string;
  message: string;
  mascotSrc: string;
  mascotAlt: string;
  ctaLabel?: string;
  variant: StationSignVariant;
  onContinue: () => void;
  onBackToMap: () => void;
}

const VARIANT_STYLES: Record<
  StationSignVariant,
  {
    bgGradient: string;
    ribbonBg: string;
    ribbonBorder: string;
    ribbonText: string;
    cardBorder: string;
    innerDashed: string;
    accentColor: string;
    btnGradient: string;
    btnBorder: string;
    btnText: string;
    btnShadow: string;
    islandBg: string;
    glowColor: string;
    emojiDecor: string;
  }
> = {
  lavender: {
    bgGradient: 'from-[#FFF8F3]/92 via-[#FFF8F3]/85 to-[#F3EDFC]/94',
    ribbonBg: '#EFE7FA',
    ribbonBorder: '#B79CE8',
    ribbonText: '#6B4FA8',
    cardBorder: '#B79CE8',
    innerDashed: 'rgba(183, 156, 232, 0.45)',
    accentColor: '#6B4FA8',
    btnGradient: 'linear-gradient(135deg, #B79CE8 0%, #6B4FA8 100%)',
    btnBorder: '#553C8B',
    btnText: '#FFFFFF',
    btnShadow: '0 8px 22px -4px rgba(107, 79, 168, 0.45)',
    islandBg: 'from-[#BFEBDD] to-[#E2F7EF]',
    glowColor: 'rgba(107, 79, 168, 0.22)',
    emojiDecor: '🔍',
  },
  amber: {
    bgGradient: 'from-[#FFF8F3]/92 via-[#FFF8F3]/85 to-[#FFF3CC]/92',
    ribbonBg: '#FFF3CC',
    ribbonBorder: '#FFC857',
    ribbonText: '#B46900',
    cardBorder: '#FFC857',
    innerDashed: 'rgba(224, 138, 0, 0.35)',
    accentColor: '#E08A00',
    btnGradient: 'linear-gradient(135deg, #FFC857 0%, #E08A00 100%)',
    btnBorder: '#C97B00',
    btnText: '#3B2A5C',
    btnShadow: '0 8px 22px -4px rgba(224, 138, 0, 0.42)',
    islandBg: 'from-[#BFEBDD] to-[#E2F7EF]',
    glowColor: 'rgba(224, 138, 0, 0.24)',
    emojiDecor: '🧩',
  },
  pink: {
    bgGradient: 'from-[#FFF8F3]/92 via-[#FFF8F3]/85 to-[#FFE3F0]/92',
    ribbonBg: '#FFE3F0',
    ribbonBorder: '#F6A6C9',
    ribbonText: '#C23D7C',
    cardBorder: '#F6A6C9',
    innerDashed: 'rgba(217, 96, 154, 0.38)',
    accentColor: '#D9609A',
    btnGradient: 'linear-gradient(135deg, #FF80B3 0%, #D9609A 100%)',
    btnBorder: '#B5457D',
    btnText: '#FFFFFF',
    btnShadow: '0 8px 22px -4px rgba(217, 96, 154, 0.42)',
    islandBg: 'from-[#FEE8F3] to-[#FFF0F7]',
    glowColor: 'rgba(217, 96, 154, 0.24)',
    emojiDecor: '💖',
  },
};

export const StationIntroSign: React.FC<StationIntroSignProps> = ({
  stationNumberLabel,
  stationTitle,
  message,
  mascotSrc,
  mascotAlt,
  ctaLabel = '¡Comenzar estación!',
  variant,
  onContinue,
  onBackToMap,
}) => {
  const theme = VARIANT_STYLES[variant];

  // Permitir avanzar con Enter o Barra Espaciadora
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onContinue]);

  return (
    <div className="relative w-screen h-dvh max-h-dvh flex flex-col justify-between overflow-hidden select-none bg-[#FFF8F3] text-[#3B2A5C]">
      {/* Fondo acuarela del mapa con blur suave */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={mapBg}
          alt=""
          className="w-full h-full object-cover filter blur-[9px] scale-105 opacity-30"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient}`} />
      </div>

      {/* Header compacto superior */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-2 sm:pt-3 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBackToMap}
          className="h-8 sm:h-10 px-3 sm:px-3.5 rounded-full bg-white/95 border border-white shadow-sm hover:bg-white inline-flex items-center gap-1.5 font-fredoka font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          style={{ color: theme.accentColor }}
          title="Volver al mapa"
          aria-label="Volver al mapa interactivo"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
          <span>Mapa</span>
        </button>

        <div
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-full shadow-xs border text-xs sm:text-sm font-fredoka font-bold"
          style={{
            backgroundColor: theme.ribbonBg,
            borderColor: theme.ribbonBorder,
            color: theme.ribbonText,
          }}
        >
          <BookOpen size={14} />
          <span>
            {stationNumberLabel} · {stationTitle}
          </span>
        </div>

        <div className="w-16 sm:w-20" />
      </header>

      {/* Escena central en 2 columnas adaptables (Móvil horizontal + Desktop) */}
      <main className="relative z-20 flex-1 min-h-0 w-full max-w-5xl mx-auto px-3 sm:px-6 py-1.5 sm:py-4 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full flex flex-row items-center justify-center gap-3 sm:gap-8 lg:gap-12">
          {/* Columna Izquierda: Gotita temática flotando libre sobre colina floral */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-[30%] sm:w-[34%] flex flex-col items-center justify-center shrink-0 relative h-full max-h-[65dvh]"
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex items-center justify-center max-h-[50dvh] sm:max-h-[56dvh]"
              style={{
                filter: `drop-shadow(0 12px 24px ${theme.glowColor})`,
              }}
            >
              <img
                src={mascotSrc}
                alt={mascotAlt}
                className="w-auto h-auto max-h-[46dvh] sm:max-h-[54dvh] max-w-full object-contain pointer-events-none select-none"
              />
            </motion.div>

            {/* Isla floral suave */}
            <div
              className={`w-28 sm:w-44 lg:w-52 h-5 sm:h-7 bg-gradient-to-t ${theme.islandBg} rounded-[50%] border border-white/80 shadow-xs pointer-events-none flex items-center justify-around px-4 -mt-1.5 z-0`}
            >
              <span className="text-[10px] sm:text-xs opacity-80">🌸</span>
              <span className="text-[10px] sm:text-xs opacity-75">{theme.emojiDecor}</span>
              <span className="text-[10px] sm:text-xs opacity-80">🌸</span>
            </div>
          </motion.div>

          {/* Columna Derecha: Letrero Encantado del Sendero */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
            className="w-[70%] sm:w-[66%] flex flex-col items-center justify-center min-w-0 max-h-full"
          >
            <div
              className="relative w-full rounded-[22px] sm:rounded-[32px] bg-[#FFFDF9]/95 backdrop-blur-xl p-1.5 sm:p-3 shadow-[0_20px_50px_-12px_rgba(59,42,92,0.18)] border-2"
              style={{ borderColor: theme.cardBorder }}
            >
              {/* Marco interior pespunteado estilo cartel de cuento */}
              <div
                className="relative rounded-[16px] sm:rounded-[24px] border-2 border-dashed px-4 py-3 sm:px-8 sm:py-7 flex flex-col items-center text-center gap-2 sm:gap-4"
                style={{ borderColor: theme.innerDashed }}
              >
                {/* Pines / Clavos decorativos del letrero en esquinas */}
                <span
                  className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-inner border border-white"
                  style={{ backgroundColor: theme.cardBorder }}
                />
                <span
                  className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-inner border border-white"
                  style={{ backgroundColor: theme.cardBorder }}
                />
                <span
                  className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-inner border border-white"
                  style={{ backgroundColor: theme.cardBorder }}
                />
                <span
                  className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-inner border border-white"
                  style={{ backgroundColor: theme.cardBorder }}
                />

                {/* Banderín superior del letrero */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full text-[10px] sm:text-xs font-fredoka font-black uppercase tracking-wider shadow-2xs border"
                  style={{
                    backgroundColor: theme.ribbonBg,
                    borderColor: theme.ribbonBorder,
                    color: theme.ribbonText,
                  }}
                >
                  <Sparkles size={12} />
                  <span>Letrero de la Ruta · {stationNumberLabel}</span>
                </div>

                {/* Mensaje narrativo principal */}
                <p className="font-fredoka font-bold text-sm sm:text-lg md:text-2xl lg:text-[26px] text-[#3B2A5C] leading-snug sm:leading-relaxed max-w-2xl px-1">
                  “{message}”
                </p>

                {/* Botón de acción para iniciar la actividad */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onContinue}
                  className="mt-0.5 sm:mt-1 inline-flex items-center justify-center gap-2 px-5 py-1.5 sm:px-8 sm:py-3 rounded-full font-fredoka font-extrabold text-xs sm:text-base md:text-lg cursor-pointer transition-all border-b-3"
                  style={{
                    background: theme.btnGradient,
                    borderColor: theme.btnBorder,
                    color: theme.btnText,
                    boxShadow: theme.btnShadow,
                  }}
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight size={18} className="stroke-[2.5]" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Espaciador inferior sutil */}
      <div className="h-2 sm:h-4 shrink-0" />
    </div>
  );
};

