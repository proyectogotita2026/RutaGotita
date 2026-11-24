import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  shape: 'heart' | 'droplet' | 'star' | 'circle' | 'ribbon';
  color: string;
}

const COLORS = [
  '#FFD36E', // Dorado meta
  '#F6A6C9', // Rosa
  '#B79CE8', // Lila
  '#BFEBDD', // Menta
  '#7EC1FF', // Celeste
  '#FFF8F3', // Crema
];

export const Confetti: React.FC<ConfettiProps> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasFiredRef = useRef<boolean>(false);

  useEffect(() => {
    // Solo disparar una vez y respetar prefers-reduced-motion
    if (!active || hasFiredRef.current) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    hasFiredRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 60-80 partículas
    const particleCount = 70;
    const particles: Particle[] = [];
    const shapes: ('heart' | 'droplet' | 'star' | 'circle' | 'ribbon')[] = [
      'heart',
      'droplet',
      'star',
      'circle',
      'ribbon',
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: -20 - Math.random() * (height * 0.4),
        vx: (Math.random() - 0.5) * 3,
        vy: 2.2 + Math.random() * 3.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        size: 8 + Math.random() * 10,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    let animationId: number;
    const startTime = performance.now();
    const duration = 3200; // 3.2 segundos y se detiene suavemente

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ribbon') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 'heart') {
        // Corazón en Canvas
        ctx.font = `${Math.round(p.size * 1.2)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', 0, 0);
      } else if (p.shape === 'droplet') {
        // Gotita de leche / agua
        ctx.font = `${Math.round(p.size * 1.2)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💧', 0, 0);
      } else if (p.shape === 'star') {
        // Estrellita brillante
        ctx.font = `${Math.round(p.size * 1.2)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', 0, 0);
      }

      ctx.restore();
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const fadeOutFactor = elapsed > duration - 900 ? (duration - elapsed) / 900 : 1;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, fadeOutFactor);

        // Suave ondulación de viento
        p.vx += Math.sin(elapsed / 250 + p.y / 80) * 0.05;

        drawParticle(p);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
