import { motion, PanInfo, useAnimation } from 'framer-motion';
import { PixelIcon } from './PixelIcon';
import { formatNum, Upgrade } from '@/hooks/useGameStore';
import { useState } from 'react';

interface UpgradeItemProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onBuy: () => void;
  onSwipeLeft: () => void;
  index: number;
}

export function UpgradeItem({ upgrade, canAfford, onBuy, onSwipeLeft, index }: UpgradeItemProps) {
  const colors = ['bg-retro-cyan', 'bg-orange-500', 'bg-retro-green', 'bg-retro-yellow'];
  const bgColor = colors[index % colors.length];
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (info.offset.x < -100 && upgrade.count > 0) {
      // Swiped left far enough and has owned items
      onSwipeLeft();
    }
    // Snap back
    await controls.start({ x: 0 });
    setIsDragging(false);
  };

  return (
    <motion.div
      className={`relative mb-2 overflow-hidden border-3 border-foreground ${bgColor} ${
        !canAfford ? 'brightness-50 grayscale' : ''
      }`}
      style={{ boxShadow: '4px 4px 0 hsl(0 0% 0%)' }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Swipe hint background */}
      {upgrade.count > 0 && (
        <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-retro-magenta text-card">
          <span className="font-impact text-sm">VIEW ALL →</span>
        </div>
      )}

      {/* Draggable content */}
      <motion.div
        className={`relative flex cursor-pointer items-center gap-2 p-2 ${bgColor}`}
        drag={upgrade.count > 0 ? 'x' : false}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileHover={!isDragging && canAfford ? { 
          scale: 1.02, 
          boxShadow: '6px 6px 0 hsl(0 0% 0%)',
          x: -2,
          y: -2,
        } : {}}
        whileTap={!isDragging && canAfford ? { scale: 0.98 } : {}}
        onClick={() => !isDragging && canAfford && onBuy()}
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

        {/* Swipe indicator */}
        {upgrade.count > 0 && (
          <motion.div
            className="ml-2 flex flex-col items-center text-xs opacity-50"
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span>◄</span>
            <span className="text-[10px]">SWIPE</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
