import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useChainId } from 'wagmi';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function WalletButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    if (address) {
      setDisplayName(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address]);

  if (!isConnected) {
    return (
      <motion.button
        onClick={() => open()}
        className="relative border-4 border-foreground bg-retro-cyan px-4 py-2 font-impact text-lg uppercase text-foreground"
        style={{
          boxShadow: '6px 6px 0 hsl(0 0% 0%)',
          transform: 'rotate(-2deg)',
        }}
        whileHover={{
          scale: 1.05,
          rotate: 2,
          boxShadow: '8px 8px 0 hsl(0 0% 0%)',
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          filter: [
            'brightness(1) contrast(1)',
            'brightness(1.1) contrast(1.1)',
            'brightness(0.95) contrast(1.05)',
            'brightness(1) contrast(1)',
          ],
        }}
        transition={{
          filter: {
            duration: 0.3,
            repeat: Infinity,
            repeatType: 'reverse',
          },
        }}
      >
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }}
        />
        <span className="relative z-10">🔌 CONNECT WALLET</span>
      </motion.button>
    );
  }

  // Check if on unsupported chain (Base mainnet = 8453, Base Sepolia = 84532)
  const isUnsupported = ![8453, 84532].includes(chainId);

  if (isUnsupported) {
    return (
      <motion.button
        onClick={() => open()}
        className="border-4 border-foreground bg-destructive px-4 py-2 font-impact text-lg uppercase text-destructive-foreground"
        style={{
          boxShadow: '6px 6px 0 hsl(0 0% 0%)',
          transform: 'rotate(1deg)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          x: [-2, 2, -2],
        }}
        transition={{
          x: { duration: 0.1, repeat: Infinity },
        }}
      >
        ⚠️ WRONG NETWORK
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={() => open({ view: 'Networks' })}
        className="border-4 border-foreground bg-retro-green px-3 py-2 font-impact text-sm uppercase"
        style={{
          boxShadow: '4px 4px 0 hsl(0 0% 0%)',
          transform: 'rotate(-1deg)',
        }}
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        {chainId === 8453 ? '🌐 Base' : '🌐 Base Sepolia'}
      </motion.button>

      <motion.button
        onClick={() => open({ view: 'Account' })}
        className="relative border-4 border-foreground bg-retro-yellow px-4 py-2 font-impact text-sm uppercase text-foreground"
        style={{
          boxShadow: '5px 5px 0 hsl(0 0% 0%)',
          transform: 'rotate(2deg)',
        }}
        whileHover={{
          scale: 1.05,
          rotate: -1,
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          filter: [
            'brightness(1)',
            'brightness(1.15)',
            'brightness(1)',
          ],
        }}
        transition={{
          filter: {
            duration: 0.5,
            repeat: Infinity,
          },
        }}
      >
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }}
        />
        <span className="relative z-10">
          💰 {displayName}
        </span>
      </motion.button>
    </div>
  );
}
