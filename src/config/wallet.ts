import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'MONEY_MACHINE_FIXED.EXE',
  projectId: 'money-machine-clicker', // For WalletConnect - can use any string for dev
  chains: [base, baseSepolia],
  ssr: false,
});
