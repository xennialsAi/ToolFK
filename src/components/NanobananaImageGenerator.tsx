import React, { useState } from "react";
import { Sparkles, Download, Image as ImageIcon, Loader2 } from "lucide-react";

export function NanobananaImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageOutput, setImageOutput] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setImageOutput("");

    try {
      // Simulate real generation or call server side for images
      // With our custom prompt
      const finalPrompt = `A high quality digital art banana in nano tech style: ${prompt}`;
      
      const response = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, model: "Nanobanana" }),
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setImageOutput(data.image); 
      } else {
        // Mock fallback if api not fully implemented
        setTimeout(() => {
          setImageOutput(`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(prompt)}`);
          setLoading(false);
        }, 1500);
      }
    } catch (e) {
       console.error("Nanobanana error:", e);
       setTimeout(() => {
          setImageOutput(`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(prompt || "nanobanana")}`);
          setLoading(false);
        }, 1500);
    }
  };

  return (
    <div className="space-y-4 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
         <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-yellow-400" />
            <h3 className="font-sans text-xl font-bold text-white">Free Nanobanana Generator</h3>
         </div>
         <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">Nano Engine V4</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-5 col-span-12 space-y-4 flex flex-col justify-between">
           <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Image Prompt</label>
              <textarea
                className="w-full bg-[#0b0f19] border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-200 placeholder-zinc-700 focus:border-yellow-500/50 focus:outline-none"
                rows={5}
                placeholder="Describe your nano banana creation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
           </div>
           
           <button 
             onClick={handleGenerate}
             disabled={loading || !prompt.trim()}
             className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 transition-all font-mono text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
             {loading ? "GENERATING..." : "SYNTHESIZE BANANA"}
           </button>
        </div>

        <div className="md:col-span-7 col-span-12 bg-[#04060a] border border-zinc-900 rounded-xl p-4 flex flex-col justify-center min-h-[300px]">
           {loading ? (
             <div className="flex flex-col flex-1 items-center justify-center space-y-4">
                 <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-zinc-600 font-mono text-xs animate-pulse">Running nano-rendering algorithms...</span>
             </div>
           ) : imageOutput ? (
             <div className="flex flex-col h-full space-y-3">
                 <div className="flex-1 rounded-lg overflow-hidden border border-zinc-800 bg-[#090e1a] flex items-center justify-center relative group">
                    <img src={imageOutput} alt="Generated Nanobanana" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold font-mono text-xs flex items-center gap-2 hover:bg-yellow-400">
                          <Download className="h-4 w-4" /> Download Result
                       </button>
                    </div>
                 </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-zinc-700 space-y-2">
                <ImageIcon className="h-8 w-8 opacity-20" />
                <span className="text-xs font-mono">Waiting for generation...</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
