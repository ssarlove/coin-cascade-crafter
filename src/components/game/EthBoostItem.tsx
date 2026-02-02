import { motion } from 'framer-motion';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

export interface EthBoost {
  id: string;
  name: string;
  desc: string;
  effect: string;
  icon: string;
}

const RECIPIENT_WALLET = '0x49324FD13114ecceDde5173998c85652343105e4' as `0x${string}`;

interface EthBoostItemProps {
  boost: EthBoost;
  isPurchased: boolean;
  onPurchased: (id: string) => void;
  index: number;
}

export function EthBoostItem({ boost, isPurchased, onPurchased, index }: EthBoostItemProps) {
  const { isConnected } = useAccount();
  const [pendingTx, setPendingTx] = useState<`0x${string}` | undefined>();
  
  const { sendTransaction, isPending } = useSendTransaction();
  
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: pendingTx,
  });

  useEffect(() => {
    if (isSuccess && pendingTx) {
      onPurchased(boost.id);
      setPendingTx(undefined);
    }
  }, [isSuccess, pendingTx, boost.id, onPurchased]);

  const handleBuy = async () => {
    if (!isConnected || isPurchased || isPending) return;
    
    try {
      sendTransaction({
        to: RECIPIENT_WALLET,
        value: parseEther('0.0001'), // Minimal amount, essentially just gas
      }, {
        onSuccess: (hash) => {
          setPendingTx(hash);
        },
      });
    } catch (e) {
      console.error('Transaction failed:', e);
    }
  };

  const disabled = !isConnected || isPurchased || isPending;

  return (
    <motion.div
      className={`mb-3 cursor-pointer border-4 border-foreground p-3 ${
        isPurchased ? 'bg-retro-green' : 'bg-gradient-to-r from-retro-cyan to-retro-magenta'
      } ${disabled && !isPurchased ? 'brightness-75' : ''}`}
      style={{ 
        boxShadow: '6px 6px 0 hsl(0 0% 0%)',
        transform: 'rotate(-1deg)',
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: -1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!disabled ? { 
        scale: 1.05, 
        rotate: 1,
        boxShadow: '8px 8px 0 hsl(300 100% 50%)',
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleBuy}
    >
      {/* VHS scanline overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
      
      <div className="relative flex items-center gap-3">
        <motion.div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-3 border-foreground bg-black text-3xl"
          animate={!isPurchased ? {
            scale: [1, 1.2, 1],
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          {boost.icon}
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center justify-between border-b-2 border-foreground font-impact text-base uppercase">
            <span className="text-shadow-retro">{boost.name}</span>
            <span className="font-mono text-xs">
              {isPurchased ? '✓ OWNED' : isPending ? '⏳...' : 'GAS ONLY'}
            </span>
          </div>
          <div className="text-xs italic opacity-90">{boost.desc}</div>
          <div className="mt-1 font-mono text-xs font-bold text-retro-yellow">
            {boost.effect}
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className="mt-2 text-center font-mono text-xs text-retro-red">
          CONNECT WALLET FIRST!
        </div>
      )}
    </motion.div>
  );
}

export const ETH_BOOSTS: EthBoost[] = [
  { id: 'golden_touch', name: 'Golden Touch', desc: 'Midas would be jealous', effect: '+1M COINS INSTANTLY', icon: '👆' },
  { id: 'time_warp', name: 'Time Warp', desc: 'Skip ahead in time', effect: '+5 MIN AUTO INCOME', icon: '⏰' },
  { id: 'whale_mode', name: 'Whale Mode', desc: 'Become the market', effect: '5X CLICK POWER (PERMANENT)', icon: '🐋' },
  { id: 'robot_army', name: 'Robot Army', desc: 'Automation revolution', effect: '3X AUTO RATE (PERMANENT)', icon: '🤖' },
  { id: 'lucky_coin', name: 'Lucky Coin', desc: 'Fortune favors you', effect: '10% CRIT CHANCE (2X CLICKS)', icon: '🍀' },
];
