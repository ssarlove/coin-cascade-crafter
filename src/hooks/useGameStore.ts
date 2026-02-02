import { useState, useCallback, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';

export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  baseCost: number;
  count: number;
  auto: number;
  power: number;
  desc: string;
  type: string;
}

export interface Boost {
  id: string;
  name: string;
  cost: number;
  duration: number;
  desc: string;
  multiplier: number;
  target: 'click' | 'auto';
}

export interface ActiveEffect {
  id: string;
  timer: number;
  multiplier: number;
  target: 'click' | 'auto';
}

const initialUpgrades: Upgrade[] = [
  { id: 'hamster', name: 'Hamster Wheel', baseCost: 15, cost: 15, count: 0, auto: 1, power: 1, desc: 'Rodent generates power', type: 'hamster' },
  { id: 'intern', name: 'Unpaid Intern', baseCost: 50, cost: 50, count: 0, auto: 5, power: 2, desc: 'Exploiting youth', type: 'intern' },
  { id: 'printer', name: 'Money Printer', baseCost: 200, cost: 200, count: 0, auto: 10, power: 5, desc: 'BRRRRRR', type: 'printer' },
  { id: 'oil', name: 'Oil Rig', baseCost: 800, cost: 800, count: 0, auto: 25, power: 10, desc: 'Foreign intervention', type: 'oil' },
  { id: 'crypto', name: 'Crypto Scam', baseCost: 2000, cost: 2000, count: 0, auto: 50, power: 20, desc: 'Pump & dump', type: 'crypto' },
  { id: 'reserve', name: 'Fed Reserve', baseCost: 5000, cost: 5000, count: 0, auto: 100, power: 50, desc: 'Infinite liquidity', type: 'reserve' },
  { id: 'void', name: 'Void Harvester', baseCost: 15000, cost: 15000, count: 0, auto: 250, power: 100, desc: 'Extract from nothing', type: 'void' },
  { id: 'time', name: 'Time Machine', baseCost: 50000, cost: 50000, count: 0, auto: 500, power: 200, desc: 'Steal from future', type: 'time' },
  { id: 'alchemy', name: 'Alchemy Lab', baseCost: 150000, cost: 150000, count: 0, auto: 1000, power: 500, desc: 'Lead to gold', type: 'alchemy' },
  { id: 'dragon', name: 'Dragon Hoard', baseCost: 500000, cost: 500000, count: 0, auto: 2500, power: 1000, desc: 'Ancient reptile', type: 'dragon' },
  { id: 'tree', name: 'Money Tree', baseCost: 2000000, cost: 2000000, count: 0, auto: 5000, power: 2500, desc: 'Impossible', type: 'tree' },
  { id: 'goose', name: 'Golden Goose', baseCost: 10000000, cost: 10000000, count: 0, auto: 10000, power: 5000, desc: 'Golden eggs', type: 'goose' },
];

const boosts: Boost[] = [
  { id: 'coffee', name: 'Espresso Shot', cost: 100, duration: 10, desc: '2x Click Power (10s)', multiplier: 2, target: 'click' },
  { id: 'roids', name: 'Steroids', cost: 2000, duration: 5, desc: '10x Click Power (5s)', multiplier: 10, target: 'click' },
];

export const formatNum = (n: number): string => {
  if (n >= 1e15) return (n / 1e15).toFixed(1) + 'Q';
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
};

const STORAGE_KEY = 'money_machine_state_';

interface SavedState {
  coins: number;
  upgrades: { id: string; count: number; cost: number }[];
  clickPowerBase: number;
  autoRateBase: number;
  ethBoostsPurchased: string[];
  ethClickMultiplier: number;
  ethAutoMultiplier: number;
  critChance: number;
}

