import React, { useEffect, useRef } from "react";
import { Move3d, MousePointer2 } from "lucide-react";

export function PhysicsCanvasPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    
    // Very simple physics mock
    let particles = Array.from({length: 40}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 60 + 190}, 80%, 60%)` // Cyan/Blue spectrum
    }));

    let animationId: number;

    const render = () => {
      ctx.fillStyle = "rgba(4, 6, 10, 0.3)"; // Trail effect
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < p.radius || p.x > width - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > height - p.radius) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.closePath();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="space-y-6 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
         <div className="flex items-center gap-2">
            <Move3d className="h-5 w-5 text-cyan-400" />
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">3D Physics Sandbox</h3>
         </div>
         <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">HTML5 Canvas Engine</span>
      </div>

      <div className="bg-[#04060a] border border-zinc-900 rounded-2xl relative overflow-hidden group h-[400px]">
         <canvas 
           ref={canvasRef} 
           width={800} 
           height={400} 
           className="w-full h-full cursor-crosshair"
         />
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
            <div className="bg-black/60 px-4 py-2 rounded-full border border-zinc-800 text-xs font-mono flex items-center gap-2 text-cyan-400">
               <MousePointer2 className="h-3 w-3" />
               Interactive physics engine actively running...
            </div>
         </div>
      </div>
    </div>
  );
}
