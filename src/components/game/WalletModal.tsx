import { motion, AnimatePresence } from 'framer-motion'
import { useConnect } from 'wagmi'
import { X } from 'lucide-react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const walletIcons: Record<string, string> = {
  'MetaMask': '🦊',
  'Coinbase Wallet': '🔵',
  'WalletConnect': '🔗',
  'Injected': '💉',
}

const walletDescriptions: Record<string, string> = {
  'MetaMask': 'POPULAR BROWSER WALLET',
  'Coinbase Wallet': 'OFFICIAL BASE WALLET',
  'WalletConnect': 'SCAN QR TO CONNECT',
  'Injected': 'USE BROWSER WALLET',
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectors, connect, isPending } = useConnect()

  const handleConnect = (connector: typeof connectors[number]) => {
    connect({ connector })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px), rgba(0,0,0,0.9)',
            }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       w-[90vw] max-w-[400px] bg-black
                       border-4 border-retro-cyan
                       overflow-hidden"
            style={{
              boxShadow: '8px 8px 0 hsl(var(--retro-magenta)), -4px -4px 0 hsl(var(--retro-yellow))',
            }}
          >
            {/* CRT Scanlines overlay */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 opacity-20"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              }}
            />
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-retro-cyan to-retro-magenta p-3 border-b-4 border-black">
              <h2 className="font-pixel text-[10px] sm:text-[12px] text-black text-center tracking-wider">
                ◈ SELECT WALLET ◈
              </h2>
              <button
                onClick={onClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                           w-8 h-8 bg-retro-red border-2 border-black
                           flex items-center justify-center
                           hover:bg-retro-yellow transition-colors"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>
            
            {/* VHS Label */}
            <div className="bg-retro-yellow/20 border-b-2 border-retro-yellow/50 px-3 py-1">
              <p className="font-pixel text-[6px] text-retro-yellow text-center animate-pulse">
                ▸ CONNECTING TO BASE NETWORK ▸
              </p>
            </div>
            
            {/* Wallet List */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {connectors.map((connector, index) => (
                <motion.button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  disabled={isPending}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 bg-gradient-to-r from-gray-900 to-gray-800
                             border-3 border-retro-cyan/50 hover:border-retro-cyan
                             flex items-center gap-4
                             disabled:opacity-50 disabled:cursor-not-allowed
                             group relative overflow-hidden"
                  style={{
                    boxShadow: '4px 4px 0 rgba(0,255,255,0.3)',
                  }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-retro-cyan/0 to-retro-cyan/20 
                                  opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Icon */}
                  <div className="w-12 h-12 bg-black border-2 border-retro-yellow
                                  flex items-center justify-center text-2xl
                                  group-hover:border-retro-cyan transition-colors">
                    {walletIcons[connector.name] || '💳'}
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 text-left relative z-10">
                    <p className="font-pixel text-[10px] text-retro-cyan group-hover:text-retro-yellow transition-colors">
                      {connector.name}
                    </p>
                    <p className="font-pixel text-[6px] text-gray-500 mt-1">
                      {walletDescriptions[connector.name] || 'CLICK TO CONNECT'}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-retro-cyan group-hover:text-retro-yellow 
                                  group-hover:translate-x-1 transition-all font-pixel text-sm">
                    ▶
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="bg-black border-t-2 border-retro-cyan/30 p-3">
              <p className="font-pixel text-[6px] text-gray-600 text-center">
                🔒 SECURE CONNECTION • NO PRIVATE KEYS SHARED
              </p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="w-2 h-2 bg-retro-green animate-pulse" />
                <span className="w-2 h-2 bg-retro-yellow animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-retro-red animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
