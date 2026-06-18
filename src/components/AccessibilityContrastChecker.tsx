import React, { useState } from "react";
import { Eye, CheckCircle2, XCircle } from "lucide-react";

export function AccessibilityContrastChecker() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#0b101c");

  // Relative luminance
  const luminance = (r: number, g: number, b: number) => {
    let [rs, gs, bs] = [r / 255, g / 255, b / 255];
    rs = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    gs = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    bs = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return {r:0,g:0,b:0};
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  };

  const getContrast = (c1: string, c2: string) => {
    const rgb1 = getRgb(c1);
    const rgb2 = getRgb(c2);
    const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (lightest + 0.05) / (darkest + 0.05);
  };

  const ratio = getContrast(fg, bg).toFixed(2);
  const numRatio = parseFloat(ratio);
  
  const aaNormal = numRatio >= 4.5;
  const aaLarge = numRatio >= 3.0;
  const aaaNormal = numRatio >= 7.0;
  const aaaLarge = numRatio >= 4.5;

  return (
    <div className="space-y-6 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
         <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-sky-400" />
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">a11y Contrast Checker</h3>
         </div>
         <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">WCAG Standard</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 bg-[#090e1a]/80 p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
           
           <div className="space-y-4">
             <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Text Color (Foreground)</label>
                <div className="flex gap-2">
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-12 rounded cursor-pointer bg-transparent" />
                  <input type="text" value={fg.toUpperCase()} onChange={(e) => setFg(e.target.value)} className="w-full bg-[#0b0f19] border border-zinc-800 rounded-xl px-3 font-mono text-sm text-zinc-200 transition-all shadow-inner uppercase" />
                </div>
             </div>
             
             <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Background Color</label>
                <div className="flex gap-2">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-12 rounded cursor-pointer bg-transparent" />
                  <input type="text" value={bg.toUpperCase()} onChange={(e) => setBg(e.target.value)} className="w-full bg-[#0b0f19] border border-zinc-800 rounded-xl px-3 font-mono text-sm text-zinc-200 transition-all shadow-inner uppercase" />
                </div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Contrast Ratio</div>
                <div className={`text-3xl font-black mt-2 ${numRatio >= 4.5 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ratio}:1
                </div>
             </div>
             <div className="flex flex-col justify-center space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">AA Normal</span>
                  {aaNormal ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">AA Large</span>
                  {aaLarge ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">AAA Normal</span>
                  {aaaNormal ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                </div>
             </div>
           </div>
        </div>

        <div 
          className="border border-zinc-900 rounded-2xl p-8 flex flex-col justify-center text-center shadow-inner"
          style={{ backgroundColor: bg }}
        >
          <div style={{ color: fg }}>
            <h4 className="text-2xl font-bold font-sans mb-4">Accessibility Live Preview</h4>
            <p className="text-sm opacity-90 leading-relaxed max-w-md mx-auto">
              This is standard body copy text. Testing for a smooth reading experience across varying contrast ratios implies a critical focus on usability.
            </p>
            <div className="mt-8 opacity-50 text-xs font-mono">
              [ Secondary Text / Placeholder ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
