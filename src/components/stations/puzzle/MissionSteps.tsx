import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Users, Clock, BookOpen, X, Sparkles, ExternalLink } from 'lucide-react';

interface MissionStepsProps {
  fullInstruction?: string;
  isCompactLandscape?: boolean;
}

export const MissionSteps: React.FC<MissionStepsProps> = ({
  fullInstruction,
  isCompactLandscape = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const defaultFullText =
    fullInstruction ||
    '1. Crear equipo: Crear 3 equipos de igual cantidad de jugadores.\n2. Armar el rompecabezas: Trabajar en equipo para acabar el rompecabezas antes de los 5 minutos.\n3. Explicar el contenido: Indicar el tema del rompecabezas que le corresponde a cada equipo.';

  const steps = [
    {
      num: 1,
      icon: Users,
      title: 'Crear equipo',
      detail: (
        <>
          Crear{' '}
          <strong className="text-[#3B2A5C] bg-[#FFE69A]/80 px-1 py-0.2 rounded font-bold">
            3 equipos
          </strong>{' '}
          de igual cantidad de jugadores.
        </>
      ),
    },
    {
      num: 2,
      icon: Clock,
      title: 'Armar el rompecabezas',
      detail: (
        <>
          Trabajar en equipo para acabar el rompecabezas antes de los{' '}
          <strong className="text-[#3B2A5C] bg-[#FFE69A]/80 px-1 py-0.2 rounded font-bold">
            5 minutos
          </strong>
          .
        </>
      ),
    },
    {
      num: 3,
      icon: BookOpen,
      title: 'Explicar el contenido',
      detail: (
        <>
          Indicar el tema del{' '}
          <strong className="text-[#3B2A5C] bg-[#FFE69A]/80 px-1 py-0.2 rounded font-bold">
            rompecabezas
          </strong>{' '}
          que le corresponde a cada equipo.
        </>
      ),
    },
  ];

  return (
    <>
      <div
        className={`watercolor-glass-card rounded-3xl ${
          isCompactLandscape ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-5 md:p-6'
        } border border-white/90 shadow-xs relative select-none w-full`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-fredoka font-bold uppercase tracking-wider bg-[#FFF3CC] text-[#E08A00] border border-[#E08A00]/30 shadow-2xs">
            <Puzzle size={14} className="text-[#E08A00]" />
            <span>Misión Grupal</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-fredoka font-bold text-[#E08A00] hover:text-[#3B2A5C] underline decoration-[#FFC857] decoration-2 underline-offset-2 transition-colors cursor-pointer py-1 px-1.5"
            aria-label="Ver misión completa en detalle"
          >
            <span>Ver detalle</span>
            <ExternalLink size={12} />
          </button>
        </div>

        {/* 3 Pasos Compactos */}
        <div className={`flex flex-col ${isCompactLandscape ? 'gap-1' : 'gap-2 sm:gap-3'}`}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`flex items-start ${
                  isCompactLandscape ? 'gap-2 p-0.5' : 'gap-2.5 sm:gap-3.5 p-1'
                } rounded-xl hover:bg-white/40 transition-colors`}
              >
                {/* Icono de paso */}
                <div
                  className={`${
                    isCompactLandscape ? 'w-6 h-6' : 'w-8 h-8'
                  } rounded-full bg-gradient-to-br from-[#FFF3CC] to-[#FFE69A] border border-[#FFC857] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 text-[#E08A00]`}
                >
                  <Icon size={isCompactLandscape ? 13 : 16} className="stroke-[2.5]" />
                </div>

                {/* Título y Descripción */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`${
                      isCompactLandscape
                        ? 'text-xs leading-tight'
                        : 'text-[15px] sm:text-base md:text-[17px] leading-snug'
                    } font-fredoka font-bold text-[#3B2A5C]`}
                  >
                    {step.num}. {step.title}
                  </h4>
                  <p
                    className={`${
                      isCompactLandscape
                        ? 'text-[11px] leading-tight mt-0.2'
                        : 'text-sm sm:text-[15px] md:text-base leading-snug mt-0.5'
                    } font-sans text-[#4A3B66]`}
                  >
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Bottom Sheet */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#3B2A5C]/40 backdrop-blur-xs">
            <div
              className="absolute inset-0"
              onClick={() => setIsModalOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-lg bg-[#FFF8F3] rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border border-white z-10 max-h-[85dvh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-[#E08A00]/20 rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#FFF3CC] border border-[#FFC857] flex items-center justify-center text-[#E08A00]">
                    <Puzzle size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-fredoka font-bold text-[#3B2A5C]">
                      Instrucción Completa
                    </h3>
                    <span className="text-xs font-fredoka text-[#6E5C8A]">
                      Dinámica Presencial · 5 minutos
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-[#6E5C8A] hover:text-[#3B2A5C] shadow-xs cursor-pointer transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm sm:text-base font-sans text-[#3B2A5C] leading-relaxed bg-white/80 p-4 rounded-2xl border border-white/90 shadow-2xs">
                <p>{defaultFullText}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF3CC]/60 border border-[#FFC857]/40 text-xs font-fredoka font-semibold text-[#8C5400]">
                <Sparkles size={15} className="shrink-0 text-[#E08A00]" />
                <span>¡La cooperación de todo el equipo es el secreto para lograrlo!</span>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-5 w-full min-h-[48px] rounded-full font-fredoka font-bold text-base text-[#3B2A5C] shadow-md cursor-pointer transition-all border-b-2 border-[#C97B00]"
                style={{
                  background: 'linear-gradient(135deg, #FFC857 0%, #E08A00 100%)',
                }}
              >
                ¡Entendido, vamos a armar!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
