import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBadgeProps {
  current: number;
  total: number;
  label?: string;
  isCompleted?: boolean;
}

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({
  current,
  total,
  label = 'Estación',
  isCompleted = false,
}) => {
  const isStart = current === 0;
  const isGoal = current >= total - 1;

  const percentage = Math.round((current / (total - 1)) * 100);

  let statusText = `${label} ${current} de ${total - 2}`;
  if (isStart) statusText = 'Punto de Partida 🌱';
  if (isGoal) statusText = '¡Meta Alcanzada! 🏆';

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#B79CE8]/30 shadow-xs whitespace-nowrap flex-nowrap select-none"
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isGoal
            ? 'bg-amber-400 animate-ping'
            : isCompleted
              ? 'bg-emerald-500'
              : 'bg-[#B79CE8] animate-pulse'
        }`}
      />
      <span className="text-[11px] sm:text-xs font-black text-[#3B2A5C] tracking-tight">
        {statusText} <span className="opacity-40">•</span>{' '}
        <span className="text-[#6B4FA8]">{percentage}%</span>
      </span>
    </motion.div>
  );
};
