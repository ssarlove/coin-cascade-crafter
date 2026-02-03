import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Coin Chaos Cascade',
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
