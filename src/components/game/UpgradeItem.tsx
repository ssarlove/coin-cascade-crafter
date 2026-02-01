import { motion } from 'framer-motion';
import { PixelIcon } from './PixelIcon';
import { formatNum, Upgrade } from '@/hooks/useGameStore';

interface UpgradeItemProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onBuy: () => void;
  index: number;
}

export function UpgradeItem({ upgrade, canAfford, onBuy, index }: UpgradeItemProps) {
  const colors = ['bg-retro-cyan', 'bg-orange-500', 'bg-retro-green', 'bg-retro-yellow'];
  const bgColor = colors[index % colors.length];

  return (
    <motion.div
      className={`mb-2 flex cursor-pointer items-center gap-2 border-3 border-foreground p-2 ${bgColor} ${
        !canAfford ? 'brightness-50 grayscale' : ''
      }`}
      style={{ boxShadow: '4px 4px 0 hsl(0 0% 0%)' }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={canAfford ? { 
        scale: 1.02, 
        boxShadow: '6px 6px 0 hsl(0 0% 0%)',
        x: -2,
        y: -2,
      } : {}}
      whileTap={canAfford ? { scale: 0.98 } : {}}
      onClick={() => canAfford && onBuy()}
    >
      <PixelIcon type={upgrade.type} size={40} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between border-b-2 border-foreground font-impact text-sm uppercase">
          <span className="truncate">{upgrade.name}</span>
          <span className="ml-2 whitespace-nowrap">{formatNum(upgrade.cost)}🪙</span>
        </div>
        <div className="text-xs italic">{upgrade.desc}</div>
        <div className="font-mono text-xs font-bold">
          OWNED: {upgrade.count} | +{upgrade.auto}/sec | +{upgrade.power}/click
        </div>
      </div>
    </motion.div>
  );
}
