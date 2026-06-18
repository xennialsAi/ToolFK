import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, ArrowRight, CornerDownLeft, Play, Info } from "lucide-react";

export function SimulatedToolSandbox({ toolName, category, subcategory }: { toolName: string; category: string; subcategory: string }) {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset contents on tool change
    setInputValue(getDefaultInput(toolName));
    setOutputValue("");
  }, [toolName]);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const prompt = `You are simulated server-side engine worker representing the utility tool named "${toolName}" (Category: "${category}" -> "${subcategory}").
User has submitted an input parameter inside the tool workspace:
INPUT: 
"${inputValue}"

Please simulate executing what this tool does.
If it's HTACCESS2Nginx: convert the rules to nginx servers blocks.
If it's PDF to Excel: simulate parsing PDF rows to markdown grid formats.
If it's domain checker: simulate outputting standard WHOIS, TXT, A, MX record lines.
If it's morse or translation: perform the respective task.

Return ONLY the output results representing the terminal execution of this utility. Keep it neat, clean, useful, and fully styled as standard raw output without additional instructions or verbose introductions.`;

      const response = await fetch("/api/ai/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction: "You are the ToolFK background simulated worker. You output clear, technical outcomes representing a console utility tool." }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setOutputValue(data.text);
      } else {
        setOutputValue(`Simulation Error: ${data.error}`);
      }
    } catch (e: any) {
      setOutputValue(`Connection Error: ${e?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="simulated-sandbox-engine" className="space-y-4 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-red-500" />
          <h3 className="font-mono text-base font-bold text-zinc-100">
            Simulated Sandbox: <span className="text-red-500">{toolName}</span>
          </h3>
        </div>
        <span className="rounded bg-zinc-950 font-mono text-[9px] text-zinc-500 px-2 py-0.5 border border-zinc-900 uppercase">AI-Authored VM</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Block */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500">Inputs & Parameters</label>
          <textarea
            id="simulation-tool-input"
            rows={7}
            className="w-full rounded bg-[#090e1a] border border-zinc-800 p-3 font-mono text-xs text-zinc-200 placeholder-zinc-750 focus:outline-none focus:border-red-500"
            placeholder="Provide values to compute..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={handleSimulate}
            disabled={loading || !inputValue.trim()}
            className="w-full bg-[#ff2d55]/10 hover:bg-[#ff2d55]/20 border border-red-500/20 text-red-400 font-mono text-xs font-bold py-2 rounded transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="h-3 w-3 fill-red-400 text-transparent" />
            {loading ? "COMPUTING SYSTEM LOGS..." : "RUN VIRTUAL SIMULATOR"}
          </button>
        </div>

        {/* Output Block */}
        <div className="space-y-2 flex flex-col justify-between">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-505">terminal execution output</label>
            <div className="w-full rounded bg-[#02050b] border border-zinc-900 p-3.5 font-mono text-xs text-zinc-400 min-h-[178px] max-h-[180px] overflow-auto whitespace-pre-wrap leading-relaxed">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-10 space-y-2">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] text-zinc-600">Simulating operations...</span>
                </div>
              ) : outputValue ? (
                outputValue
              ) : (
                <div className="text-zinc-600 italic py-10 text-center">
                  Output variables will parse on execution.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f1524]/40 border border-zinc-850/60 rounded-lg p-3 text-[10px] font-mono text-zinc-500 flex items-start gap-1.5 leading-snug">
        <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <span>This is part of the <strong>ToolFK Sandbox Suite</strong>. Since this tool runs in standard sandbox virtualization, we leverage server-side generative logic to execute authentic transformations on custom parameters seamlessly.</span>
        </div>
      </div>
    </div>
  );

  function getDefaultInput(name: string): string {
    if (name.includes("htaccess")) {
      return `RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteRule ^([^/]+)/$ index.php?username=$1 [QSA,L]`;
    }
    if (name.includes("PDF to Word") || name.includes("PDF to Excel")) {
      return `[PDF File upload simulation]\nPage 1: Annual financial statement summary sheet\nGross Revenue: $48M USD \nOperation margins: 23% \nLocation: West-Region Node`;
    }
    if (name.includes("DNS") || name.includes("Port") || name.includes("IP Address")) {
      return `toolfk.org`;
    }
    if (name.includes("Baby Name")) {
      return `Theme: Ocean, Prosperity, Intelligence\nGender: Female \nYear of Birth: Fire Horse`;
    }
    if (name.includes("Obfuscation") || name.includes("Encrypt")) {
      return `function calculatePremium(node) {\n  let code = "ASTR-09-XYZ";\n  return node.active ? 100 : 0;\n}`;
    }
    return `Interactive trace for tool name: ${name}\nEnter values here...`;
  }
}
