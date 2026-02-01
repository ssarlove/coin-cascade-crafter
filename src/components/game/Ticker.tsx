import { motion } from 'framer-motion';

export function Ticker() {
  return (
    <div className="bg-retro-red overflow-hidden border-b-4 border-foreground">
      <motion.div
        className="whitespace-nowrap py-2 text-lg font-bold text-retro-yellow"
        animate={{ x: ['100vw', '-100%'] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        !!! FULLY FUNCTIONAL !!! CLICK THE GOLD SQUARE !!! BUY UPGRADES !!! CATCH GOBLINS !!! 
        MORE UPGRADES = MORE MONEY !!! DON'T MISS THE GOBLIN !!! BOOSTS ARE TEMPORARY !!! 
        THIS IS FINANCIAL ADVICE !!!
      </motion.div>
    </div>
  );
}
