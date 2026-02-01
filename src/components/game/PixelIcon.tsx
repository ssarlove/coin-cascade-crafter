import { useEffect, useRef } from 'react';

interface PixelIconProps {
  type: string;
  size?: number;
  className?: string;
}

const drawRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

const animations: Record<string, (ctx: CanvasRenderingContext2D, frame: number) => void> = {
  // Hamster running in a wheel generating power
  hamster: (ctx, f) => {
    // Background - cage
    drawRect(ctx, 0, 0, 16, 16, '#654321');
    
    // Wheel frame (silver/gray)
    ctx.strokeStyle = '#A0A0A0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.stroke();
    
    // Wheel spokes rotating
    const angle = (f * 0.4) % (Math.PI * 2);
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = angle + (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.lineTo(8 + Math.cos(a) * 5, 8 + Math.sin(a) * 5);
      ctx.stroke();
    }
    
    // Hamster body (orange/brown, bouncing as it runs)
    const legFrame = Math.floor(f / 2) % 4;
    const bobY = legFrame % 2 === 0 ? 0 : -1;
    
    // Body
    drawRect(ctx, 5, 7 + bobY, 5, 4, '#D2691E');
    // Head
    drawRect(ctx, 9, 6 + bobY, 3, 3, '#D2691E');
    // Ears
    drawRect(ctx, 10, 5 + bobY, 1, 1, '#CD853F');
    drawRect(ctx, 11, 5 + bobY, 1, 1, '#CD853F');
    // Eye
    drawRect(ctx, 10, 7 + bobY, 1, 1, '#000');
    // Nose
    drawRect(ctx, 12, 8 + bobY, 1, 1, '#FFB6C1');
    
    // Running legs animation
    if (legFrame === 0) {
      drawRect(ctx, 6, 11 + bobY, 1, 2, '#CD853F');
      drawRect(ctx, 8, 11 + bobY, 1, 1, '#CD853F');
    } else if (legFrame === 1) {
      drawRect(ctx, 5, 11 + bobY, 1, 1, '#CD853F');
      drawRect(ctx, 9, 11 + bobY, 1, 2, '#CD853F');
    } else if (legFrame === 2) {
      drawRect(ctx, 6, 11 + bobY, 1, 1, '#CD853F');
      drawRect(ctx, 8, 11 + bobY, 1, 2, '#CD853F');
    } else {
      drawRect(ctx, 7, 11 + bobY, 1, 2, '#CD853F');
      drawRect(ctx, 9, 11 + bobY, 1, 1, '#CD853F');
    }
    
    // Electricity sparks
    if (f % 8 < 4) {
      drawRect(ctx, 1, 2, 1, 2, '#FFFF00');
      drawRect(ctx, 2, 3, 1, 1, '#FFFF00');
    }
  },

  // Sad intern at computer desk
  intern: (ctx, f) => {
    // Office background
    drawRect(ctx, 0, 0, 16, 16, '#4A4A4A');
    drawRect(ctx, 0, 12, 16, 4, '#3A3A3A');
    
    // Desk
    drawRect(ctx, 0, 10, 16, 2, '#8B4513');
    
    // Computer monitor
    drawRect(ctx, 1, 4, 7, 6, '#333');
    drawRect(ctx, 2, 5, 5, 4, '#00AA00');
    
    // Scrolling code on screen
    const scrollY = f % 4;
    for (let i = 0; i < 3; i++) {
      const len = 2 + ((i + scrollY) % 3);
      drawRect(ctx, 2, 5 + i, len, 1, '#00FF00');
    }
    
    // Intern (hunched over, tired)
    const slump = Math.sin(f * 0.1) * 0.5;
    // Body (cheap suit)
    drawRect(ctx, 10, 7 + slump, 4, 5, '#2F4F4F');
    // Head (tired, nodding off)
    drawRect(ctx, 10, 4 + slump, 4, 3, '#FFCCAA');
    // Hair
    drawRect(ctx, 10, 3 + slump, 4, 1, '#4A3728');
    // Tired eyes (bags under eyes)
    drawRect(ctx, 11, 5 + slump, 1, 1, '#000');
    drawRect(ctx, 13, 5 + slump, 1, 1, '#000');
    
    // Coffee cup (essential)
    drawRect(ctx, 8, 8, 2, 3, '#FFF');
    drawRect(ctx, 8, 8, 2, 1, '#6F4E37');
    // Steam
    if (f % 6 < 3) {
      drawRect(ctx, 8, 6, 1, 1, '#CCC');
      drawRect(ctx, 9, 5, 1, 1, '#CCC');
    }
    
    // "ZZZ" if really tired
    if (f % 20 > 15) {
      drawRect(ctx, 15, 2, 1, 1, '#FFF');
    }
  },

  // Money printer going BRRRR
  printer: (ctx, f) => {
    // Background
    drawRect(ctx, 0, 0, 16, 16, '#1a1a2e');
    
    // Printer body
    drawRect(ctx, 1, 5, 14, 8, '#E0E0E0');
    drawRect(ctx, 2, 6, 12, 6, '#C0C0C0');
    
    // Control panel
    drawRect(ctx, 10, 6, 3, 2, '#333');
    // Blinking lights
    drawRect(ctx, 11, 7, 1, 1, f % 4 < 2 ? '#FF0000' : '#00FF00');
    
    // Paper input slot
    drawRect(ctx, 3, 5, 6, 1, '#333');
    
    // Money coming out (animated)
    const printCycle = f % 12;
    const moneyColors = ['#85BB65', '#00AA00', '#228B22'];
    
    for (let i = 0; i < 3; i++) {
      const billY = 13 + (printCycle - i * 4) * 0.5;
      if (billY > 8 && billY < 16) {
        // Bill
        drawRect(ctx, 3, billY, 8, 2, moneyColors[i % 3]);
        // $ symbol on bill
        drawRect(ctx, 6, billY, 1, 1, '#006400');
        drawRect(ctx, 7, billY + 1, 1, 1, '#006400');
      }
    }
    
    // Output tray with money stack
    drawRect(ctx, 2, 14, 10, 2, '#654321');
    for (let i = 0; i < 3; i++) {
      drawRect(ctx, 3, 13 - i * 0.5, 8, 1, moneyColors[i]);
    }
    
    // "BRRR" vibration effect
    if (f % 2 === 0) {
      drawRect(ctx, 0, 5, 1, 8, '#1a1a2e');
    }
  },

  // Oil derrick pumping
  oil: (ctx, f) => {
    // Sky gradient
    drawRect(ctx, 0, 0, 16, 10, '#87CEEB');
    drawRect(ctx, 0, 0, 16, 3, '#FFB347');
    // Ground
    drawRect(ctx, 0, 10, 16, 6, '#8B4513');
    
    // Derrick tower (lattice structure)
    drawRect(ctx, 6, 2, 1, 10, '#333');
    drawRect(ctx, 9, 2, 1, 10, '#333');
    drawRect(ctx, 6, 2, 4, 1, '#333');
    // Cross braces
    for (let i = 0; i < 3; i++) {
      drawRect(ctx, 7, 4 + i * 3, 2, 1, '#333');
    }
    
    // Pump jack (horsehead pump)
    const pumpAngle = Math.sin(f * 0.15) * 0.5;
    const headY = 3 + pumpAngle * 3;
    
    // Walking beam
    drawRect(ctx, 2, headY + 1, 8, 1, '#4A4A4A');
    // Horsehead
    drawRect(ctx, 1, headY, 3, 2, '#333');
    // Counter weight
    drawRect(ctx, 9, headY + 2 - pumpAngle * 2, 2, 2, '#666');
    
    // Base/motor housing
    drawRect(ctx, 10, 8, 4, 4, '#4A4A4A');
    
    // Oil spurting up periodically
    if (f % 30 < 10) {
      const spurtH = (f % 30) < 5 ? 3 : 1;
      drawRect(ctx, 7, 1, 2, spurtH, '#000');
    }
    
    // Oil drops falling
    const dropY = 12 + (f % 8);
    if (dropY < 16) {
      drawRect(ctx, 7, dropY, 1, 1, '#000');
    }
  },

  // Crypto chart with wild swings
  crypto: (ctx, f) => {
    // Dark trading terminal background
    drawRect(ctx, 0, 0, 16, 16, '#0a0a0a');
    
    // Grid lines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 4 + i * 4);
      ctx.lineTo(16, 4 + i * 4);
      ctx.stroke();
    }
    
    // Candlestick chart (moving)
    const prices = [8, 10, 7, 12, 9, 14, 8, 11, 6, 15, 10, 13, 5, 16, 9];
    const offset = Math.floor(f / 4) % prices.length;
    
    for (let i = 0; i < 7; i++) {
      const idx = (i + offset) % prices.length;
      const nextIdx = (i + 1 + offset) % prices.length;
      const price = prices[idx];
      const nextPrice = prices[nextIdx];
      const isUp = nextPrice > price;
      
      const x = 1 + i * 2;
      const h = Math.abs(nextPrice - price) + 2;
      const y = 16 - Math.max(price, nextPrice);
      
      // Candle body
      drawRect(ctx, x, y, 2, h, isUp ? '#00FF00' : '#FF0000');
      // Wick
      drawRect(ctx, x, y - 1, 1, 1, isUp ? '#00AA00' : '#AA0000');
    }
    
    // Bitcoin symbol (flashing)
    if (f % 8 < 5) {
      drawRect(ctx, 1, 1, 3, 4, '#FFD700');
      drawRect(ctx, 2, 2, 1, 2, '#0a0a0a');
    }
    
    // "TO THE MOON" rocket occasionally
    if (f % 40 > 30) {
      const rocketY = 14 - (f % 10) * 1.5;
      drawRect(ctx, 13, rocketY, 2, 3, '#C0C0C0');
      drawRect(ctx, 13, rocketY + 3, 2, 1, '#FF4500');
    }
  },

  // Federal Reserve building printing money
  reserve: (ctx, f) => {
    // Dark blue sky (ominous)
    drawRect(ctx, 0, 0, 16, 16, '#0a1628');
    
    // Building (classical columns)
    drawRect(ctx, 1, 6, 14, 10, '#E8E8E8');
    
    // Triangular pediment (roof)
    for (let i = 0; i < 7; i++) {
      drawRect(ctx, 1 + i, 6 - i / 2, 14 - i * 2, 1, '#D0D0D0');
    }
    
    // Columns
    for (let i = 0; i < 4; i++) {
      const x = 2 + i * 3;
      drawRect(ctx, x, 7, 2, 8, '#F5F5F5');
      // Column shadows
      drawRect(ctx, x, 7, 1, 8, '#E0E0E0');
    }
    
    // Door
    drawRect(ctx, 6, 11, 4, 5, '#654321');
    
    // "$" symbol on building
    drawRect(ctx, 7, 8, 2, 2, '#FFD700');
    
    // Money raining down from building
    for (let i = 0; i < 5; i++) {
      const moneyY = ((f * 2 + i * 4) % 20);
      const moneyX = 1 + ((i * 3 + f) % 12);
      if (moneyY > 0) {
        drawRect(ctx, moneyX, moneyY, 2, 1, '#00FF00');
      }
    }
    
    // Glowing windows
    if (f % 6 < 4) {
      drawRect(ctx, 4, 8, 1, 1, '#FFFFAA');
      drawRect(ctx, 11, 8, 1, 1, '#FFFFAA');
    }
  },

  // Void portal sucking in reality
  void: (ctx, f) => {
    // Space background with stars
    drawRect(ctx, 0, 0, 16, 16, '#000');
    
    // Random stars
    const starPositions = [[2, 3], [5, 1], [12, 4], [14, 2], [1, 12], [13, 14], [4, 10]];
    starPositions.forEach(([x, y], i) => {
      if ((f + i * 3) % 10 < 7) {
        drawRect(ctx, x, y, 1, 1, '#FFF');
      }
    });
    
    // Swirling void portal
    const pulseSize = Math.sin(f * 0.15) * 1;
    
    // Outer glow (purple)
    ctx.strokeStyle = '#4B0082';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(8, 8, 6 + pulseSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // Middle ring (magenta)
    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(8, 8, 4 + pulseSize * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner ring (bright pink)
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(8, 8, 2 + pulseSize * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Singularity center
    drawRect(ctx, 7, 7, 2, 2, '#FFF');
    
    // Matter being sucked in (spiral particles)
    const spiralAngle = f * 0.3;
    for (let i = 0; i < 4; i++) {
      const a = spiralAngle + i * Math.PI / 2;
      const dist = 6 - (f % 20) * 0.3;
      if (dist > 1) {
        const px = 8 + Math.cos(a) * dist;
        const py = 8 + Math.sin(a) * dist;
        drawRect(ctx, px, py, 1, 1, '#FFD700');
      }
    }
  },

  // Time machine / clock
  time: (ctx, f) => {
    // Temporal void background
    drawRect(ctx, 0, 0, 16, 16, '#1a0a2e');
    
    // Clock face (ornate pocket watch style)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFF0';
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Hour markers
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const x = 8 + Math.cos(a) * 5;
      const y = 8 + Math.sin(a) * 5;
      drawRect(ctx, x, y, 1, 1, '#000');
    }
    
    // Clock hands (spinning fast - time travel!)
    const fastAngle = (f * 0.5) % (Math.PI * 2);
    const slowAngle = (f * 0.1) % (Math.PI * 2);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    // Minute hand
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(8 + Math.cos(fastAngle - Math.PI/2) * 4, 8 + Math.sin(fastAngle - Math.PI/2) * 4);
    ctx.stroke();
    // Hour hand
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(8 + Math.cos(slowAngle - Math.PI/2) * 3, 8 + Math.sin(slowAngle - Math.PI/2) * 3);
    ctx.stroke();
    
    // Center jewel
    drawRect(ctx, 7, 7, 2, 2, '#FF0000');
    
    // Time warp effects (temporal echoes)
    if (f % 10 < 5) {
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(8, 8, 7 + f % 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  // Alchemy lab transforming lead to gold
  alchemy: (ctx, f) => {
    // Dungeon lab background
    drawRect(ctx, 0, 0, 16, 16, '#2a1a0a');
    // Stone wall pattern
    for (let i = 0; i < 4; i++) {
      drawRect(ctx, i * 4, 0, 4, 2, '#3a2a1a');
    }
    
    // Wooden table
    drawRect(ctx, 0, 12, 16, 4, '#654321');
    drawRect(ctx, 0, 11, 16, 1, '#8B4513');
    
    // Large flask/beaker
    drawRect(ctx, 3, 3, 4, 2, '#87CEEB');  // Neck
    drawRect(ctx, 2, 5, 6, 6, '#87CEEB');  // Body
    
    // Bubbling transformation inside flask
    const cycle = f % 30;
    if (cycle < 15) {
      // Lead (gray) bubbling
      drawRect(ctx, 3, 8, 4, 2, '#696969');
      // Bubbles
      if (f % 4 < 2) {
        drawRect(ctx, 4, 6, 1, 1, '#808080');
        drawRect(ctx, 6, 7, 1, 1, '#808080');
      }
    } else {
      // Transforming to gold!
      drawRect(ctx, 3, 8, 4, 2, '#FFD700');
      // Golden sparkles
      if (f % 3 < 2) {
        drawRect(ctx, 4, 6, 1, 1, '#FFF');
        drawRect(ctx, 6, 7, 1, 1, '#FFFF00');
      }
    }
    
    // Flame under flask
    const flameH = 2 + (f % 3);
    drawRect(ctx, 4, 12 - flameH, 2, flameH, f % 2 === 0 ? '#FF4500' : '#FFD700');
    
    // Spell book
    drawRect(ctx, 10, 7, 4, 4, '#8B0000');
    drawRect(ctx, 11, 8, 2, 2, '#FFFFF0');
    
    // Mystical symbols floating
    if (f % 8 < 4) {
      drawRect(ctx, 12, 4, 1, 1, '#FF00FF');
      drawRect(ctx, 14, 6, 1, 1, '#00FFFF');
    }
  },

  // Dragon sleeping on gold hoard
  dragon: (ctx, f) => {
    // Cave background
    drawRect(ctx, 0, 0, 16, 16, '#2a1a1a');
    drawRect(ctx, 0, 0, 16, 4, '#1a0a0a');
    
    // Gold hoard (pile of coins and treasures)
    for (let i = 0; i < 8; i++) {
      const x = 1 + i * 2;
      const h = 3 + Math.sin(i) * 2;
      drawRect(ctx, x, 16 - h, 2, h, '#FFD700');
    }
    // Gem accents in gold
    drawRect(ctx, 3, 12, 1, 1, '#FF0000');
    drawRect(ctx, 8, 13, 1, 1, '#00FF00');
    drawRect(ctx, 12, 12, 1, 1, '#0000FF');
    
    // Dragon body (curled up on hoard)
    const breathe = Math.sin(f * 0.1) * 0.5;
    // Body
    drawRect(ctx, 4, 7 + breathe, 7, 4, '#228B22');
    // Scales texture
    drawRect(ctx, 5, 8 + breathe, 1, 1, '#006400');
    drawRect(ctx, 7, 8 + breathe, 1, 1, '#006400');
    drawRect(ctx, 9, 8 + breathe, 1, 1, '#006400');
    
    // Head
    drawRect(ctx, 10, 5 + breathe, 4, 3, '#228B22');
    // Snout
    drawRect(ctx, 13, 6 + breathe, 2, 2, '#2E8B2E');
    // Eye (opens sometimes)
    if (f % 40 > 35) {
      drawRect(ctx, 11, 6 + breathe, 2, 1, '#FF0000');
    } else {
      drawRect(ctx, 11, 6 + breathe, 2, 1, '#006400');
    }
    // Horns
    drawRect(ctx, 10, 4 + breathe, 1, 1, '#8B4513');
    drawRect(ctx, 12, 4 + breathe, 1, 1, '#8B4513');
    
    // Wings (folded)
    const wingY = 5 + breathe;
    drawRect(ctx, 2, wingY, 3, 3, '#006400');
    
    // Tail curled around gold
    drawRect(ctx, 1, 10, 3, 1, '#228B22');
    drawRect(ctx, 0, 11, 2, 1, '#228B22');
    
    // Fire breath occasionally
    if (f % 30 > 25) {
      drawRect(ctx, 15, 6, 1, 2, '#FF4500');
      drawRect(ctx, 15, 7, 1, 1, '#FFD700');
    }
    
    // Smoke wisps
    if (f % 12 < 6) {
      drawRect(ctx, 14, 4 - (f % 3), 1, 1, '#666');
    }
  },

  // Money tree with cash growing
  tree: (ctx, f) => {
    // Sky background
    drawRect(ctx, 0, 0, 16, 12, '#87CEEB');
    // Ground
    drawRect(ctx, 0, 12, 16, 4, '#228B22');
    
    // Tree trunk
    drawRect(ctx, 6, 8, 4, 6, '#8B4513');
    drawRect(ctx, 7, 7, 2, 1, '#8B4513');
    
    // Tree canopy (swaying slightly)
    const sway = Math.sin(f * 0.1) * 0.5;
    drawRect(ctx, 3 + sway, 3, 10, 5, '#228B22');
    drawRect(ctx, 5 + sway, 1, 6, 3, '#2E8B2E');
    drawRect(ctx, 6 + sway, 0, 4, 2, '#32CD32');
    
    // Dollar bills growing on tree!
    const billPositions = [[4, 3], [10, 4], [6, 2], [9, 5], [3, 5]];
    billPositions.forEach(([x, y], i) => {
      const flutter = Math.sin(f * 0.2 + i) * 0.5;
      drawRect(ctx, x + sway + flutter, y, 2, 1, '#85BB65');
      drawRect(ctx, x + sway + flutter, y, 1, 1, '#006400');
    });
    
    // Falling money
    for (let i = 0; i < 2; i++) {
      const fallY = (f * 2 + i * 8) % 20;
      const fallX = 4 + i * 5 + Math.sin(f * 0.3) * 2;
      if (fallY > 6 && fallY < 14) {
        drawRect(ctx, fallX, fallY, 2, 1, '#00FF00');
      }
    }
    
    // Sun
    drawRect(ctx, 12, 1, 3, 3, '#FFD700');
  },

  // Golden goose laying golden eggs
  goose: (ctx, f) => {
    // Farm background
    drawRect(ctx, 0, 0, 16, 10, '#87CEEB');
    drawRect(ctx, 0, 10, 16, 6, '#90EE90');
    
    // Nest
    for (let i = 0; i < 3; i++) {
      drawRect(ctx, 6 + i, 12 + i * 0.3, 6 - i, 1, '#8B4513');
    }
    
    // Goose body (sitting in nest)
    const bob = Math.sin(f * 0.15) * 0.5;
    drawRect(ctx, 5, 7 + bob, 7, 5, '#FFFAFA');
    // Wing
    drawRect(ctx, 6, 8 + bob, 4, 3, '#F0F0F0');
    
    // Goose neck (curved)
    drawRect(ctx, 3, 5 + bob, 3, 4, '#FFFAFA');
    drawRect(ctx, 1, 3 + bob, 4, 3, '#FFFAFA');
    
    // Head
    drawRect(ctx, 0, 2 + bob, 3, 3, '#FFFAFA');
    // Beak (orange)
    drawRect(ctx, -1, 3 + bob, 2, 1, '#FFA500');
    // Eye
    drawRect(ctx, 1, 3 + bob, 1, 1, '#000');
    
    // Tail feathers
    drawRect(ctx, 11, 7 + bob, 2, 2, '#F5F5F5');
    
    // Golden eggs in nest
    drawRect(ctx, 7, 11, 2, 2, '#FFD700');
    drawRect(ctx, 10, 12, 2, 2, '#FFD700');
    
    // Egg laying animation
    const layingCycle = f % 40;
    if (layingCycle > 30) {
      // New egg appearing
      const eggY = 9 + (layingCycle - 30) * 0.3;
      drawRect(ctx, 9, eggY, 2, 2, '#FFD700');
      // Sparkle effect
      if (layingCycle % 2 === 0) {
        drawRect(ctx, 8, eggY - 1, 1, 1, '#FFF');
        drawRect(ctx, 11, eggY, 1, 1, '#FFF');
      }
    }
    
    // "Honk!" occasionally
    if (f % 30 > 27) {
      drawRect(ctx, 0, 1, 1, 1, '#FFF');
    }
  },

  // Slot machine spinning
  slot: (ctx, f) => {
    // Casino background
    drawRect(ctx, 0, 0, 16, 16, '#1a0a2e');
    
    // Machine body
    drawRect(ctx, 1, 2, 14, 12, '#C0C0C0');
    drawRect(ctx, 2, 3, 12, 8, '#8B0000');
    
    // Display window
    drawRect(ctx, 3, 4, 10, 6, '#000');
    
    // Three spinning reels
    const spinSpeed = f * 3;
    const symbols = ['$', '7', '🍒', '⭐', '💎'];
    const reelOffsets = [0, 2, 4];
    
    for (let i = 0; i < 3; i++) {
      const x = 4 + i * 3;
      const symbolIdx = Math.floor((spinSpeed + reelOffsets[i]) / 10) % 5;
      
      // Reel background
      drawRect(ctx, x, 5, 2, 4, '#FFF');
      
      // Symbol (simplified pixel version)
      if (symbolIdx === 0) { // Dollar
        drawRect(ctx, x, 6, 2, 2, '#00FF00');
      } else if (symbolIdx === 1) { // 7
        drawRect(ctx, x, 6, 2, 2, '#FF0000');
      } else if (symbolIdx === 2) { // Cherry
        drawRect(ctx, x, 6, 1, 2, '#FF0000');
        drawRect(ctx, x + 1, 5, 1, 1, '#00FF00');
      } else if (symbolIdx === 3) { // Star
        drawRect(ctx, x, 6, 2, 2, '#FFD700');
      } else { // Diamond
        drawRect(ctx, x, 6, 2, 2, '#00FFFF');
      }
    }
    
    // Pull lever
    const leverY = 4 + Math.abs(Math.sin(f * 0.1)) * 4;
    drawRect(ctx, 14, leverY, 2, 2, '#FFD700');
    drawRect(ctx, 15, leverY + 2, 1, 4, '#8B4513');
    
    // Coin tray
    drawRect(ctx, 4, 12, 8, 2, '#333');
    
    // Coins spilling out occasionally
    if (f % 60 > 50) {
      drawRect(ctx, 5, 14, 2, 1, '#FFD700');
      drawRect(ctx, 8, 14, 2, 1, '#FFD700');
    }
    
    // Flashing lights
    if (f % 4 < 2) {
      drawRect(ctx, 2, 2, 1, 1, '#FF0000');
      drawRect(ctx, 13, 2, 1, 1, '#FFFF00');
    }
  },

  // Bank vault with gold
  vault: (ctx, f) => {
    // Bank interior
    drawRect(ctx, 0, 0, 16, 16, '#2F4F4F');
    
    // Vault door (circular)
    ctx.fillStyle = '#A9A9A9';
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Door frame
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.stroke();
    
    // Vault handle/wheel (spinning)
    const wheelAngle = f * 0.1;
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const a = wheelAngle + (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.lineTo(8 + Math.cos(a) * 4, 8 + Math.sin(a) * 4);
      ctx.stroke();
    }
    
    // Handle knobs
    for (let i = 0; i < 4; i++) {
      const a = wheelAngle + (i * Math.PI) / 2;
      const x = 8 + Math.cos(a) * 4;
      const y = 8 + Math.sin(a) * 4;
      drawRect(ctx, x - 1, y - 1, 2, 2, '#333');
    }
    
    // Center hub
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(8, 8, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Locking bolts around edge
    const boltPositions = [[2, 8], [14, 8], [8, 2], [8, 14]];
    boltPositions.forEach(([x, y]) => {
      drawRect(ctx, x - 1, y - 1, 2, 2, '#696969');
    });
    
    // Gold glow from inside (peeking through when door "opens")
    if (f % 40 > 35) {
      drawRect(ctx, 6, 6, 4, 4, '#FFD700');
    }
    
    // Dollar signs
    if (f % 8 < 4) {
      drawRect(ctx, 7, 7, 2, 2, '#FFD700');
    }
  },

  // Money tornado
  tornado: (ctx, f) => {
    // Storm sky
    drawRect(ctx, 0, 0, 16, 16, '#2a3a4a');
    
    // Ground
    drawRect(ctx, 0, 14, 16, 2, '#4a3a2a');
    
    // Tornado funnel (swirling)
    const twist = f * 0.2;
    
    // Draw tornado shape (wider at top, narrow at bottom)
    for (let y = 2; y < 14; y++) {
      const width = 8 - (y - 2) * 0.5;
      const xOffset = Math.sin(twist + y * 0.3) * 1.5;
      const x = 8 - width / 2 + xOffset;
      drawRect(ctx, x, y, width, 1, '#5a6a7a');
    }
    
    // Swirling money in tornado
    for (let i = 0; i < 6; i++) {
      const angle = twist + i * 1.2;
      const y = 4 + i * 1.8;
      const radius = 3 - i * 0.3;
      const x = 8 + Math.cos(angle) * radius;
      
      // Dollar bills
      drawRect(ctx, x, y, 2, 1, '#00FF00');
    }
    
    // Coins being sucked up
    for (let i = 0; i < 3; i++) {
      const angle = -twist + i * 2;
      const y = 12 - i * 3 - (f % 10) * 0.3;
      const x = 8 + Math.cos(angle) * (2 + i);
      if (y > 3 && y < 14) {
        drawRect(ctx, x, y, 1, 1, '#FFD700');
      }
    }
    
    // Debris
    const debrisY = 10 - (f % 20) * 0.5;
    if (debrisY > 3) {
      drawRect(ctx, 6 + Math.sin(f * 0.5) * 2, debrisY, 1, 1, '#8B4513');
    }
    
    // Lightning flash
    if (f % 30 === 0) {
      drawRect(ctx, 0, 0, 16, 16, '#FFFFAA');
    }
  },

  // Raining coins
  rain: (ctx, f) => {
    // Stormy sky
    drawRect(ctx, 0, 0, 16, 16, '#4a5a6a');
    
    // Rain clouds
    drawRect(ctx, 1, 1, 6, 3, '#696969');
    drawRect(ctx, 0, 2, 8, 2, '#5a5a5a');
    drawRect(ctx, 9, 0, 5, 3, '#696969');
    drawRect(ctx, 8, 1, 7, 2, '#5a5a5a');
    
    // Ground with puddles
    drawRect(ctx, 0, 14, 16, 2, '#3a4a3a');
    // Puddle reflections
    drawRect(ctx, 3, 14, 4, 1, '#5a6a7a');
    drawRect(ctx, 10, 15, 3, 1, '#5a6a7a');
    
    // Falling coins (multiple)
    for (let i = 0; i < 8; i++) {
      const x = (i * 2.3 + f * 0.5) % 16;
      const y = ((f * 3 + i * 7) % 20) - 4;
      
      if (y >= 0 && y < 14) {
        // Gold coin
        drawRect(ctx, x, y, 2, 2, '#FFD700');
        // Coin shine
        drawRect(ctx, x, y, 1, 1, '#FFFACD');
      }
    }
    
    // Rain streaks
    for (let i = 0; i < 5; i++) {
      const x = (i * 3 + f) % 16;
      const y = (f * 4 + i * 6) % 16;
      drawRect(ctx, x, y, 1, 2, '#87CEEB');
    }
    
    // Splash effects at bottom
    if (f % 6 < 3) {
      drawRect(ctx, 4, 13, 1, 1, '#87CEEB');
      drawRect(ctx, 11, 13, 1, 1, '#FFD700');
    }
    
    // Lightning occasionally
    if (f % 50 > 47) {
      ctx.strokeStyle = '#FFFF00';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(12, 3);
      ctx.lineTo(10, 7);
      ctx.lineTo(12, 7);
      ctx.lineTo(9, 12);
      ctx.stroke();
    }
  },

  // Capitalism personified
  capitalism: (ctx, f) => {
    // Stock exchange background
    drawRect(ctx, 0, 0, 16, 16, '#1a1a2e');
    
    // Stock ticker tape at top
    const tickerScroll = f % 20;
    drawRect(ctx, 0, 0, 16, 2, '#000');
    for (let i = 0; i < 3; i++) {
      const x = (i * 6 - tickerScroll * 0.5 + 20) % 20 - 4;
      drawRect(ctx, x, 0, 4, 2, i % 2 === 0 ? '#00FF00' : '#FF0000');
    }
    
    // Fat cat / businessman
    const bob = Math.sin(f * 0.1) * 0.5;
    
    // Body (fancy suit)
    drawRect(ctx, 4, 7 + bob, 8, 7, '#1a1a3a');
    // White shirt
    drawRect(ctx, 7, 8 + bob, 2, 4, '#FFF');
    // Tie
    drawRect(ctx, 7, 8 + bob, 2, 1, '#FF0000');
    drawRect(ctx, 7, 9 + bob, 1, 3, '#FF0000');
    
    // Head
    drawRect(ctx, 5, 3 + bob, 6, 5, '#FFCCAA');
    // Top hat
    drawRect(ctx, 5, 0 + bob, 6, 2, '#000');
    drawRect(ctx, 4, 2 + bob, 8, 1, '#000');
    
    // Monocle
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(9, 5 + bob, 1.5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Smug smile
    drawRect(ctx, 6, 7 + bob, 4, 1, '#8B0000');
    
    // Cigar
    drawRect(ctx, 10, 6 + bob, 3, 1, '#8B4513');
    // Smoke
    if (f % 6 < 4) {
      drawRect(ctx, 13, 5 - (f % 3), 1, 1, '#AAA');
    }
    
    // Money bags on sides
    drawRect(ctx, 0, 10, 3, 4, '#8B4513');
    drawRect(ctx, 1, 9, 2, 1, '#8B4513');
    drawRect(ctx, 0, 11, 1, 1, '#FFD700');
    
    drawRect(ctx, 13, 10, 3, 4, '#8B4513');
    drawRect(ctx, 13, 9, 2, 1, '#8B4513');
    drawRect(ctx, 15, 11, 1, 1, '#FFD700');
    
    // Flying money
    const moneyX = (f * 2) % 20 - 2;
    if (moneyX > 0 && moneyX < 15) {
      drawRect(ctx, moneyX, 14, 2, 1, '#00FF00');
    }
  },
};

export function PixelIcon({ type, size = 40, className = '' }: PixelIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = false;
    const scale = size / 16;
    
    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.scale(scale, scale);
      
      const drawFn = animations[type] || animations.hamster;
      drawFn(ctx, frameRef.current);
      
      ctx.restore();
      frameRef.current++;
    };
    
    animate();
    const interval = setInterval(animate, 100);
    
    return () => clearInterval(interval);
  }, [type, size]);
  
  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`border-3 border-foreground bg-foreground ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
