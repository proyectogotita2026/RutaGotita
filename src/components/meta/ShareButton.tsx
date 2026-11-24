import React, { useState, useCallback } from 'react';
import { Share2, Check } from 'lucide-react';
import { TEXTO_COMPARTIR } from '../../config/metaConfig';

interface ShareButtonProps {
  className?: string;
  variant?: 'primary' | 'outline';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  className = '',
  variant = 'primary',
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'La Ruta de la Gotita',
      text: TEXTO_COMPARTIR,
      url: typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '',
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        // Si el usuario canceló el share nativo, no hacemos nada
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    // Fallback al portapapeles
    try {
      const textToCopy = `${shareData.text} ${shareData.url}`.trim();
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback silencioso si el navegador bloquea
    }
  }, []);

  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`min-h-[48px] sm:min-h-[52px] px-6 py-2.5 rounded-full font-fredoka font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 outline-none focus-visible:ring-3 ${
        isPrimary
          ? copied
            ? 'bg-emerald-600 text-white shadow-md'
            : 'bg-gradient-to-r from-[#F6A6C9] via-[#D9609A] to-[#C04880] text-white shadow-[0_8px_20px_-4px_rgba(217,96,154,0.45)] hover:brightness-105 active:scale-[0.98] focus-visible:ring-[#D9609A]'
          : 'border-2 border-[#B79CE8] bg-white/95 text-[#6B4FA8] shadow-sm hover:bg-[#FFF3F8] active:scale-[0.98] focus-visible:ring-[#B79CE8]/50'
      } ${className}`}
      aria-label="Compartir La Ruta de la Gotita"
    >
      {copied ? (
        <>
          <Check size={20} className="stroke-[3]" />
          <span>¡Enlace copiado!</span>
        </>
      ) : (
        <>
          <Share2 size={20} className={isPrimary ? 'text-white' : 'text-[#6B4FA8]'} />
          <span>Compartir experiencia</span>
        </>
      )}
    </button>
  );
};
