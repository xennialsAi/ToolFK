import React, { useState } from "react";
import { Code, Layers, FileCode, Check, AlertOctagon, HelpCircle, Copy } from "lucide-react";

const SAMPLES = {
  profile: {
    id: "usr_9921",
    username: "cyber_commander_6",
    active: true,
    avatar_url: "https://avatar.placeholder.com/992.png",
    roles: ["operator", "compiler-admin"],
    security_hash: "0a89fc8e33f",
    system_load: { cpu: 0.12, memory: "348MB" }
  },
  config: {
    env: "playground_beta",
    port: 3000,
    database: {
      type: "firestore",
      location: "us-west2",
      max_connections: 120,
      replication: ["us-east", "eu-central"]
    },
    flags: {
      enable_hmr: false,
      debug_trace: true,
      sandbox_isolation: "tier-3"
    }
  },
  endpoint: {
    status: "ok",
    timestamp: 1781742412,
    service: "matrix-api-service",
    latency_ms: 4.88,
    metrics: [
      { path: "/api/ai/text", calls: 245, errs: 0 },
      { path: "/api/ai/compiler", calls: 1042, errs: 2 }
    ]
  }
};

export function JsonSandbox() {
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLES.profile, null, 2));
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTreeMode, setIsTreeMode] = useState(false);

  const handleFormat = (spaces: number) => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, spaces));
      setErrorMsg(null);
    } catch (e) {
      setErrorMsg((e as Error).message);
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed));
      setErrorMsg(null);
    } catch (e) {
      setErrorMsg((e as Error).message);
    }
  };

  const loadSample = (key: keyof typeof SAMPLES) => {
    setJsonText(JSON.stringify(SAMPLES[key], null, 2));
    setErrorMsg(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    try {
      JSON.parse(jsonText);
      setErrorMsg(null);
      alert("✅ Valid JSON structure! No token or brackets issues.");
    } catch (e) {
      setErrorMsg((e as Error).message);
    }
  };

  // Safe visual tree view compiler
  const renderTree = (obj: any): React.ReactNode => {
    if (obj === null) return <span className="text-zinc-500">null</span>;
    if (typeof obj === "undefined") return <span className="text-zinc-500">undefined</span>;
    if (typeof obj === "string") return <span className="text-green-400">"{obj}"</span>;
    if (typeof obj === "number") return <span className="text-yellow-400">{obj}</span>;
    if (typeof obj === "boolean") return <span className="text-blue-400">{obj ? "true" : "false"}</span>;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span>[]</span>;
      return (
        <div className="pl-4 border-l border-zinc-800">
          <span className="text-zinc-500">[</span>
          <div className="space-y-1 my-1">
            {obj.map((item, idx) => (
              <div key={idx} className="flex font-mono text-xs">
                <span className="text-zinc-600 mr-2">Index {idx}:</span>
                {renderTree(item)}
              </div>
            ))}
          </div>
          <span className="text-zinc-500">]</span>
        </div>
      );
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys.length === 0) return <span>{"{}"}</span>;
      return (
        <div className="pl-4 border-l border-zinc-800">
          <span className="text-zinc-500">{"{"}</span>
          <div className="space-y-1 my-1">
            {keys.map((k) => (
              <div key={k} className="flex font-mono text-xs flex-wrap">
                <span className="text-red-400 font-bold mr-1">"{k}":</span>
                {renderTree(obj[k])}
              </div>
            ))}
          </div>
          <span className="text-zinc-500">{"}"}</span>
        </div>
      );
    }

    return <span>{String(obj)}</span>;
  };

  let treeStructure: any = null;
  try {
    treeStructure = JSON.parse(jsonText);
  } catch (e) {
    // catch silently for tree output state
  }

  return (
    <div id="json-sandbox" className="space-y-4 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-500" />
          <h3 className="font-mono text-lg font-bold text-zinc-100">JSON Compiler, Schema Editor & Tree Viewer</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          Sample Schemas: 
          <button onClick={() => loadSample("profile")} className="bg-[#141d33] hover:bg-[#1a284c] border border-blue-900/30 px-2 py-0.5 rounded font-mono text-zinc-300 transition-colors">Profile</button>
          <button onClick={() => loadSample("config")} className="bg-[#1d161d] hover:bg-[#331c33] border border-red-950 px-2 py-0.5 rounded font-mono text-zinc-300 transition-colors">Config</button>
          <button onClick={() => loadSample("endpoint")} className="bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded font-mono text-zinc-300 transition-colors">Route</button>
        </div>
      </div>

      <div className="flex gap-2 bg-[#090d16] p-1 border border-zinc-800 rounded-lg max-w-fit text-xs font-mono">
        <button 
          onClick={() => setIsTreeMode(false)}
          className={`px-3 py-1.5 rounded transition-all ${!isTreeMode ? "bg-[#ff2d55] text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Raw Input Code
        </button>
        <button 
          onClick={() => {
            setIsTreeMode(true);
            try {
              JSON.parse(jsonText);
              setErrorMsg(null);
            } catch (e) {
              setErrorMsg((e as Error).message);
            }
          }}
          className={`px-3 py-1.5 rounded transition-all ${isTreeMode ? "bg-[#38bdf8] text-[#040815] font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Visual Node Inspector
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {!isTreeMode ? (
          <div className="space-y-2">
            <textarea
              id="raw-json-editor"
              rows={12}
              className="w-full rounded-md bg-[#070b13] border border-zinc-800 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Paste or write your JSON data..."
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                // real-time warning checker
                try {
                  JSON.parse(e.target.value);
                  setErrorMsg(null);
                } catch (err) {
                  setErrorMsg((err as Error).message);
                }
              }}
            />
          </div>
        ) : (
          <div className="bg-[#070b13] rounded-md border border-zinc-800 p-4 font-mono min-h-[290px] overflow-auto max-h-[420px]">
            {errorMsg ? (
              <div className="flex items-start gap-2.5 text-red-400 text-sm bg-red-950/20 border border-red-900/30 p-3 rounded">
                <AlertOctagon className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold">Parsing stalled: Fix standard errors first</h4>
                  <p className="text-xs mt-1">{errorMsg}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-2 mb-2">Expanded Object Directory Tree</h4>
                {renderTree(treeStructure)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor triggers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleFormat(2)} 
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-medium transition-colors border border-zinc-700"
          >
            Format 2-Spaces
          </button>
          <button 
            onClick={() => handleFormat(4)} 
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-medium transition-all border border-zinc-700"
          >
            Format 4-Spaces
          </button>
          <button 
            onClick={handleMinify} 
            className="px-3 py-1.5 rounded bg-[#1e131d] hover:bg-[#331830] text-red-400 text-xs font-mono border border-red-900/30 transition-all"
          >
            Compress / Minify
          </button>
          <button 
            onClick={handleValidate} 
            className="px-3 py-1.5 rounded bg-[#0f2115] hover:bg-[#163a22] text-green-400 text-xs font-mono border border-green-900/40 transition-all font-bold"
          >
            Validate Syntax
          </button>
        </div>

        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1.5 text-xs text-sky-400 font-mono hover:text-sky-300 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy Clipboard"}
        </button>
      </div>

      {errorMsg && !isTreeMode && (
        <div className="text-xs text-red-500 font-mono bg-[#1d0a0f] border border-red-900/30 p-2.5 rounded flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 shrink-0" />
          <span>Error parsing: {errorMsg}</span>
        </div>
      )}
    </div>
  );
}
