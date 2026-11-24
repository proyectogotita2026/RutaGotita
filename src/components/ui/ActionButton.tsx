import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export type ButtonVariant =
  'primary' | 'secondary' | 'pink' | 'mint' | 'lavender' | 'hudn' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ActionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  pulse?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blh-sky-400 to-blh-sky-500 text-white shadow-md shadow-blh-sky-200 border-b-4 border-blh-sky-600 hover:brightness-105 active:border-b-0 active:translate-y-1',
  pink: 'bg-gradient-to-r from-blh-pink-400 to-blh-pink-500 text-white shadow-md shadow-blh-pink-200 border-b-4 border-blh-pink-600 hover:brightness-105 active:border-b-0 active:translate-y-1',
  mint: 'bg-gradient-to-r from-blh-mint-400 to-blh-mint-500 text-slate-800 shadow-md shadow-blh-mint-200 border-b-4 border-blh-mint-600 hover:brightness-105 active:border-b-0 active:translate-y-1 font-bold',
  lavender:
    'bg-gradient-to-r from-blh-lavender-400 to-blh-lavender-500 text-white shadow-md shadow-blh-lavender-200 border-b-4 border-blh-lavender-600 hover:brightness-105 active:border-b-0 active:translate-y-1',
  hudn: 'bg-gradient-to-r from-blh-hudn-blue to-blh-hudn-teal text-white shadow-lg shadow-sky-900/20 border-b-4 border-blue-950 hover:brightness-110 active:border-b-0 active:translate-y-1',
  secondary:
    'bg-white/90 text-slate-700 hover:bg-white shadow-sm border border-slate-200 hover:border-slate-300 active:translate-y-0.5',
  ghost: 'bg-white/60 hover:bg-white/90 text-slate-600 hover:text-slate-900 backdrop-blur-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5 font-semibold',
  md: 'text-sm px-4 py-2 rounded-2xl gap-2 font-bold',
  lg: 'text-base px-6 py-3 rounded-2xl gap-2.5 font-extrabold',
  xl: 'text-lg md:text-xl px-8 py-4 rounded-3xl gap-3 font-black tracking-wide',
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  pulse = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      animate={
        pulse && !disabled
          ? {
              scale: [1, 1.04, 1],
              boxShadow: [
                '0 4px 14px rgba(251, 113, 148, 0.3)',
                '0 8px 24px rgba(251, 113, 148, 0.6)',
                '0 4px 14px rgba(251, 113, 148, 0.3)',
              ],
            }
          : undefined
      }
      transition={
        pulse
          ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 400, damping: 20 }
      }
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  );
};
