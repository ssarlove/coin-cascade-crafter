import { useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

export interface GameState {
  coins: number;
  upgrades: { id: string; count: number; cost: number }[];
  clickPower: number;
  autoRate: number;
  ethBoostsPurchased: string[];
}

const STORAGE_KEY = 'money_machine_state_';

export function useWalletPersistence() {
  const { address, isConnected } = useAccount();

  const getStorageKey = useCallback(() => {
    if (!address) return null;
    return STORAGE_KEY + address.toLowerCase();
  }, [address]);

  const saveState = useCallback((state: GameState) => {
    const key = getStorageKey();
    if (!key) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }, [getStorageKey]);

  const loadState = useCallback((): GameState | null => {
    const key = getStorageKey();
    if (!key) return null;
    
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return null;
  }, [getStorageKey]);

  const clearState = useCallback(() => {
    const key = getStorageKey();
    if (!key) return;
    localStorage.removeItem(key);
  }, [getStorageKey]);

  return {
    address,
    isConnected,
    saveState,
    loadState,
    clearState,
  };
}
