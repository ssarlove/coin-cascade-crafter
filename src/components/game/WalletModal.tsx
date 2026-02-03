import { motion, AnimatePresence } from 'framer-motion'
import { useConnect } from 'wagmi'
import { X } from 'lucide-react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

// Wallet logo components
const MetaMaskLogo = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M32.96 5.19L21.38 13.86l2.14-5.07L32.96 5.19z" fill="#E17726"/>
    <path d="M7.04 5.19l11.47 8.76-2.03-5.16L7.04 5.19z" fill="#E27625"/>
    <path d="M28.78 26.46l-3.08 4.72 6.59 1.81 1.89-6.42-5.4-.11zM5.83 26.57l1.88 6.42 6.58-1.81-3.07-4.72-5.39.11z" fill="#E27625"/>
    <path d="M14.02 17.66l-1.83 2.77 6.53.29-.23-7.02-4.47 3.96zM25.98 17.66l-4.53-4.05-.15 7.11 6.51-.29-1.83-2.77z" fill="#E27625"/>
    <path d="M14.29 31.18l3.93-1.92-3.4-2.65-.53 4.57zM21.78 29.26l3.92 1.92-.52-4.57-3.4 2.65z" fill="#E27625"/>
    <path d="M25.7 31.18l-3.92-1.92.31 2.56-.03 1.08 3.64-1.72zM14.29 31.18l3.65 1.72-.02-1.08.3-2.56-3.93 1.92z" fill="#D5BFB2"/>
    <path d="M18.02 24.47l-3.27-.96 2.31-1.06.96 2.02zM21.98 24.47l.96-2.02 2.32 1.06-3.28.96z" fill="#233447"/>
    <path d="M14.29 31.18l.55-4.72-3.62.11 3.07 4.61zM25.16 26.46l.54 4.72 3.08-4.61-3.62-.11zM27.81 20.43l-6.51.29.6 3.75.96-2.02 2.32 1.06 2.63-3.08zM14.75 23.51l2.31-1.06.96 2.02.61-3.75-6.53-.29 2.65 3.08z" fill="#CC6228"/>
    <path d="M12.1 20.43l2.75 5.36-.1-2.67-2.65-2.69zM25.26 23.12l-.11 2.67 2.76-5.36-2.65 2.69zM18.63 20.72l-.61 3.75.77 3.96.17-5.22-.33-2.49zM21.3 20.72l-.32 2.48.16 5.23.77-3.96-.61-3.75z" fill="#E27525"/>
    <path d="M21.91 24.47l-.77 3.96.55.39 3.4-2.65.11-2.67-3.29.97zM14.75 23.51l.1 2.66 3.4 2.65.55-.38-.77-3.96-3.28-.97z" fill="#F5841F"/>
    <path d="M21.94 32.9l.03-1.08-.3-.25h-4.35l-.28.25.02 1.08-3.65-1.72 1.28 1.05 2.58 1.79h4.43l2.6-1.79 1.27-1.05-3.63 1.72z" fill="#C0AC9D"/>
    <path d="M21.78 29.26l-.55-.38h-3.47l-.55.38-.3 2.56.28-.25h4.35l.3.25-.06-2.56z" fill="#161616"/>
    <path d="M33.52 14.52l.98-4.72-1.46-4.61-11.26 8.35 4.33 3.66 6.12 1.79 1.35-1.58-.59-.43.94-.85-.72-.56.93-.71-.62-.34zM5.5 9.8l.99 4.72-.63.47.94.71-.72.56.94.85-.59.43 1.35 1.58 6.11-1.79 4.34-3.66L7.04 5.19 5.5 9.8z" fill="#763E1A"/>
    <path d="M32.23 18.99l-6.12-1.79 1.84 2.77-2.76 5.36 3.65-.05h5.4l-2.01-6.29zM13.89 17.2l-6.11 1.79-2.03 6.29h5.39l3.65.05-2.75-5.36 1.85-2.77zM21.3 20.72l.39-6.78 1.78-4.81h-7.93l1.78 4.81.39 6.78.14 2.5.01 5.21h3.47l.02-5.21.15-2.5z" fill="#F5841F"/>
  </svg>
)

