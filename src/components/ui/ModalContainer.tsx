import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showCloseButton = true,
}) => {
  // Manejo de la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          {/* Backdrop con desenfoque suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Tarjeta del modal con altura máxima adaptada a pantallas horizontales */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidth} max-h-[92dvh] flex flex-col glass-modal rounded-2xl sm:rounded-3xl shadow-cardGlow border-2 border-white/90 overflow-hidden z-10 my-auto`}
          >
            {/* Header decorativo fijo */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-blh-sky-100/60 flex-shrink-0 bg-white/70">
                <div className="pr-2 min-w-0">
                  {title && (
                    <div className="text-base sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight font-display truncate">
                      {title}
                    </div>
                  )}
                  {subtitle && (
                    <div className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-500 mt-0.5 truncate">
                      {subtitle}
                    </div>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer flex-shrink-0"
                    aria-label="Cerrar modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Contenido con scroll independiente para no salirse de pantalla horizontal */}
            <div className="p-3.5 sm:p-5 md:p-6 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
