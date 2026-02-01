import { motion } from 'framer-motion';
import { PixelIcon } from './PixelIcon';
import { Upgrade } from '@/hooks/useGameStore';

interface OrbitIconsProps {
  upgrades: Upgrade[];
  centerX: number;
  centerY: number;
  radius: number;
}

export function OrbitIcons({ upgrades, centerX, centerY, radius }: OrbitIconsProps) {
  const ownedUpgrades = upgrades.filter(u => u.count > 0);
  
  return (
    <>
      {ownedUpgrades.map((upgrade, index) => {
        const totalOwned = ownedUpgrades.length;
        const baseAngle = (index / Math.max(totalOwned, 1)) * Math.PI * 2;
        
        return (
          <motion.div
            key={upgrade.id}
            className="absolute"
            style={{
              left: centerX,
              top: centerY,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: [
                Math.cos(baseAngle) * radius,
                Math.cos(baseAngle + Math.PI * 2) * radius,
              ],
              y: [
                Math.sin(baseAngle) * radius,
                Math.sin(baseAngle + Math.PI * 2) * radius,
              ],
            }}
            transition={{
              scale: { type: 'spring', stiffness: 300, damping: 20 },
              x: { duration: 20 + index * 2, repeat: Infinity, ease: 'linear' },
              y: { duration: 20 + index * 2, repeat: Infinity, ease: 'linear' },
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <PixelIcon 
                type={upgrade.type} 
                size={40}
                className="retro-shadow-sm"
              />
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}
