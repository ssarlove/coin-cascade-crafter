import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from '@/config/wallet';

const queryClient = new QueryClient();

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: 'money-machine-clicker',
  enableAnalytics: true,
  themeMode: 'dark',
});

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