const CoinbaseLogo = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <circle cx="20" cy="20" r="20" fill="#0052FF"/>
    <path d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6zm0 22.4c-4.638 0-8.4-3.762-8.4-8.4s3.762-8.4 8.4-8.4 8.4 3.762 8.4 8.4-3.762 8.4-8.4 8.4z" fill="#fff"/>
    <rect x="16" y="16" width="8" height="8" rx="1" fill="#0052FF"/>
  </svg>
)

const WalletConnectLogo = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <rect width="40" height="40" rx="8" fill="#3B99FC"/>
    <path d="M12.18 15.47c4.32-4.23 11.32-4.23 15.64 0l.52.51a.53.53 0 010 .77l-1.78 1.74a.28.28 0 01-.39 0l-.71-.7c-3.01-2.95-7.9-2.95-10.91 0l-.77.75a.28.28 0 01-.39 0l-1.78-1.74a.53.53 0 010-.77l.57-.56zm19.32 3.6l1.58 1.55a.53.53 0 010 .77l-7.14 6.99a.56.56 0 01-.78 0l-5.07-4.96a.14.14 0 00-.2 0l-5.07 4.96a.56.56 0 01-.78 0L7 21.39a.53.53 0 010-.77l1.58-1.55a.56.56 0 01.78 0l5.07 4.96c.05.06.14.06.2 0l5.07-4.96a.56.56 0 01.78 0l5.07 4.96c.05.06.14.06.2 0l5.07-4.96a.56.56 0 01.78 0z" fill="#fff"/>
  </svg>
)

const BaseLogo = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <circle cx="20" cy="20" r="20" fill="#0052FF"/>
    <path d="M20 34c7.732 0 14-6.268 14-14S27.732 6 20 6 6 12.268 6 20s6.268 14 14 14z" fill="#0052FF"/>
    <path d="M19.95 28.95c4.97 0 9-4.03 9-9s-4.03-9-9-9c-4.66 0-8.49 3.54-8.95 8.08h11.87v1.84H11c.46 4.54 4.29 8.08 8.95 8.08z" fill="#fff"/>
  </svg>
)

const InjectedLogo = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <rect width="40" height="40" rx="8" fill="#627EEA"/>
    <path d="M20 8l-8 12 8 4.8 8-4.8L20 8z" fill="#fff" fillOpacity="0.8"/>
    <path d="M12 20l8 12 8-12-8 4.8L12 20z" fill="#fff"/>
  </svg>
)

const getWalletLogo = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('metamask')) return <MetaMaskLogo />
  if (lowerName.includes('coinbase')) return <CoinbaseLogo />
  if (lowerName.includes('walletconnect')) return <WalletConnectLogo />
  if (lowerName.includes('base')) return <BaseLogo />
  return <InjectedLogo />
}

const walletDescriptions: Record<string, string> = {
  'MetaMask': 'POPULAR BROWSER WALLET',
  'Coinbase Wallet': 'BASE NATIVE • SMART WALLET',
  'WalletConnect': 'SCAN QR TO CONNECT',
  'Injected': 'USE BROWSER WALLET',
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectors, connect, isPending, variables } = useConnect()

  const handleConnect = async (connector: typeof connectors[number]) => {
    try {
      connect({ connector })
    } catch (error) {
      console.error('Connection error:', error)
    }
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
              {connectors.map((connector, index) => {
                const isConnecting = isPending && variables?.connector === connector
                
                return (
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
                               border-2 border-retro-cyan/50 hover:border-retro-cyan
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
                    
                    {/* Logo */}
                    <div className="w-12 h-12 bg-black border-2 border-retro-yellow p-1
                                    flex items-center justify-center
                                    group-hover:border-retro-cyan transition-colors">
                      {getWalletLogo(connector.name)}
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
                    
                    {/* Arrow / Loading */}
                    <div className="text-retro-cyan group-hover:text-retro-yellow 
                                    group-hover:translate-x-1 transition-all font-pixel text-sm">
                      {isConnecting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="inline-block"
                        >
                          ◈
                        </motion.span>
                      ) : (
                        '▶'
                      )}
                    </div>
                  </motion.button>
                )
              })}
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
