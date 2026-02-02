import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
})
