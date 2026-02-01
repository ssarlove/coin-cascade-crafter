import { motion } from 'framer-motion';
import { formatNum, Boost, ActiveEffect } from '@/hooks/useGameStore';

interface BoostItemProps {
  boost: Boost;
  canAfford: boolean;
  isActive: boolean;
  onBuy: () => void;
  index: number;
}

export function BoostItem({ boost, canAfford, isActive, onBuy, index }: BoostItemProps) {
  const disabled = !canAfford || isActive;

  return (
    <motion.div
      className={`mb-2 flex cursor-pointer items-center gap-2 border-3 border-foreground bg-retro-yellow p-2 ${
        disabled ? 'brightness-50 grayscale' : ''
      }`}
      style={{ boxShadow: '4px 4px 0 hsl(0 0% 0%)' }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={!disabled ? {
        scale: 1.02,
        boxShadow: '6px 6px 0 hsl(0 0% 0%)',
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onBuy()}
    >
      <motion.div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center border-3 border-foreground bg-retro-magenta text-2xl"
        animate={!disabled ? {
          rotate: [0, -10, 10, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        ⚡
      </motion.div>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b-2 border-foreground font-impact text-sm uppercase">
          <span>{boost.name}</span>
          <span>{formatNum(boost.cost)}🪙</span>
        </div>
        <div className="text-xs italic">{boost.desc}</div>
        <div className="font-mono text-xs font-bold">
          DURATION: {boost.duration}s {isActive && '(ACTIVE!)'}
        </div>
      </div>
    </motion.div>
  );
}
