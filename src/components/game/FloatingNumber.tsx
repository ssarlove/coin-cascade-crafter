import { motion } from 'framer-motion';
import { formatNum } from '@/hooks/useGameStore';

interface FloatingNumberProps {
  x: number;
  y: number;
  value: number;
  id: string;
  onComplete: (id: string) => void;
}

export function FloatingNumber({ x, y, value, id, onComplete }: FloatingNumberProps) {
  const randomX = (Math.random() - 0.5) * 100;
  const randomRotation = (Math.random() - 0.5) * 720;
  
  return (
    <motion.div
      className="pointer-events-none fixed z-50 font-impact text-2xl font-black uppercase"
      style={{
        left: x,
        top: y,
        textShadow: '2px 2px 0 hsl(0 0% 0%), -1px -1px 0 hsl(0 0% 100%)',
        color: value >= 100 ? 'hsl(120 100% 50%)' : value >= 10 ? 'hsl(60 100% 50%)' : 'hsl(0 0% 0%)',
      }}
      initial={{
        scale: 0.5,
        opacity: 0,
        y: 0,
        x: 0,
      }}
      animate={{
        scale: [0.5, 1.4, 1.2, 0.8],
        opacity: [0, 1, 1, 0],
        y: [0, -50, -120, -200],
        x: [0, randomX * 0.3, randomX * 0.6, randomX],
        rotate: [0, randomRotation * 0.2, randomRotation * 0.5, randomRotation],
      }}
      transition={{
        duration: 1.5,
        ease: 'easeOut',
        times: [0, 0.2, 0.6, 1],
      }}
      onAnimationComplete={() => onComplete(id)}
    >
      +{formatNum(value)}
    </motion.div>
  );
}
