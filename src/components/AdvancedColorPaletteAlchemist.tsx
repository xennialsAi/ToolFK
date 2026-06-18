import React, { useState } from "react";
import { Palette, Copy, Check, RefreshCw } from "lucide-react";

export function AdvancedColorPaletteAlchemist() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [copied, setCopied] = useState(false);

  const generateShades = (hex: string) => {
    // Very simple mockup of shades
    return [
      { step: 50, op: 0.1 }, { step: 100, op: 0.2 }, { step: 200, op: 0.3 },
      { step: 300, op: 0.4 }, { step: 400, op: 0.6 }, { step: 500, op: 0.8 },
      { step: 600, op: 0.9 }, { step: 700, op: 0.95 }, { step: 800, op: 1 },
      { step: 900, op: 1 }, { step: 950, op: 1 },
    ];
  };

  const shades = generateShades(baseColor);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  };

  const copyConfig = () => {
    const config = `'primary': '${baseColor}',`;
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
         <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-400" />
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Color Palette Alchemist</h3>
         </div>
         <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">Tailwind Export</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-5 bg-[#090e1a]/80 p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
           <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Base Hex</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="h-10 w-12 rounded cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={baseColor.toUpperCase()}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-zinc-800 rounded-xl px-3 font-mono text-sm text-zinc-200 focus:border-indigo-500/50 focus:outline-none transition-all shadow-inner uppercase"
                />
              </div>
           </div>
           
           <button 
             onClick={() => {
               const randomColor = Math.floor(Math.random()*16777215).toString(16);
               setBaseColor("#" + randomColor.padStart(6, '0'));
             }}
             className="w-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 transition-all font-sans text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2"
           >
             <RefreshCw className="h-4 w-4" /> Randomize
           </button>

           <div className="pt-4 border-t border-zinc-800/80">
            <button 
              onClick={copyConfig}
              className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 active:scale-95 transition-all font-sans text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "COPIED CONFIG" : "EXPORT CONFIG"}
            </button>
           </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
            {shades.map((shade) => (
              <div key={shade.step} className="flex flex-col gap-2">
                <div 
                  className="h-16 rounded-xl border border-white/5 shadow-inner"
                  style={{ backgroundColor: baseColor, opacity: shade.op }}
                />
                <div className="text-center font-mono text-[9px] text-zinc-500">{shade.step}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-[#04060a] border border-zinc-900 rounded-2xl flex flex-col gap-4">
             <span className="text-[10px] font-mono uppercase text-zinc-600 block tracking-widest">Mock UI Components</span>
             <div className="flex flex-wrap gap-4">
               <button style={{ backgroundColor: baseColor }} className="px-6 py-2.5 rounded-full text-white font-medium text-sm shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-transform">
                 Primary Action
               </button>
               <button style={{ color: baseColor, borderColor: baseColor }} className="px-6 py-2.5 rounded-full bg-transparent border text-sm font-medium hover:-translate-y-0.5 transition-transform">
                 Secondary
               </button>
               <div style={{ backgroundColor: `rgba(${hexToRgb(baseColor)}, 0.1)`, color: baseColor }} className="px-4 py-1.5 rounded-md text-xs font-bold flex items-center justify-center">
                 Status Badge
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
