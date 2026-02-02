import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useCallback } from 'react';
import { Upgrade } from '@/hooks/useGameStore';

interface OwnedItemsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  upgrade: Upgrade | null;
}

// Pixel art background renderer for each upgrade type
function drawBackground(ctx: CanvasRenderingContext2D, type: string, width: number, height: number, frame: number) {
  ctx.imageSmoothingEnabled = false;
  
  switch (type) {
    case 'hamster':
      // Hamster cage background
      ctx.fillStyle = '#4a3728';
      ctx.fillRect(0, 0, width, height);
      // Metal bars
      ctx.fillStyle = '#888';
      for (let x = 0; x < width; x += 20) {
        ctx.fillRect(x, 0, 4, height);
      }
      // Bedding at bottom
      ctx.fillStyle = '#c9a55c';
      ctx.fillRect(0, height - 30, width, 30);
      // Wood shavings
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#d4b36a' : '#a08040';
        ctx.fillRect(Math.random() * width, height - 25 + Math.random() * 20, 8, 4);
      }
      // Water bottle
      ctx.fillStyle = '#5588ff';
      ctx.fillRect(width - 30, 20, 15, 40);
      ctx.fillStyle = '#aaccff';
      ctx.fillRect(width - 27, 25, 9, 30);
      break;

    case 'intern':
      // Office background
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(0, 0, width, height);
      // Cubicle walls
      ctx.fillStyle = '#666680';
      ctx.fillRect(0, 0, 10, height);
      ctx.fillRect(0, 0, width, 10);
      // Fluorescent lights
      ctx.fillStyle = '#ffffcc';
      for (let x = 30; x < width; x += 80) {
        ctx.fillRect(x, 5, 50, 8);
        ctx.fillStyle = 'rgba(255,255,200,0.1)';
        ctx.fillRect(x - 10, 5, 70, height);
        ctx.fillStyle = '#ffffcc';
      }
      // Desks in background
      ctx.fillStyle = '#8b7355';
      for (let y = 60; y < height; y += 50) {
        ctx.fillRect(20, y, width - 40, 25);
      }
      // Computer monitors
      ctx.fillStyle = '#333';
      for (let x = 40; x < width - 40; x += 60) {
        for (let y = 40; y < height - 20; y += 50) {
          ctx.fillRect(x, y, 30, 22);
          ctx.fillStyle = frame % 10 < 5 ? '#00ff00' : '#00cc00';
          ctx.fillRect(x + 2, y + 2, 26, 18);
          ctx.fillStyle = '#333';
        }
      }
      break;

    case 'printer':
      // Shady backroom
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, height);
      // Single swinging light bulb
      const swing = Math.sin(frame * 0.1) * 10;
      ctx.fillStyle = '#ffff88';
      ctx.fillRect(width / 2 + swing - 5, 10, 10, 15);
      // Light cone
      ctx.fillStyle = 'rgba(255,255,100,0.15)';
      ctx.beginPath();
      ctx.moveTo(width / 2 + swing, 25);
      ctx.lineTo(width / 2 + swing - 80, height);
      ctx.lineTo(width / 2 + swing + 80, height);
      ctx.fill();
      // Stacks of paper/money
      ctx.fillStyle = '#228822';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(20 + i * 35, height - 20 - i * 5, 30, 15);
      }
      break;

    case 'oil':
      // Outside desert/ocean
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, width, height * 0.6);
      // Sun
      ctx.fillStyle = '#ffdd00';
      ctx.beginPath();
      ctx.arc(width - 40, 30, 20, 0, Math.PI * 2);
      ctx.fill();
      // Ocean/ground
      ctx.fillStyle = '#1a5f7a';
      ctx.fillRect(0, height * 0.5, width, height * 0.5);
      // Waves
      for (let x = 0; x < width; x += 20) {
        const waveY = height * 0.5 + Math.sin((x + frame * 2) * 0.1) * 5;
        ctx.fillStyle = '#2a7f9a';
        ctx.fillRect(x, waveY, 15, 3);
      }
      // Other oil rigs in distance
      ctx.fillStyle = '#333';
      ctx.fillRect(30, height * 0.4, 8, height * 0.3);
      ctx.fillRect(width - 50, height * 0.35, 6, height * 0.35);
      break;

    case 'crypto':
      // DEX interface background
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, width, height);
      // Chart area
      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 1;
      // Grid lines
      for (let y = 20; y < height - 40; y += 20) {
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(width - 10, y);
        ctx.stroke();
      }
      // Candlestick chart
      const candles = 15;
      const candleWidth = (width - 40) / candles;
      for (let i = 0; i < candles; i++) {
        const x = 20 + i * candleWidth;
        const isGreen = Math.sin(i + frame * 0.05) > 0;
        ctx.fillStyle = isGreen ? '#00ff88' : '#ff4444';
        const bodyHeight = 20 + Math.random() * 30;
        const y = 40 + Math.random() * (height - 120);
        // Wick
        ctx.fillRect(x + candleWidth / 2 - 1, y - 10, 2, bodyHeight + 20);
        // Body
        ctx.fillRect(x + 2, y, candleWidth - 4, bodyHeight);
      }
      // Order book at bottom
      ctx.fillStyle = '#161b22';
      ctx.fillRect(0, height - 50, width, 50);
      // Scrolling orders
      const orderOffset = (frame * 2) % 20;
      for (let i = 0; i < 6; i++) {
        const y = height - 45 + i * 8 + orderOffset;
        if (y < height) {
          ctx.fillStyle = i % 2 === 0 ? '#00ff88' : '#ff4444';
          ctx.font = '8px monospace';
          ctx.fillText(`${i % 2 === 0 ? 'BUY' : 'SELL'} ${(Math.random() * 1000).toFixed(2)}`, 10, y);
          ctx.fillText(`@ ${(0.001 + Math.random() * 0.01).toFixed(6)}`, 80, y);
        }
      }
      break;

    case 'reserve':
      // Federal Reserve building interior
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(0, 0, width, height);
      // Marble pillars
      ctx.fillStyle = '#e8e8e0';
      for (let x = 20; x < width; x += 60) {
        ctx.fillRect(x, 0, 20, height);
        ctx.fillStyle = '#d0d0c8';
        ctx.fillRect(x + 5, 0, 10, height);
        ctx.fillStyle = '#e8e8e0';
      }
      // Gold bars stacked
      ctx.fillStyle = '#ffd700';
      for (let y = height - 20; y > height - 80; y -= 12) {
        for (let x = 10; x < width - 10; x += 25) {
          ctx.fillRect(x, y, 20, 10);
          ctx.fillStyle = '#ffec8b';
          ctx.fillRect(x + 2, y + 2, 16, 6);
          ctx.fillStyle = '#ffd700';
        }
      }
      break;

    case 'void':
      // Cosmic void
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, width, height);
      // Stars
      for (let i = 0; i < 100; i++) {
        const x = (i * 37 + frame) % width;
        const y = (i * 53) % height;
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
        ctx.fillRect(x, y, 2, 2);
      }
      // Void portal in center
      const portalSize = 30 + Math.sin(frame * 0.1) * 10;
      ctx.fillStyle = '#4400aa';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, portalSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#220066';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, portalSize * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, portalSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'time':
      // Time vortex
      ctx.fillStyle = '#1a0a2e';
      ctx.fillRect(0, 0, width, height);
      // Spiraling clocks
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + frame * 0.02;
        const dist = 40 + i * 15;
        const x = width / 2 + Math.cos(angle) * dist;
        const y = height / 2 + Math.sin(angle) * dist;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x, y, 12 - i, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 8 - i * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'alchemy':
      // Alchemy lab
      ctx.fillStyle = '#2d1f1a';
      ctx.fillRect(0, 0, width, height);
      // Stone walls
      for (let y = 0; y < height; y += 20) {
        for (let x = 0; x < width; x += 30) {
          ctx.fillStyle = y % 40 === 0 ? '#4a3830' : '#3d2d25';
          ctx.fillRect(x + (y % 40 === 0 ? 15 : 0), y, 28, 18);
        }
      }
      // Bubbling potions
      const potionColors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
      for (let i = 0; i < 4; i++) {
        const x = 20 + i * 50;
        ctx.fillStyle = '#447';
        ctx.fillRect(x, height - 60, 30, 50);
        ctx.fillStyle = potionColors[i];
        const bubbleHeight = 30 + Math.sin(frame * 0.2 + i) * 5;
        ctx.fillRect(x + 5, height - 55 + (40 - bubbleHeight), 20, bubbleHeight);
        // Bubbles
        if (frame % 20 < 10) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.beginPath();
          ctx.arc(x + 10 + Math.random() * 10, height - 30 - Math.random() * 20, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;

    case 'dragon':
      // Dragon cave
      ctx.fillStyle = '#1a0a00';
      ctx.fillRect(0, 0, width, height);
      // Rocky walls
      ctx.fillStyle = '#3d2817';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, 10 + Math.random() * 20, 0, Math.PI * 2);
        ctx.fill();
      }
      // Gold hoard
      ctx.fillStyle = '#ffd700';
      for (let i = 0; i < 100; i++) {
        ctx.fillRect(Math.random() * width, height - 40 + Math.random() * 30, 6, 4);
      }
      // Lava glow
      ctx.fillStyle = 'rgba(255,100,0,0.3)';
      ctx.fillRect(0, height - 10, width, 10);
      break;

    case 'tree':
      // Magical garden
      ctx.fillStyle = '#1a3d1a';
      ctx.fillRect(0, 0, width, height);
      // Grass
      ctx.fillStyle = '#2d5a2d';
      ctx.fillRect(0, height - 30, width, 30);
      // Sparkles
      for (let i = 0; i < 30; i++) {
        const x = (i * 23 + frame) % width;
        const y = (i * 41 + Math.sin(frame * 0.1 + i) * 20) % height;
        ctx.fillStyle = `rgba(255,215,0,${0.3 + Math.sin(frame * 0.2 + i) * 0.3})`;
        ctx.fillRect(x, y, 3, 3);
      }
      break;

    case 'goose':
      // Farm/pond
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, width, height);
      // Grass
      ctx.fillStyle = '#4a7c23';
      ctx.fillRect(0, height * 0.6, width, height * 0.4);
      // Pond
      ctx.fillStyle = '#3a6ea5';
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.75, 60, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      // Ripples
      ctx.strokeStyle = '#5588bb';
      ctx.lineWidth = 1;
      const ripple = (frame % 60) / 60;
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.75, 20 + ripple * 30, 10 + ripple * 12, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;

    default:
      // Generic tech background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#333';
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
  }
}

