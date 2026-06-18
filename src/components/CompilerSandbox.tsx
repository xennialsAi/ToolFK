import React, { useState } from "react";
import { Terminal, Play, RotateCcw, AlertCircle, Sparkles } from "lucide-react";

interface CompilerResponse {
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryUsageKb: number;
}

const TEMPLATES: Record<string, string> = {
  Python: `def greet(name):
    print(f"🧬 Virtual OS Initialized.")
    print(f"Hello, {name}! Welcome to ToolFK Sandbox.")
    
for i in range(3):
    greet(f"Node-0{i+1}")
`,
  JavaScript: `// JS Sandbox Environment
const cluster = ["Server-West", "Server-East", "Gateway"];
console.log("✈️ Broadcasting heartbeat across grid...");

cluster.forEach((node, index) => {
  console.log(\`  Connected: \${node} [Status: ACTIVE] (Ping: \${9 + index * 4}ms)\`);
});
`,
  CPP: `#include <iostream>
using namespace std;

int main() {
    cout << "⚡ Compiling C++ template within sandboxed container..." << endl;
    for(int i = 0; i < 2; i++) {
        cout << "  Core stack trace ping: " << (i * 2 + 1) * 32 << " OK" << endl;
    }
    return 0;
}
`,
  Golang: `package main
import "fmt"

func main() {
    fmt.Println("🚀 Golang VM execution start")
    channels := []string{"ai-inference", "bento-grid", "router"}
    for _, ch := range channels {
        fmt.Printf(" Listening on trace: %s\\n", ch)
    }
}
`,
  Rust: `fn main() {
    println!("🦀 Rust Compiler Simulation Active");
    let health = true;
    if health {
        println!("  System memory addresses: Safe \\u{1F5D2}");
    }
}
`
};

