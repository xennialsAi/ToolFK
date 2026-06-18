import React, { useState } from "react";
import { Database, Plus, Play, Table, Hash, Type } from "lucide-react";

export function InteractiveSqlBuilderSandbox() {
  const [query, setQuery] = useState("SELECT * FROM users\\nWHERE status = 'active'\\nORDER BY created_at DESC;");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);

  const mockRunQuery = () => {
    setIsRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult([
        { id: 1, name: "Alice Synth", email: "alice@nano.tech", status: "active", created_at: "2026-06-18" },
        { id: 2, name: "Bob Cyber", email: "bob@cyber.net", status: "active", created_at: "2026-06-17" },
        { id: 3, name: "Charlie Base", email: "charlie@base.io", status: "active", created_at: "2026-06-16" },
      ]);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
         <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Interactive SQL Builder</h3>
         </div>
         <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">Local SQLite Mock</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
           <div className="bg-[#090e1a]/80 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-md flex flex-col h-full">
             <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Query Editor</span>
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
                </div>
             </div>
             <textarea
                className="w-full h-40 bg-[#04060a] border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none transition-all shadow-inner leading-relaxed"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
             />
             <div className="mt-4">
               <button 
                 onClick={mockRunQuery}
                 disabled={isRunning}
                 className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-400 border border-emerald-500/30 transition-all font-sans text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 <Play className="h-4 w-4" /> {isRunning ? "EXECUTING..." : "RUN QUERY"}
               </button>
             </div>
           </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-[#04060a] border border-zinc-900 rounded-2xl p-4 h-full flex flex-col relative overflow-hidden">
             <div className="flex items-center gap-2 mb-4">
               <Table className="h-4 w-4 text-zinc-500" />
               <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Query Results</span>
             </div>
             
             <div className="flex-1 overflow-auto rounded-xl border border-zinc-800/50 bg-[#090e1a]/50">
               {isRunning ? (
                 <div className="h-full flex items-center justify-center font-mono text-xs text-zinc-500 animate-pulse">
                   Fetching rows...
                 </div>
               ) : result ? (
                 <table className="w-full text-left border-collapse font-mono text-[10px]">
                   <thead>
                     <tr className="border-b border-zinc-800 bg-[#0b101c]">
                       {Object.keys(result[0]).map((key) => (
                         <th key={key} className="p-3 text-zinc-400 uppercase font-bold tracking-wider">
                           <div className="flex items-center gap-1.5">
                             {key === 'id' ? <Hash className="h-3 w-3" /> : <Type className="h-3 w-3" />}
                             {key}
                           </div>
                         </th>
                       ))}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-800/50">
                     {result.map((row, i) => (
                       <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                         {Object.values(row).map((val: any, j) => (
                           <td key={j} className="p-3 text-zinc-300">
                             {val}
                           </td>
                         ))}
                       </tr>
                     ))}
                   </tbody>
                 </table>
               ) : (
                 <div className="h-full flex items-center justify-center font-mono text-xs text-zinc-600">
                   Waiting for query execution...
                 </div>
               )}
             </div>
             {result && !isRunning && (
               <div className="absolute bottom-6 right-6 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono text-[9px] uppercase tracking-wider">
                 {result.length} rows returned
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
