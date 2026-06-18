import React, { useState, useEffect } from "react";
import { PlaySquare, Maximize2, MoveRight, RotateCw, Copy, Check } from "lucide-react";

export function CssKeyframeAnimationStudio() {
  const [duration, setDuration] = useState(2);
  const [iteration, setIteration] = useState("infinite");
  const [copied, setCopied] = useState(false);
  const [animType, setAnimType] = useState("bounce-custom");

  const customKeyframes = `
@keyframes bounce-custom {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}
@keyframes pulse-custom {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.05); }
}
@keyframes spin-custom {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
  `;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = customKeyframes;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [customKeyframes]);

  const cssOutput = `.animate-element {
  animation: ${animType} ${duration}s ease-in-out ${iteration};
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssOutput + "\\n" + customKeyframes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
         <div className="flex items-center gap-2">
            <PlaySquare className="h-5 w-5 text-orange-400" />
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">CSS Keyframe Studio</h3>
         </div>
         <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">Animation Builder</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 bg-[#090e1a]/80 p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
           
           <div className="space-y-3">
             <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Animation Type</label>
             <div className="flex gap-2">
               <button onClick={() => setAnimType('bounce-custom')} className={`flex-1 py-2 rounded-lg text-xs font-sans font-bold transition-all ${animType === 'bounce-custom' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Bounce</button>
               <button onClick={() => setAnimType('pulse-custom')} className={`flex-1 py-2 rounded-lg text-xs font-sans font-bold transition-all ${animType === 'pulse-custom' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Pulse</button>
               <button onClick={() => setAnimType('spin-custom')} className={`flex-1 py-2 rounded-lg text-xs font-sans font-bold transition-all ${animType === 'spin-custom' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Spin</button>
             </div>
           </div>

           <div className="space-y-4">
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-mono text-zinc-500">
                 <label>Duration ({duration}s)</label>
               </div>
               <input
                 type="range" min="0.1" max="5" step="0.1"
                 value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))}
                 className="w-full accent-orange-500"
               />
             </div>
             
             <div className="space-y-2">
               <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Iteration Count</label>
               <select 
                 value={iteration} 
                 onChange={(e) => setIteration(e.target.value)}
                 className="w-full bg-[#04060a] border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-300 focus:outline-none"
               >
                 <option value="infinite">Infinite</option>
                 <option value="1">1</option>
                 <option value="3">3</option>
                 <option value="5">5</option>
               </select>
             </div>
           </div>

           <div className="pt-2">
            <button 
              onClick={handleCopy}
              className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 active:scale-95 transition-all font-sans text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "COPIED CSS" : "EXPORT CSS CLASSES"}
            </button>
           </div>
        </div>

        <div className="bg-[#04060a] border border-zinc-900 rounded-2xl flex items-center justify-center min-h-[300px] relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]">
           <div 
             className="w-24 h-24 bg-gradient-to-tr from-orange-600 to-rose-500 rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center border border-white/20"
             style={{
               animation: `${animType} ${duration}s ease-in-out ${iteration}`
             }}
           >
              <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white" />
           </div>

           <div className="absolute top-4 left-4 right-4 relative">
             <pre className="text-[10px] font-mono text-zinc-500 bg-black/50 p-2 rounded max-w-full overflow-hidden backdrop-blur-sm">
               {cssOutput}
             </pre>
           </div>
        </div>
      </div>
    </div>
  );
}