export function CompilerSandbox({ initialLang = "Python" }: { initialLang?: string }) {
  const [lang, setLang] = useState(initialLang);
  const [code, setCode] = useState(TEMPLATES[initialLang] || TEMPLATES["Python"]);
  const [stdin, setStdin] = useState("User-Terminal");
  const [aiModel, setAiModel] = useState("Qwen3-Coder");
  const [modelProvider, setModelProvider] = useState("ModelScope");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<CompilerResponse | null>(null);

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    setCode(TEMPLATES[newLang] || "");
    setOutput(null);
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/compiler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, code, input: stdin, model: aiModel, provider: modelProvider }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setOutput({
          exitCode: data.exitCode,
          stdout: data.stdout,
          stderr: data.stderr,
          executionTimeMs: data.executionTimeMs,
          memoryUsageKb: data.memoryUsageKb
        });
      } else {
        setOutput({
          exitCode: 1,
          stdout: "",
          stderr: data.error || "Execution stalled.",
          executionTimeMs: 0,
          memoryUsageKb: 0
        });
      }
    } catch (err: any) {
      setOutput({
        exitCode: 1,
        stdout: "",
        stderr: err?.message || "Failed to contact virtual terminal service.",
        executionTimeMs: 0,
        memoryUsageKb: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="compiler-sandbox" className="space-y-4 text-zinc-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-red-500" />
          <h3 className="font-mono text-lg font-bold text-zinc-100">Sandboxed Online Code Compiler</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Provider Selector */}
          <select 
            value={modelProvider}
            onChange={(e) => setModelProvider(e.target.value)}
            className="bg-[#090e1a] border border-zinc-800 py-1 px-2 font-mono text-xs rounded text-zinc-300 focus:outline-none focus:border-red-500"
          >
            <option value="ModelScope">ModelScope</option>
            <option value="Hugging Face">Hugging Face</option>
            <option value="Local Proxy">Local Proxy</option>
          </select>

          {/* OS Model Selector for Code */}
          <select 
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="bg-[#090e1a] border border-zinc-800 py-1 px-2 font-mono text-xs rounded text-zinc-300 focus:outline-none focus:border-red-500"
          >
            <option value="Qwen3-Coder">Qwen3-Coder (Default)</option>
            <option value="GitHub Copilot">GitHub Copilot</option>
            <option value="DeepSeek">DeepSeek</option>
            <option value="Claude Code">Claude Code</option>
            <option value="Cursor">Cursor</option>
            <option value="Replit">Replit Agent</option>
          </select>

          {/* Language selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800 self-start">
            {Object.keys(TEMPLATES).map((t) => (
              <button
                key={t}
                onClick={() => handleLanguageChange(t)}
                className={`px-2 py-1 text-xs font-mono rounded transition-all ${
                  lang === t 
                    ? "bg-red-600/20 text-red-400 border border-red-500/30 font-bold" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Code Input */}
        <div className="md:col-span-7 col-span-12 space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
            <span>Editor Frame ({lang})</span>
            <button 
              onClick={() => setCode(TEMPLATES[lang] || "")}
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Reset Code Template"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
          <textarea
            id="compiler-code-input"
            rows={10}
            className="w-full rounded-md bg-[#040812] border border-zinc-800 p-3 font-mono text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-red-500 transition-colors"
            placeholder="Write core program statements..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-mono">Standard input buffer (stdin)</span>
            <input
              id="compiler-stdin-input"
              type="text"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="w-full rounded bg-[#0b0f19] border border-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-500"
              placeholder="Input parameters passed during compilation..."
            />
          </div>
        </div>

        {/* Compile Outputs */}
        <div className="md:col-span-5 col-span-12 flex flex-col justify-between space-y-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Standard Output Log (stdout)</span>
              {loading && <span className="text-red-400 font-bold animate-pulse">Running compiler...</span>}
            </div>
            
            <div className="w-full rounded bg-[#02050c] border border-zinc-900 p-3 min-h-[160px] max-h-[180px] overflow-auto text-xs font-mono space-y-1">
              {output ? (
                <>
                  {output.stdout && (
                    <div className="text-green-400 whitespace-pre-wrap">{output.stdout}</div>
                  )}
                  {output.stderr && (
                    <div className="text-red-400 whitespace-pre-wrap">{output.stderr}</div>
                  )}
                  {!output.stdout && !output.stderr && (
                    <div className="text-zinc-600 italic">No output received.</div>
                  )}
                </>
              ) : (
                <div className="text-zinc-600 italic flex flex-col justify-center items-center h-full py-10">
                  <Play className="h-6 w-6 opacity-30 mb-1" />
                  <span>Click Run Code to trace compiler logs</span>
                </div>
              )}
            </div>
          </div>

          {/* Performance analysis widgets */}
          {output && (
            <div className="bg-[#0b101c] border border-zinc-800 rounded-md p-3.5 space-y-2 text-xs font-mono">
              <span className="text-zinc-400 uppercase tracking-wider text-[10px] block">Trace Instrumentation Metrics:</span>
              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                <div className="bg-zinc-950 p-2 rounded">
                  <p className="text-[10px] text-zinc-500">EXEC TIME</p>
                  <p className="text-sm font-bold text-blue-400">{output.executionTimeMs} ms</p>
                </div>
                <div className="bg-zinc-950 p-2 rounded">
                  <p className="text-[10px] text-zinc-500">PEAK MEMORY</p>
                  <p className="text-sm font-bold text-red-500">{output.memoryUsageKb} KB</p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                <span>Exit Code: <strong className={output.exitCode === 0 ? "text-green-500" : "text-red-500"}>{output.exitCode}</strong></span>
                <span>Sandbox Status: isolated-v3</span>
              </div>
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-650 text-white py-2 px-4 rounded-md font-mono text-sm font-bold flex items-center justify-center gap-2 group shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="h-4 w-4 fill-white text-transparent group-hover:scale-110 transition-transform" />
            COMPILE & EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
}
