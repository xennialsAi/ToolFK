import React, { useState } from "react";
import { Play, Square, Settings2, Activity, Volume2 } from "lucide-react";

export function AudioVoiceSynthLab() {
  const [text, setText] = useState("Welcome to the advanced web audio synth lab. Experience native browser speech synthesis.");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

  const handleStop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
         <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-purple-400" />
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Audio & Voice Synth Lab</h3>
         </div>
         <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">Web Audio API</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5 bg-[#090e1a]/80 p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
           <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Speech Input</label>
              <textarea
                className="w-full bg-[#0b0f19] border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-200 placeholder-zinc-700 focus:border-purple-500/50 focus:outline-none transition-all resize-none shadow-inner"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
           </div>
           
           <div className="space-y-5">
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-mono text-zinc-500">
                 <label>Pitch ({pitch})</label>
                 <Settings2 className="h-3 w-3" />
               </div>
               <input
                 type="range"
                 min="0" max="2" step="0.1"
                 value={pitch}
                 onChange={(e) => setPitch(parseFloat(e.target.value))}
                 className="w-full accent-purple-500"
               />
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-mono text-zinc-500">
                 <label>Rate ({rate})</label>
                 <Activity className="h-3 w-3" />
               </div>
               <input
                 type="range"
                 min="0.5" max="2" step="0.1"
                 value={rate}
                 onChange={(e) => setRate(parseFloat(e.target.value))}
                 className="w-full accent-purple-500"
               />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-3 pt-2">
             <button 
               onClick={handlePlay}
               disabled={isPlaying || !text.trim()}
               className="w-full bg-purple-500 hover:bg-purple-600 active:scale-95 text-white shadow-lg shadow-purple-500/20 transition-all font-sans text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <Play className="h-4 w-4" /> PLAY
             </button>
             <button 
               onClick={handleStop}
               disabled={!isPlaying}
               className="w-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 transition-all font-sans text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <Square className="h-4 w-4" /> STOP
             </button>
           </div>
        </div>

        <div className="bg-[#04060a] border border-zinc-900 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[300px] relative overflow-hidden group">
          {isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`, 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.4s'
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-700 space-y-3 z-10">
               <Volume2 className="h-10 w-10 opacity-20" />
               <span className="text-xs font-mono">Audio engine standby</span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            <span>Status: {isPlaying ? 'Sustaining' : 'Idle'}</span>
            <span>Freq: Variable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
