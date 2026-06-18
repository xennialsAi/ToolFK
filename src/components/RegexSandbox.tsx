import React, { useState } from "react";
import { Hammer, Check, Sparkles, SlidersHorizontal, Eye } from "lucide-react";

export function RegexSandbox() {
  const [pattern, setPattern] = useState("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b");
  const [flags, setFlags] = useState({ g: true, i: true, m: false });
  const [testText, setTestText] = useState(
    "Send security logs to admin@toolfk.org or developer-ops@terminal-beta.io. You can also find help at support@google.com."
  );

  const toggleFlag = (flag: "g" | "i" | "m") => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const getRegex = (): RegExp | null => {
    try {
      let combinedFlags = "";
      if (flags.g) combinedFlags += "g";
      if (flags.i) combinedFlags += "i";
      if (flags.m) combinedFlags += "m";
      return new RegExp(pattern, combinedFlags);
    } catch (e) {
      return null;
    }
  };

  const getHighlightedText = () => {
    const regex = getRegex();
    if (!regex || !pattern) return <span>{testText}</span>;

    try {
      const results: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      // If global is false, we must avoid infinite loop by matching only once or safely advancing
      if (!regex.global) {
        match = regex.exec(testText);
        if (match) {
          const start = match.index;
          const end = start + match[0].length;
          results.push(testText.substring(lastIndex, start));
          results.push(
            <mark key={start} className="bg-red-500/20 text-red-400 border border-red-500/40 rounded px-1 py-0.5 mx-0.5 font-bold font-mono">
              {match[0]}
            </mark>
          );
          lastIndex = end;
        }
        results.push(testText.substring(lastIndex));
        return results;
      }

      // Safeguard against empty matches (like a* or a?) causing infinite loop
      let iterations = 0;
      while ((match = regex.exec(testText)) !== null && iterations < 300) {
        iterations++;
        const start = match.index;
        const end = start + match[0].length;

        // Prevent infinite loop if index doesn't advance
        if (regex.lastIndex === start) {
          regex.lastIndex++;
        }

        results.push(testText.substring(lastIndex, start));
        results.push(
          <mark key={start} className="bg-blue-600/30 text-sky-400 border border-blue-500/40 rounded px-1.5 py-0.5 mx-0.5 font-mono font-bold">
            {match[0]}
          </mark>
        );
        lastIndex = end;
      }

      results.push(testText.substring(lastIndex));
      return results;
    } catch (e) {
      return <span>{testText}</span>;
    }
  };

  // Calculate matches count
  let matchCount = 0;
  const regexInstance = getRegex();
  if (regexInstance && pattern) {
    try {
      const matchArray = testText.match(regexInstance);
      matchCount = matchArray ? matchArray.length : 0;
    } catch (e) {
      matchCount = 0;
    }
  }

  return (
    <div id="regex-sandbox" className="space-y-4 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-red-500" />
          <h3 className="font-mono text-lg font-bold text-zinc-100">Live Regex pattern compiler & highlight viewer</h3>
        </div>
        <span className="text-zinc-500 font-mono text-xs">Sandbox Engine: V8 Javascript PCRE</span>
      </div>

      <div className="space-y-3">
        {/* Pattern Input row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 font-bold font-mono text-[#ff2d55]">/</span>
            <input
              id="regex-pattern-input"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full rounded-md bg-[#0b0f19] border border-zinc-800 py-2.5 pl-7 pr-7 font-mono text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. \b[a-z]+\b"
            />
            <span className="absolute right-3 top-2.5 font-bold font-mono text-[#ff2d55]">/</span>
          </div>

          {/* Flags selections */}
          <div className="flex items-center gap-3 bg-[#0f1526] border border-zinc-800 rounded px-3 py-1.5 font-mono text-xs">
            <span className="text-zinc-500 font-bold uppercase select-none mr-1">Flags</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={flags.g} onChange={() => toggleFlag("g")} className="accent-red-500" />
              <span className={flags.g ? "text-red-400 font-bold" : "text-zinc-500"}>g</span>
              <span className="text-zinc-600 font-light" title="Global matches">global</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={flags.i} onChange={() => toggleFlag("i")} className="accent-blue-500" />
              <span className={flags.i ? "text-blue-400 font-bold" : "text-zinc-500"}>i</span>
              <span className="text-zinc-600 font-light" title="Ignorecase letters">insensitive</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={flags.m} onChange={() => toggleFlag("m")} className="accent-yellow-500" />
              <span className={flags.m ? "text-yellow-400 font-bold" : "text-zinc-500"}>m</span>
              <span className="text-zinc-600 font-light" title="Multiline search">multiline</span>
            </label>
          </div>
        </div>

        {/* Validate regex state */}
        {!getRegex() && pattern !== "" && (
          <div className="text-xs text-red-400 font-mono bg-red-950/20 border border-red-900/30 p-2 rounded">
            ⚠️ Invalid regex pattern configuration. Check brackets, escapes, or trailing flags.
          </div>
        )}

        {/* Inputs & Matches layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Test text input string</span>
            <textarea
              id="regex-test-text"
              rows={6}
              className="w-full rounded-md bg-[#070b13] border border-zinc-800 p-3.5 font-mono text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Paste characters here to search matches..."
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] flex items-center gap-1"><Eye className="h-3 w-3" /> Real-time Match highlight view</span>
              <span className="rounded-full bg-blue-900/30 border border-blue-500/20 px-2 py-0.5 font-mono text-[10px] text-blue-400 font-bold">{matchCount} matches detected</span>
            </div>
            <div className="w-full rounded-md bg-[#070b13] border border-zinc-800 p-4 font-mono text-sm leading-relaxed min-h-[140px] max-h-[150px] overflow-auto select-text whitespace-pre-wrap">
              {getHighlightedText()}
            </div>
          </div>
        </div>
      </div>

      {/* Preset Library tags */}
      <div className="bg-[#0f1526]/50 border border-zinc-900 rounded-lg p-3 text-xs font-mono space-y-1">
        <span className="text-zinc-500 uppercase tracking-widest text-[10px] block font-bold">📚 Fast Preset Regex Templates:</span>
        <div className="flex flex-wrap gap-2 pt-1 font-mono">
          <button 
            type="button"
            onClick={() => setPattern("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b")}
            className="px-2.5 py-1 bg-zinc-850 hover:bg-[#ff2d55]/10 border border-zinc-800 hover:border-[#ff2d55]/30 rounded text-zinc-300 hover:text-[#ff2d55] transition-all"
          >
            Email matches
          </button>
          <button 
            type="button"
            onClick={() => setPattern("(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)")}
            className="px-2.5 py-1 bg-zinc-850 hover:bg-blue-500/10 border border-zinc-800 hover:border-blue-500/30 rounded text-zinc-300 hover:text-blue-400 transition-all"
          >
            URL match link
          </button>
          <button 
            type="button"
            onClick={() => setPattern("\\d{4}-\\d{2}-\\d{2}")}
            className="px-2.5 py-1 bg-zinc-850 hover:bg-zinc-700 border border-zinc-800 rounded text-zinc-300 transition-all"
          >
            Date (YYYY-MM-DD)
          </button>
          <button 
            type="button"
            onClick={() => setPattern("<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>")}
            className="px-2.5 py-1 bg-zinc-850 hover:bg-zinc-700 border border-zinc-800 rounded text-zinc-300 transition-all"
          >
            HTML simple tags
          </button>
        </div>
      </div>
    </div>
  );
}