export function useGameStore() {
  const { address, isConnected } = useAccount();
  const [coins, setCoins] = useState(0);
  const [clickPowerBase, setClickPowerBase] = useState(1);
  const [autoRateBase, setAutoRateBase] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [ethBoostsPurchased, setEthBoostsPurchased] = useState<string[]>([]);
  const [ethClickMultiplier, setEthClickMultiplier] = useState(1);
  const [ethAutoMultiplier, setEthAutoMultiplier] = useState(1);
  const [critChance, setCritChance] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  const effectsRef = useRef(activeEffects);
  const lastSaveRef = useRef(0);
  
  useEffect(() => {
    effectsRef.current = activeEffects;
  }, [activeEffects]);

  // Load state when wallet connects
  useEffect(() => {
    if (!address || loaded) return;
    
    const key = STORAGE_KEY + address.toLowerCase();
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const state: SavedState = JSON.parse(saved);
        setCoins(state.coins || 0);
        setClickPowerBase(state.clickPowerBase || 1);
        setAutoRateBase(state.autoRateBase || 0);
        setEthBoostsPurchased(state.ethBoostsPurchased || []);
        setEthClickMultiplier(state.ethClickMultiplier || 1);
        setEthAutoMultiplier(state.ethAutoMultiplier || 1);
        setCritChance(state.critChance || 0);
        
        // Merge saved upgrades with initial
        if (state.upgrades) {
          setUpgrades(prev => prev.map(u => {
            const saved = state.upgrades.find(s => s.id === u.id);
            return saved ? { ...u, count: saved.count, cost: saved.cost } : u;
          }));
        }
        console.log('Game loaded for wallet:', address);
      }
    } catch (e) {
      console.error('Failed to load game:', e);
    }
    setLoaded(true);
  }, [address, loaded]);

  // Save state periodically
  useEffect(() => {
    if (!address || !loaded) return;
    
    const interval = setInterval(() => {
      const key = STORAGE_KEY + address.toLowerCase();
      const state: SavedState = {
        coins,
        upgrades: upgrades.map(u => ({ id: u.id, count: u.count, cost: u.cost })),
        clickPowerBase,
        autoRateBase,
        ethBoostsPurchased,
        ethClickMultiplier,
        ethAutoMultiplier,
        critChance,
      };
      localStorage.setItem(key, JSON.stringify(state));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [address, loaded, coins, upgrades, clickPowerBase, autoRateBase, ethBoostsPurchased, ethClickMultiplier, ethAutoMultiplier, critChance]);

  const getMultiplier = useCallback((target: 'click' | 'auto') => {
    return effectsRef.current
      .filter(e => e.target === target)
      .reduce((acc, e) => acc * e.multiplier, 1);
  }, []);

  const effectiveClickPower = clickPowerBase * getMultiplier('click') * ethClickMultiplier;
  const effectiveAutoRate = autoRateBase * getMultiplier('auto') * ethAutoMultiplier;

  const click = useCallback(() => {
    let power = clickPowerBase * effectsRef.current
      .filter(e => e.target === 'click')
      .reduce((acc, e) => acc * e.multiplier, 1) * ethClickMultiplier;
    
    // Crit chance from Lucky Coin
    if (critChance > 0 && Math.random() < critChance) {
      power *= 2;
    }
    
    setCoins(c => c + power);
    return power;
  }, [clickPowerBase, ethClickMultiplier, critChance]);

  const buyUpgrade = useCallback((id: string) => {
    setUpgrades(prev => {
      const upgrade = prev.find(u => u.id === id);
      if (!upgrade) return prev;
      
      setCoins(c => {
        if (c < upgrade.cost) return c;
        setAutoRateBase(r => r + upgrade.auto);
        setClickPowerBase(p => p + upgrade.power);
        return c - upgrade.cost;
      });

      return prev.map(u => {
        if (u.id !== id) return u;
        return {
          ...u,
          count: u.count + 1,
          cost: Math.floor(u.cost * 1.35),
        };
      });
    });
  }, []);

  const buyBoost = useCallback((id: string) => {
    const boost = boosts.find(b => b.id === id);
    if (!boost) return false;
    
    const alreadyActive = effectsRef.current.some(e => e.id === id);
    if (alreadyActive) return false;

    setCoins(c => {
      if (c < boost.cost) return c;
      setActiveEffects(prev => [...prev, {
        id: boost.id,
        timer: boost.duration,
        multiplier: boost.multiplier,
        target: boost.target,
      }]);
      return c - boost.cost;
    });
    return true;
  }, []);

  const applyEthBoost = useCallback((boostId: string) => {
    if (ethBoostsPurchased.includes(boostId)) return;
    
    setEthBoostsPurchased(prev => [...prev, boostId]);
    
    switch (boostId) {
      case 'golden_touch':
        setCoins(c => c + 1000000);
        break;
      case 'time_warp':
        // Add 5 minutes of auto income
        setCoins(c => c + autoRateBase * ethAutoMultiplier * 300);
        break;
      case 'whale_mode':
        setEthClickMultiplier(m => m * 5);
        break;
      case 'robot_army':
        setEthAutoMultiplier(m => m * 3);
        break;
      case 'lucky_coin':
        setCritChance(c => c + 0.1);
        break;
    }
  }, [ethBoostsPurchased, autoRateBase, ethAutoMultiplier]);

  const collectGoblin = useCallback(() => {
    const reward = autoRateBase * ethAutoMultiplier * 60 * 5;
    setCoins(c => c + reward);
    return reward;
  }, [autoRateBase, ethAutoMultiplier]);

  // Auto income tick
  useEffect(() => {
    const interval = setInterval(() => {
      const mult = effectsRef.current
        .filter(e => e.target === 'auto')
        .reduce((acc, e) => acc * e.multiplier, 1);
      setCoins(c => c + autoRateBase * mult * ethAutoMultiplier);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRateBase, ethAutoMultiplier]);

  // Effect timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEffects(prev => 
        prev
          .map(e => ({ ...e, timer: e.timer - 1 }))
          .filter(e => e.timer > 0)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    coins,
    clickPower: effectiveClickPower,
    autoRate: effectiveAutoRate,
    upgrades,
    boosts,
    activeEffects,
    ethBoostsPurchased,
    click,
    buyUpgrade,
    buyBoost,
    applyEthBoost,
    collectGoblin,
    canAfford: (cost: number) => coins >= cost,
  };
}
