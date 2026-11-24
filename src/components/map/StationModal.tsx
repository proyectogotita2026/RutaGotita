import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import type { StationData } from '../../types/route.types';
import { ModalContainer } from '../ui/ModalContainer';
import { ActionButton } from '../ui/ActionButton';
import { rutafinalHospitalImg } from '../../assets/images';

interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: StationData | null;
  onCompleteStation: (stationId: string) => void;
  onAdvanceNext: () => void;
  hasNextStation: boolean;
}

export const StationModal: React.FC<StationModalProps> = ({
  isOpen,
  onClose,
  station,
  onCompleteStation,
  onAdvanceNext,
  hasNextStation,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showRiddleAnswer, setShowRiddleAnswer] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  if (!station) return null;

  const handleSelectQuizOption = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    if (isCorrect) {
      setQuizCompleted(true);
      onCompleteStation(station.id);
    }
  };

  const handleContinue = () => {
    onCompleteStation(station.id);
    onClose();
    if (hasNextStation) {
      onAdvanceNext();
    }
  };

  const isGoal = station.type === 'goal';

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blh-sky-100 text-blh-sky-600 text-xs font-black uppercase tracking-wider">
            {station.numberLabel || 'Estación'}
          </span>
          <span>{station.name}</span>
        </div>
      }
      subtitle={station.subtitle}
    >
      <div className="space-y-5 text-slate-700">
        {/* Imagen Ilustrada de Misión Cumplida en el Hospital HUDN */}
        {isGoal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border-2 border-[#BFEBDD] bg-white flex items-center justify-center p-2"
          >
            <img
              src={rutafinalHospitalImg}
              alt="Llegada al Banco de Leche Humana Hospital Universitario Departamental de Nariño"
              className="w-full h-auto max-h-[300px] sm:max-h-[360px] object-contain rounded-xl select-none"
            />
            {/* Insignia flotante de Victoria */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-300 shadow-sm flex items-center gap-1.5 text-xs font-fredoka font-bold text-emerald-700">
              <Sparkles size={14} className="text-amber-500 fill-amber-400" />
              <span>¡Misión Cumplida!</span>
            </div>
          </motion.div>
        )}

        {/* Contenido Educativo Principal */}
        <div className="bg-blh-sky-50/70 border border-blh-sky-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white shadow-sm text-blh-sky-500 flex-shrink-0">
            {isGoal ? <Award size={22} className="text-amber-500" /> : <BookOpen size={22} />}
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-blh-hudn-blue uppercase tracking-wide">
              {isGoal ? '¡Mensaje Especial del Banco de Leche!' : '¿Sabías que...?'}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
              {station.educationalContent}
            </p>
          </div>
        </div>

        {/* Sección de Adivinanza (si existe) */}
        {station.riddle && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 text-amber-800 font-extrabold text-sm">
              <Lightbulb size={18} className="text-amber-500 fill-amber-400" />
              <span>Adivinanza de la Gotita</span>
            </div>
            <p className="text-xs sm:text-sm italic font-semibold text-slate-700 mb-3 bg-white/70 p-3 rounded-xl border border-amber-100">
              "{station.riddle.riddleText}"
            </p>

            {!showRiddleAnswer ? (
              <button
                type="button"
                onClick={() => setShowRiddleAnswer(true)}
                className="text-xs font-black text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={14} />
                Revelar pista y respuesta
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5 bg-white p-3.5 rounded-xl border border-amber-200"
              >
                <div className="text-xs sm:text-sm font-black text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  Respuesta: {station.riddle.answerText}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  <strong>Dato curioso:</strong> {station.riddle.funFact}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Sección de Trivia / Quiz Didáctico (si existe) */}
        {station.quiz && (
          <div className="bg-white rounded-2xl border-2 border-slate-100 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-800 font-extrabold text-sm">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-blh-pink-500" />
                <span>Pregunta de Aprendizaje:</span>
              </div>
              {quizCompleted && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ¡Superada! ✨
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700">{station.quiz.question}</p>

            <div className="space-y-2 mt-2">
              {station.quiz.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700';

                if (isSelected) {
                  optionStyle = option.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm'
                    : 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectQuizOption(option.id, option.isCorrect)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer select-none ${optionStyle}`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isSelected ? (
                        option.isCorrect ? (
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        ) : (
                          <XCircle size={16} className="text-rose-500" />
                        )
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Mensaje de retroalimentación inmediata */}
            <AnimatePresence>
              {selectedOptionId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium"
                >
                  {station.quiz.options.find((o) => o.id === selectedOptionId)?.feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Insignia / Recompensa desbloqueada */}
        {station.badgeReward && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blh-pink-50 to-blh-lavender-50 border border-blh-pink-200/60">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">
              {station.badgeReward.emoji}
            </div>
            <div>
              <div className="text-xs font-black text-blh-pink-600 uppercase tracking-wider flex items-center gap-1">
                <Award size={13} />
                Insignia Ganada
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                {station.badgeReward.title}
              </div>
              <div className="text-[11px] text-slate-500">{station.badgeReward.description}</div>
            </div>
          </div>
        )}

        {/* Botones de Acción en el pie del modal */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-2 px-3 cursor-pointer"
          >
            Explorar el mapa libremente
          </button>

          <ActionButton
            size="md"
            variant={isGoal ? 'mint' : 'primary'}
            onClick={handleContinue}
            iconRight={<ChevronRight size={18} />}
            className="w-full sm:w-auto"
          >
            {isGoal
              ? '¡Celebrar Misión Cumplida! 🏆'
              : station.type === 'start'
                ? '¡Iniciar la Ruta! 🚀'
                : hasNextStation
                  ? '¡Siguiente Estación!'
                  : 'Cerrar Estación'}
          </ActionButton>
        </div>
      </div>
    </ModalContainer>
  );
};
