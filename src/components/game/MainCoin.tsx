import { motion } from 'framer-motion';
import { useState } from 'react';

interface MainCoinProps {
  onClick: () => number;
  onFloatingNumber: (x: number, y: number, value: number) => void;
}

export function MainCoin({ onClick, onFloatingNumber }: MainCoinProps) {
  const [isClicking, setIsClicking] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    const value = onClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    onFloatingNumber(x, y, value);
    setIsClicking(true);
    setRotation(r => r + (Math.random() - 0.5) * 20);
    
    setTimeout(() => setIsClicking(false), 50);
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-none bg-retro-gold"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ filter: 'blur(20px)' }}
      />
      
      {/* Ring pulse */}
      <motion.div
        className="absolute border-4 border-retro-gold"
        style={{ width: 160, height: 160 }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />

      {/* Main coin */}
      <motion.div
        className="relative flex cursor-pointer select-none items-center justify-center border-5 border-foreground bg-retro-gold text-6xl font-bold"
        style={{
          width: 140,
          height: 140,
          boxShadow: `
            10px 10px 0 hsl(0 0% 0%),
            inset -6px -6px 0 hsl(43 100% 36%),
            inset 6px 6px 0 hsl(60 100% 90%)
          `,
        }}
        animate={{
          scale: isClicking ? 0.9 : 1,
          rotate: rotation,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{
          scale: { duration: 0.05 },
          rotate: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        onClick={handleClick}
      >
        {/* Inner shine animation */}
        <motion.div
          className="absolute inset-2 opacity-30"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, white 50%, transparent 100%)',
          }}
          animate={{
            x: [-60, 60],
            y: [-60, 60],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        
        <motion.span
          animate={{
            textShadow: [
              '0 0 10px hsl(51 100% 50%)',
              '0 0 20px hsl(51 100% 70%)',
              '0 0 10px hsl(51 100% 50%)',
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        >
          $
        </motion.span>
      </motion.div>
    </div>
  );
}
