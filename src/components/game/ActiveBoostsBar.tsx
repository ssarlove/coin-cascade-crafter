import { motion, AnimatePresence } from 'framer-motion';
import { ActiveEffect, Boost } from '@/hooks/useGameStore';

interface ActiveBoostsBarProps {
  activeEffects: ActiveEffect[];
  boosts: Boost[];
}

export function ActiveBoostsBar({ activeEffects, boosts }: ActiveBoostsBarProps) {
  if (activeEffects.length === 0) return null;

  return (
    <motion.div
      className="mx-4 mb-2 border-3 border-retro-yellow bg-foreground p-2 font-mono text-sm text-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <span className="mr-2">ACTIVE:</span>
      <AnimatePresence>
        {activeEffects.map(effect => {
          const boost = boosts.find(b => b.id === effect.id);
          return (
            <motion.span
              key={effect.id}
              className="mr-2 inline-block border-2 border-card bg-retro-red px-2 py-1 text-card"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                boxShadow: effect.timer <= 3 
                  ? ['0 0 0px red', '0 0 10px red', '0 0 0px red']
                  : 'none',
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                boxShadow: { duration: 0.5, repeat: Infinity },
              }}
            >
              {boost?.name}: {effect.timer}s
            </motion.span>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
