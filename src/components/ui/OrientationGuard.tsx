import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Smartphone, Sparkles } from 'lucide-react';

interface OrientationGuardProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const OrientationGuard: React.FC<OrientationGuardProps> = ({ children, enabled = true }) => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    // Función para evaluar si la pantalla está en posición vertical
    const checkOrientation = () => {
      // 1. Usar window.matchMedia('(orientation: portrait)') si está disponible
      const mediaQuery = window.matchMedia('(orientation: portrait)');
      const isHeightGreater = window.innerHeight > window.innerWidth;

      // Se considera portrait si la orientación es portrait y la pantalla es de tamaño móvil/tablet
      // o la altura es mayor que el ancho.
      setIsPortrait(mediaQuery.matches || isHeightGreater);
    };

    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return (
    <>
      {/* Contenido principal de la aplicación */}
      {children}

      {/* Pantalla bloqueadora amable cuando el dispositivo está en orientación vertical */}
      <AnimatePresence>
        {enabled && isPortrait && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-blh-sky-100 via-blh-lavender-50 to-blh-pink-100 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-blh-sky-200/50 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blh-pink-200/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative max-w-sm w-full bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-cardGlow border-2 border-white flex flex-col items-center text-slate-800">
              {/* Animación del teléfono girando de vertical a horizontal */}
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 0, 90, 90, 0],
                    scale: [1, 1, 1.08, 1.08, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    times: [0, 0.25, 0.5, 0.75, 1],
                    ease: 'easeInOut',
                  }}
                  className="w-16 h-28 border-4 border-blh-hudn-blue rounded-2xl bg-blh-sky-50 shadow-md flex flex-col items-center justify-between p-1.5"
                >
                  {/* Altavoz del teléfono */}
                  <div className="w-4 h-1 bg-blh-hudn-blue/40 rounded-full" />

                  {/* Pantalla con la Gotita sonriente */}
                  <div className="w-full flex-1 my-1 rounded-lg bg-blh-sky-200/60 flex items-center justify-center">
                    <span className="text-xl">💧</span>
                  </div>

                  {/* Botón inferior */}
                  <div className="w-2.5 h-2.5 rounded-full border border-blh-hudn-blue/40" />
                </motion.div>

                {/* Flecha circular de giro */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute -top-1 -right-1 text-blh-pink-500"
                >
                  <RotateCw size={26} className="stroke-[2.5]" />
                </motion.div>
              </div>

              {/* Tag institucional */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blh-sky-100 text-blh-hudn-blue text-xs font-black mb-3">
                <Sparkles size={13} className="text-blh-sky-600" />
                Banco de Leche Humana • HUDN
              </div>

              {/* Título */}
              <h2 className="text-2xl font-black text-slate-800 mb-2 font-display">
                ¡Gira tu dispositivo!
              </h2>

              {/* Instrucción clara */}
              <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-4">
                Para vivir la aventura de <strong>"La Ruta de la Gotita"</strong>, por favor usa tu
                celular o tablet en{' '}
                <span className="text-blh-pink-600 font-extrabold">posición horizontal</span>.
              </p>

              {/* Indicador táctil */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <Smartphone size={14} />
                <span>Modo horizontal requerido</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
