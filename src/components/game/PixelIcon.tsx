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
  hamster: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#8B4513');
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.stroke();
    const angle = (f * 0.15) % (Math.PI * 2);
    for (let i = 0; i < 4; i++) {
      const a = angle + (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.lineTo(8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7);
      ctx.stroke();
    }
    const bob = Math.sin(f * 0.5) * 1;
    drawRect(ctx, 5, 6 + bob, 6, 5, '#D2691E');
    drawRect(ctx, 9, 7 + bob, 1, 1, '#000');
  },
  intern: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#2F4F4F');
    drawRect(ctx, 2, 6, 6, 5, '#404040');
    drawRect(ctx, 3, 7, 4, 3, '#00FF00');
    const bob = Math.sin(f * 0.1) * 1;
    drawRect(ctx, 10, 5 + bob, 4, 4, '#FFCCAA');
    drawRect(ctx, 11, 7 + bob, 1, 1, '#000');
    // Coffee cup wobble
    const tilt = Math.sin(f * 0.3) * 0.5;
    drawRect(ctx, 13 + tilt, 10, 2, 3, '#FFF');
  },
  printer: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#4682B4');
    drawRect(ctx, 2, 4, 12, 8, '#D3D3D3');
    const moneyY = 8 - (f % 8);
    if (moneyY > 2) {
      drawRect(ctx, 4, moneyY, 8, 3, '#00FF00');
      drawRect(ctx, 5, moneyY + 1, 1, 1, '#008000');
    }
    drawRect(ctx, 12, 6, 1, 1, f % 4 < 2 ? '#FF0000' : '#00FF00');
    // Paper stack
    for (let i = 0; i < 3; i++) {
      drawRect(ctx, 4, 12 + i, 8, 1, '#90EE90');
    }
  },
  oil: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#87CEEB');
    drawRect(ctx, 0, 13, 16, 3, '#8B4513');
    const pump = Math.sin(f * 0.2) * 3;
    ctx.fillStyle = '#333';
    ctx.fillRect(6, 4, 4, 10);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(2, 6 + pump, 12, 2);
    // Oil drip
    if (f % 20 < 10) {
      drawRect(ctx, 8, 12 + (f % 10) * 0.5, 2, 2, '#000');
    }
  },
  crypto: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#000');
    const prices = [12, 10, 11, 8, 13, 9, 14, 11, 15, 10, 12, 7, 14];
    for (let i = 0; i < prices.length - 1; i++) {
      const h1 = prices[(i + Math.floor(f / 3)) % prices.length];
      const h2 = prices[(i + 1 + Math.floor(f / 3)) % prices.length];
      const color = h2 > h1 ? '#00FF00' : '#FF0000';
      drawRect(ctx, 1 + i, 16 - h1, 1, Math.abs(h2 - h1) + 1, color);
    }
    // Bitcoin symbol flash
    if (f % 10 < 5) {
      ctx.fillStyle = '#FFD700';
      ctx.font = '6px monospace';
      ctx.fillText('₿', 6, 6);
    }
  },
  reserve: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#191970');
    // Building columns
    for (let i = 0; i < 3; i++) {
      drawRect(ctx, 2 + i * 5, 4, 3, 10, '#FFF');
    }
    // Falling money
    for (let i = 0; i < 4; i++) {
      const y = ((f * 2 + i * 4) % 16);
      drawRect(ctx, 1 + i * 4, y, 3, 2, '#00FF00');
    }
  },
  void: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#000');
    const pulse = Math.sin(f * 0.2) * 2;
    // Multiple rings
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = i === 0 ? '#FF00FF' : i === 1 ? '#8800FF' : '#4400FF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(8, 8, 3 + i * 2 + pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Center sparkle
    if (f % 6 < 3) {
      drawRect(ctx, 7, 7, 2, 2, '#FFF');
    }
  },
  time: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#4B0082');
    // Clock face
    ctx.fillStyle = '#C0C0C4';
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    // Clock hands
    const ang1 = (f * 0.3) % (Math.PI * 2);
    const ang2 = (f * 0.05) % (Math.PI * 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(8 + Math.cos(ang1) * 4, 8 + Math.sin(ang1) * 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(8 + Math.cos(ang2) * 3, 8 + Math.sin(ang2) * 3);
    ctx.stroke();
  },
  alchemy: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#2F1810');
    // Flask
    drawRect(ctx, 5, 2, 6, 3, '#87CEEB');
    drawRect(ctx, 4, 5, 8, 8, '#87CEEB');
    // Bubbling liquid
    const bubbleY = 10 - (f % 5);
    drawRect(ctx, 6, bubbleY, 2, 2, '#FFD700');
    if (f % 8 < 4) {
      drawRect(ctx, 8, bubbleY + 2, 1, 1, '#FFD700');
    }
  },
  dragon: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#8B0000');
    // Gold pile
    for (let i = 0; i < 4; i++) {
      drawRect(ctx, 2 + i * 3, 12 - i * 0.5, 3, 4 + i * 0.5, '#FFD700');
    }
    // Dragon body
    drawRect(ctx, 5, 5, 6, 5, '#228B22');
    // Wings
    const wing = Math.sin(f * 0.3) * 2;
    drawRect(ctx, 2 + wing, 4, 4, 3, '#006400');
    drawRect(ctx, 10 - wing, 4, 4, 3, '#006400');
    // Eye
    drawRect(ctx, 6, 6, 1, 1, '#FF0000');
    // Fire breath
    if (f % 15 < 8) {
      drawRect(ctx, 11, 6, 3, 2, '#FF4500');
      drawRect(ctx, 13, 7, 2, 1, '#FFD700');
    }
  },
  tree: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#87CEEB');
    // Trunk
    drawRect(ctx, 7, 8, 2, 6, '#8B4513');
    // Leaves with sway
    const sway = Math.sin(f * 0.15) * 1;
    drawRect(ctx, 4 + sway, 3, 8, 6, '#006400');
    drawRect(ctx, 6 + sway, 1, 4, 3, '#228B22');
    // Money falling
    const moneyY = (f * 2) % 16;
    if (moneyY > 8) {
      drawRect(ctx, 5 + (f % 3), moneyY, 2, 2, '#00FF00');
    }
  },
  goose: (ctx, f) => {
    drawRect(ctx, 0, 0, 16, 16, '#87CEEB');
    drawRect(ctx, 0, 12, 16, 4, '#90EE90');
    // Goose body
    drawRect(ctx, 4, 6, 8, 5, '#FFF');
    // Neck & head
    drawRect(ctx, 2, 3, 3, 4, '#FFF');
    drawRect(ctx, 1, 2, 3, 2, '#FFF');
    // Beak
    drawRect(ctx, 0, 3, 2, 1, '#FFA500');
    // Eye
    drawRect(ctx, 2, 2, 1, 1, '#000');
    // Golden egg animation
    if ((f % 30) < 20) {
      const eggY = 10 + Math.min((f % 30), 5) * 0.5;
      drawRect(ctx, 9, eggY, 3, 4, '#FFD700');
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
