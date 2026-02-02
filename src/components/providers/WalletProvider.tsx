import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wallet';

const queryClient = new QueryClient();

// Custom 90s VHS theme for RainbowKit
const retroTheme = darkTheme({
  accentColor: 'hsl(180 100% 50%)', // Cyan
  accentColorForeground: 'black',
  borderRadius: 'none',
  fontStack: 'system',
});

// Override specific theme properties for that 90s feel
const customTheme = {
  ...retroTheme,
  colors: {
    ...retroTheme.colors,
    modalBackground: '#000000',
    modalBorder: '#00ffff',
    modalText: '#00ff00',
    modalTextSecondary: '#ffff00',
    actionButtonBorder: '#ff00ff',
    actionButtonBorderMobile: '#ff00ff',
    actionButtonSecondaryBackground: '#ff0000',
    closeButton: '#ffff00',
    closeButtonBackground: '#ff0000',
    connectButtonBackground: '#00ffff',
    connectButtonBackgroundError: '#ff0000',
    connectButtonInnerBackground: '#000000',
    connectButtonText: '#000000',
    connectButtonTextError: '#ffff00',
    connectionIndicator: '#00ff00',
    downloadBottomCardBackground: '#ff00ff',
    downloadTopCardBackground: '#0000ff',
    error: '#ff0000',
    generalBorder: '#ffffff',
    generalBorderDim: '#808080',
    menuItemBackground: '#ff00ff',
    profileAction: '#00ffff',
    profileActionHover: '#ffff00',
    profileForeground: '#000000',
    selectedOptionBorder: '#00ff00',
    standby: '#ffff00',
  },
  fonts: {
    body: "'Courier New', monospace",
  },
  radii: {
    actionButton: '0px',
    connectButton: '0px',
    menuButton: '0px',
    modal: '0px',
    modalMobile: '0px',
  },
  shadows: {
    connectButton: '6px 6px 0 #000000',
    dialog: '8px 8px 0 #ff00ff',
    profileDetailsAction: '4px 4px 0 #000000',
    selectedOption: '4px 4px 0 #00ff00',
    selectedWallet: '6px 6px 0 #00ffff',
    walletLogo: '4px 4px 0 #000000',
  },
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
