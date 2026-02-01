import { motion } from 'framer-motion';
import { formatNum } from '@/hooks/useGameStore';

interface StatsBoxProps {
  coins: number;
  autoRate: number;
  clickPower: number;
}

export function StatsBox({ coins, autoRate, clickPower }: StatsBoxProps) {
  return (
    <motion.div
      className="relative z-10 mb-5 border-4 border-card bg-foreground p-4 font-mono text-retro-terminal"
      style={{
        boxShadow: '6px 6px 0 hsl(300 100% 50%)',
      }}
      initial={{ rotate: -1 }}
      animate={{ rotate: [-1, -2, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="text-sm">NET_WORTH:</div>
      <motion.div
        className="text-4xl font-bold terminal-glow"
        key={Math.floor(coins)}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.2 }}
      >
        {formatNum(coins)}
      </motion.div>
      <div className="mt-2 border-t-2 border-dashed border-retro-terminal pt-2 text-xs">
        <span>AUTO: </span>
        <motion.span
          key={autoRate}
          initial={{ color: 'hsl(120 100% 50%)' }}
          animate={{ color: ['hsl(120 100% 50%)', 'hsl(120 100% 70%)', 'hsl(120 100% 50%)'] }}
          transition={{ duration: 0.5 }}
        >
          {formatNum(autoRate)}
        </motion.span>
        <span>/SEC | CLICK: </span>
        <span>{formatNum(clickPower)}</span>
      </div>
    </motion.div>
  );
}
