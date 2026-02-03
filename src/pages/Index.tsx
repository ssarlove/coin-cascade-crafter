import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticker } from '@/components/game/Ticker';
import { StatsBox } from '@/components/game/StatsBox';
import { MainCoin } from '@/components/game/MainCoin';
import { FloatingNumber } from '@/components/game/FloatingNumber';
import { LootGoblin } from '@/components/game/LootGoblin';
import { UpgradeItem } from '@/components/game/UpgradeItem';
import { BoostItem } from '@/components/game/BoostItem';
import { OrbitIcons } from '@/components/game/OrbitIcons';
import { ActiveBoostsBar } from '@/components/game/ActiveBoostsBar';
import WalletButton  from '@/components/game/WalletButton';
import { EthBoostItem, ETH_BOOSTS } from '@/components/game/EthBoostItem';
import { OwnedItemsPanel } from '@/components/game/OwnedItemsPanel';
import { useGameStore, formatNum, Upgrade } from '@/hooks/useGameStore';

interface FloatingNum {
  id: string;
  x: number;
  y: number;
  value: number;
}

export default function Index() {
  const game = useGameStore();
  const [activeTab, setActiveTab] = useState<'upgrades' | 'boosts' | 'eth'>('upgrades');
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNum[]>([]);
  const [goblin, setGoblin] = useState({ visible: false, x: 200, y: 160 });
  const [panelUpgrade, setPanelUpgrade] = useState<Upgrade | null>(null);

  const addFloatingNumber = useCallback((x: number, y: number, value: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingNumbers(prev => [...prev, { id, x, y, value }]);
  }, []);

  const removeFloatingNumber = useCallback((id: string) => {
    setFloatingNumbers(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleCoinClick = useCallback(() => {
    return game.click();
  }, [game]);

  const handleGoblinClick = useCallback(() => {
    const reward = game.collectGoblin();
    addFloatingNumber(goblin.x + 200, goblin.y + 200, reward);
    setGoblin(g => ({ ...g, visible: false }));
  }, [game, goblin, addFloatingNumber]);

  const handleSwipeLeft = useCallback((upgrade: Upgrade) => {
    setPanelUpgrade(upgrade);
  }, []);

  // Goblin spawning
  useEffect(() => {
    const interval = setInterval(() => {
      if (game.autoRate >= 10 && !goblin.visible && Math.random() < 0.3) {
        setGoblin({
          visible: true,
          x: 50 + Math.random() * 300,
          y: 50 + Math.random() * 200,
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setGoblin(g => ({ ...g, visible: false }));
        }, 5000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [game.autoRate, goblin.visible]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Ticker />

      {/* Header */}
      <motion.div
        className="flex items-center justify-between border-b-6 border-foreground bg-primary px-4 py-3 font-impact text-3xl text-primary-foreground md:text-4xl"
        style={{ textShadow: '3px 3px 0 hsl(0 100% 50%)' }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <span className="hidden md:inline">💾</span>
        <span>MONEY_MACHINE_FIXED.EXE</span>
        <WalletButton />
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b-4 border-foreground bg-foreground">
        {(['upgrades', 'boosts', 'eth'] as const).map((tab) => (
          <motion.button
            key={tab}
            className={`flex-1 border-r-4 border-foreground py-3 font-impact text-lg uppercase last:border-r-0 ${
              activeTab === tab
                ? 'bg-retro-red text-card'
                : 'bg-muted text-foreground'
            }`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ backgroundColor: 'hsl(60 100% 50%)' }}
            whileTap={{ scale: 0.98 }}
          >
            {tab === 'eth' ? '⟠ ETH' : tab}
          </motion.button>
        ))}
      </div>

      <ActiveBoostsBar activeEffects={game.activeEffects} boosts={game.boosts} />

      {/* Main container */}
      <div className="m-4 grid grid-cols-1 gap-0 border-4 border-foreground bg-card md:grid-cols-[1.5fr_350px]">
        {/* Game Zone */}
        <div className="relative min-h-[450px] overflow-hidden border-b-4 border-foreground striped-bg p-5 md:border-b-0 md:border-r-4">
          <StatsBox
            coins={game.coins}
            autoRate={game.autoRate}
            clickPower={game.clickPower}
          />

          {/* Coin Stage */}
          <div className="relative mx-auto" style={{ width: 400, height: 320 }}>
            {/* Center coin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <MainCoin onClick={handleCoinClick} onFloatingNumber={addFloatingNumber} />
            </div>

            {/* Orbit icons */}
            <OrbitIcons
              upgrades={game.upgrades}
              centerX={200}
              centerY={160}
              radius={120}
            />

            {/* Loot Goblin */}
            <LootGoblin
              visible={goblin.visible}
              x={goblin.x}
              y={goblin.y}
              onClick={handleGoblinClick}
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="max-h-[70vh] overflow-y-auto bg-retro-magenta p-3">
          <AnimatePresence mode="wait">
            {activeTab === 'upgrades' && (
              <motion.div
                key="upgrades"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {game.upgrades.map((upgrade, index) => (
                  <UpgradeItem
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={game.canAfford(upgrade.cost)}
                    onBuy={() => game.buyUpgrade(upgrade.id)}
                    onSwipeLeft={() => handleSwipeLeft(upgrade)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'boosts' && (
              <motion.div
                key="boosts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {game.boosts.map((boost, index) => (
                  <BoostItem
                    key={boost.id}
                    boost={boost}
                    canAfford={game.canAfford(boost.cost)}
                    isActive={game.activeEffects.some(e => e.id === boost.id)}
                    onBuy={() => game.buyBoost(boost.id)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'eth' && (
              <motion.div
                key="eth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-3 border-4 border-foreground bg-black p-2 text-center font-mono text-xs text-retro-green">
                  ⟠ PAY GAS ONLY • SPECIAL ABILITIES • PERMANENT ⟠
                </div>
                {ETH_BOOSTS.map((boost, index) => (
                  <EthBoostItem
                    key={boost.id}
                    boost={boost}
                    isPurchased={game.ethBoostsPurchased.includes(boost.id)}
                    onPurchased={game.applyEthBoost}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Numbers */}
      <AnimatePresence>
        {floatingNumbers.map(num => (
          <FloatingNumber
            key={num.id}
            id={num.id}
            x={num.x}
            y={num.y}
            value={num.value}
            onComplete={removeFloatingNumber}
          />
        ))}
      </AnimatePresence>

      {/* Owned Items Panel */}
      <OwnedItemsPanel
        isOpen={!!panelUpgrade}
        onClose={() => setPanelUpgrade(null)}
        upgrade={panelUpgrade}
      />
    </div>
  );
}
