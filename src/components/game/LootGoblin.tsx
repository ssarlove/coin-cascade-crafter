import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface LootGoblinProps {
  visible: boolean;
  x: number;
  y: number;
  onClick: () => void;
}

export function LootGoblin({ visible, x, y, onClick }: LootGoblinProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const draw = (frame: number) => {
      ctx.clearRect(0, 0, 60, 60);
      ctx.save();
      ctx.scale(3.75, 3.75);

      // Background
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, 0, 16, 16);

      // Body with bounce
      const bounce = Math.sin(frame * 0.3) * 1;
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(4, 6 + bounce, 8, 8);

      // Ears
      ctx.fillRect(2, 4 + bounce, 2, 3);
      ctx.fillRect(12, 4 + bounce, 2, 3);

      // Eyes (blinking)
      if (frame % 30 !== 0) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(5, 8 + bounce, 2, 2);
        ctx.fillRect(9, 8 + bounce, 2, 2);
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 9 + bounce, 1, 1);
        ctx.fillRect(10, 9 + bounce, 1, 1);
      } else {
        ctx.fillStyle = '#006400';
        ctx.fillRect(5, 9 + bounce, 2, 1);
        ctx.fillRect(9, 9 + bounce, 2, 1);
      }

      // Mouth (grinning)
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(6, 11 + bounce, 4, 2);
      ctx.fillStyle = '#FFF';
      ctx.fillRect(7, 11 + bounce, 1, 1);
      ctx.fillRect(9, 11 + bounce, 1, 1);

      // Gold bag (swinging)
      const swing = Math.sin(frame * 0.2) * 1;
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(2 + swing, 10, 4, 5);
      ctx.fillStyle = '#000';
      ctx.fillRect(3 + swing, 10, 2, 1);

      // Sparkles
      if (frame % 8 < 4) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(1, 2, 1, 1);
        ctx.fillRect(14, 5, 1, 1);
        ctx.fillRect(8, 1, 1, 1);
      }

      ctx.restore();
    };

    draw(0);
    const interval = setInterval(() => {
      frameRef.current++;
      draw(frameRef.current);
    }, 80);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.canvas
          ref={canvasRef}
          width={60}
          height={60}
          className="absolute z-50 cursor-pointer border-3 border-foreground"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
            boxShadow: '5px 5px 0 hsl(0 0% 0%)',
            imageRendering: 'pixelated',
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: [-5, 5, -5],
          }}
          exit={{
            scale: 0,
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            scale: { type: 'spring', stiffness: 500, damping: 15 },
            rotate: { duration: 0.5, repeat: Infinity },
          }}
          whileHover={{
            scale: 1.2,
            boxShadow: '8px 8px 0 hsl(0 0% 0%)',
          }}
          onClick={onClick}
        />
      )}
    </AnimatePresence>
  );
}