// Individual item rendering
function drawUpgradeItem(ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number, frame: number, index: number) {
  const animOffset = index * 0.3;
  
  switch (type) {
    case 'hamster':
      // Hamster on wheel
      const wheelFrame = (frame + index * 5) % 20;
      // Wheel
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 - 5, 0, Math.PI * 2);
      ctx.stroke();
      // Hamster body
      ctx.fillStyle = '#cc9966';
      const hamsterY = y + size / 2 + Math.sin(wheelFrame * 0.5) * 3;
      ctx.beginPath();
      ctx.ellipse(x + size / 2, hamsterY, size / 4, size / 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Legs running
      ctx.fillStyle = '#aa7744';
      const legOffset = Math.sin(wheelFrame * 0.8) * 5;
      ctx.fillRect(x + size / 2 - 8, hamsterY + 8 + legOffset, 4, 8);
      ctx.fillRect(x + size / 2 + 4, hamsterY + 8 - legOffset, 4, 8);
      break;

    case 'intern':
      // Person at desk
      ctx.fillStyle = '#8b7355';
      ctx.fillRect(x + 5, y + size - 20, size - 10, 15);
      // Person
      ctx.fillStyle = '#ffcc99';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 - 5, 10, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = '#336699';
      ctx.fillRect(x + size / 2 - 8, y + size / 2 + 5, 16, 20);
      // Arms typing
      const typing = Math.sin((frame + animOffset) * 0.5) * 3;
      ctx.fillStyle = '#ffcc99';
      ctx.fillRect(x + size / 2 - 15 + typing, y + size / 2 + 10, 8, 4);
      ctx.fillRect(x + size / 2 + 7 - typing, y + size / 2 + 10, 8, 4);
      break;

    // ... more types would follow the same pattern
    default:
      // Generic icon
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 3, 0, Math.PI * 2);
      ctx.fill();
  }
}

