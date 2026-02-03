import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { motion } from 'framer-motion'
import WalletModal from './WalletModal'

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isConnected) {
    return (
      <motion.button
        onClick={() => disconnect()}
        className="relative font-pixel text-[8px] sm:text-[10px] px-3 py-2 sm:px-4 sm:py-3 
                   bg-gradient-to-b from-retro-green/90 to-retro-green/70
                   border-4 border-black text-black
                   retro-shadow-sm cursor-pointer
                   overflow-hidden"
        whileHover={{ scale: 1.05, rotate: -1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          textShadow: '1px 1px 0 hsl(var(--retro-cyan))',
        }}
      >
        {/* Scanline overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />
        {/* Glowing dot indicator */}
        <span className="inline-block w-2 h-2 bg-retro-cyan border border-black mr-2 animate-pulse" />
        <span className="relative z-10">
          {address?.slice(0, 6)}…{address?.slice(-4)}
        </span>
      </motion.button>
    )
  }

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="relative font-pixel text-[8px] sm:text-[10px] px-3 py-2 sm:px-4 sm:py-3
                   bg-gradient-to-b from-retro-cyan to-retro-magenta/80
                   border-4 border-black text-black
                   retro-shadow-sm cursor-pointer
                   overflow-hidden group"
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          textShadow: '1px 1px 0 hsl(var(--retro-yellow))',
        }}
      >
        {/* Scanline overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />
        {/* Animated pixel border effect on hover */}
        <div className="absolute inset-0 border-2 border-retro-yellow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {/* Wallet icon */}
        <span className="inline-block mr-2 text-[10px] sm:text-[12px]">⟠</span>
        <span className="relative z-10">◈ CONNECT</span>
      </motion.button>
      
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