export function OwnedItemsPanel({ isOpen, onClose, upgrade }: OwnedItemsPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !upgrade || upgrade.count === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    frameRef.current++;
    const frame = frameRef.current;

    const width = canvas.width;
    const height = canvas.height;

    // Draw background
    drawBackground(ctx, upgrade.type, width, height, frame);

    // Draw owned items
    const itemSize = 60;
    const cols = Math.floor((width - 40) / (itemSize + 10));
    const items = Math.min(upgrade.count, 50); // Cap at 50 for performance

    for (let i = 0; i < items; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 20 + col * (itemSize + 10);
      const y = 60 + row * (itemSize + 15);

      // Item background
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(x - 2, y - 2, itemSize + 4, itemSize + 4);

      drawUpgradeItem(ctx, upgrade.type, x, y, itemSize, frame, i);
    }

    // Header
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, width, 50);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px "Courier New"';
    ctx.fillText(`${upgrade.name} x${upgrade.count}`, 15, 32);

    animRef.current = requestAnimationFrame(draw);
  }, [upgrade]);

  useEffect(() => {
    if (isOpen && upgrade) {
      animRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isOpen, upgrade, draw]);

  return (
    <AnimatePresence>
      {isOpen && upgrade && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l-6 border-foreground bg-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Close button */}
            <motion.button
              className="absolute right-4 top-4 z-10 border-4 border-foreground bg-retro-red px-4 py-2 font-impact text-lg text-card"
              style={{ boxShadow: '4px 4px 0 #000' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              ✕ CLOSE
            </motion.button>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={400}
              height={800}
              className="h-full w-full"
              style={{ imageRendering: 'pixelated' }}
            />

            {/* VHS overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
