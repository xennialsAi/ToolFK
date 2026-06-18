import React, { useState } from "react";
import { Sparkles, Edit, Feather, FileText, Image, Smile, Copy, Check, Info } from "lucide-react";

type AiToolType = "Writer" | "Article" | "Poem" | "Acrostic" | "Clipart";

export function AiWorkspace({ initialTool = "Writer" }: { initialTool?: string }) {
  const [activeTool, setActiveTool] = useState<AiToolType>(() => {
    if (initialTool.includes("Article")) return "Article";
    if (initialTool.includes("Poem")) return "Poem";
    if (initialTool.includes("Acrostic")) return "Acrostic";
    if (initialTool.includes("Clipart") || initialTool.includes("Emoji") || initialTool.includes("Image")) return "Clipart";
    return "Writer";
  });

  const [aiModel, setAiModel] = useState("Gemma");
  const [modelProvider, setModelProvider] = useState("ModelScope");
  const [prompt, setPrompt] = useState("A cyberpunk workspace monitoring the status of 300+ connected utility modules.");
  const [tone, setTone] = useState("cyberpunk");
  const [length, setLength] = useState("medium");
  const [acrosticWord, setAcrosticWord] = useState("BENTO");
  const [svgOutput, setSvgOutput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Synthesize AI trigger
  const handleGenerate = async () => {
    setLoading(false);
    setTextOutput("");
    setSvgOutput("");
    setLoading(true);

    try {
      if (activeTool === "Clipart") {
        const response = await fetch("/api/ai/clipper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, model: aiModel, provider: modelProvider }),
        });
        const data = await response.json();
        if (data.status === "success") {
          setSvgOutput(data.svg);
        } else {
          setTextOutput(`Error: ${data.error || "Clipart generation stalled"}`);
        }
      } else {
        let finalPrompt = prompt;
        let systemInstruction = "You are a witty, helpful copywriter assisting users on ToolFK Playground.";

        if (activeTool === "Writer") {
          finalPrompt = `Write a creative text based on this request: "${prompt}".
Tone of voice: ${tone}. Length level: ${length}. Ensure it has professional value.`;
          systemInstruction = `You are an AI model simulating the ${aiModel} open source personality. Write content strictly complying with the tone: ${tone}.`;
        } else if (activeTool === "Article") {
          finalPrompt = `Write a full structured article with subheadings about: "${prompt}". Outline details dynamically. Try to keep it informative and clean in markdown format.`;
          systemInstruction = `You are an AI model simulating the ${aiModel} personality. You are an expert technical editor. Write beautiful Markdown headers/lists.`;
        } else if (activeTool === "Poem") {
          finalPrompt = `Compose a short, highly artistic poem about "${prompt}". Make it evocative and well-structured with rhythmic patterns.`;
          systemInstruction = `You are an AI model simulating the ${aiModel} personality. You are an elegant romantic/cyberpunk poet laureate.`;
        } else if (activeTool === "Acrostic") {
          finalPrompt = `Write an acrostic poem for the word "${acrosticWord.toUpperCase()}". The theme or context of this poem should revolve around: "${prompt}".
Each line must begin with the corresponding letter of the word "${acrosticWord.toUpperCase()}".`;
          systemInstruction = `You are an AI model simulating the ${aiModel} personality. You are an acrostic poem master. Ensure each line begins strictly with the correct capital letter.`;
        }

        const response = await fetch("/api/ai/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: finalPrompt, systemInstruction, model: aiModel, provider: modelProvider }),
        });
        const data = await response.json();
        if (data.status === "success") {
          setTextOutput(data.text);
        } else {
          setTextOutput(`Error: ${data.error || "Generation stalled"}`);
        }
      }
    } catch (e: any) {
      setTextOutput(`Failed: ${e?.message || "Internal transmission error."}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-workspace" className="space-y-4 text-zinc-300">
      {/* Category selector row */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-5 w-5 text-[#ff2d55]" />
          <h3 className="font-mono text-base font-bold text-zinc-100">AI Content & SVG Clipart Generator</h3>
        </div>
        <div className="flex gap-1 overflow-x-auto bg-[#070b13] p-1 rounded-md border border-zinc-850">
          {(["Writer", "Article", "Poem", "Acrostic", "Clipart"] as AiToolType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTool(t);
                setOutputDefault(t);
              }}
              className={`px-3 py-1 font-mono text-[11px] rounded transition-all ${
                activeTool === t 
                  ? "bg-[#ff2d55] text-white font-bold" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "Clipart" ? "SVG Art / Clipart" : `AI ${t}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Input Parameters panel */}
        <div className="md:col-span-5 col-span-12 space-y-4 bg-zinc-950/20 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-3">
            {activeTool === "Acrostic" && (
              <div className="space-y-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">Word to spell</label>
                <input
                  id="acrostic-word-input"
                  type="text"
                  maxLength={10}
                  className="w-full rounded bg-[#090e1a] border border-zinc-800 px-3 py-1.5 font-mono text-sm text-zinc-200 focus:outline-none focus:border-red-500"
                  value={acrosticWord}
                  onChange={(e) => setAcrosticWord(e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase())}
                  placeholder="e.g. TERMINAL"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                {activeTool === "Clipart" ? "SVG Clipart details to render" : "Context or Theme Prompt"}
              </label>
              <textarea
                id="ai-prompt-input"
                rows={4}
                className="w-full rounded bg-[#090e1a] border border-zinc-800 p-2.5 font-mono text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-red-500 transition-colors"
                placeholder={
                  activeTool === "Clipart" 
                    ? "Specify neon, retro, cyberpunk shapes... e.g., 'vintage synth controller module'"
                    : "Describe what the AI model should write..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {activeTool === "Writer" && (
              <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-1">Tone voice</label>
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)} 
                    className="w-full bg-[#090e1a] border border-zinc-800 py-1 px-1.5 rounded text-zinc-300 focus:outline-none"
                  >
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="professional">Professional</option>
                    <option value="direct">Direct</option>
                    <option value="humorous">Humorous</option>
                    <option value="mystical">Mystical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-1">Length</label>
                  <select 
                    value={length} 
                    onChange={(e) => setLength(e.target.value)} 
                    className="w-full bg-[#090e1a] border border-zinc-800 py-1 px-1.5 rounded text-zinc-300 focus:outline-none"
                  >
                    <option value="short">Short block</option>
                    <option value="medium">Medium standard</option>
                    <option value="long">Deep dive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-1">Provider</label>
                  <select 
                    value={modelProvider} 
                    onChange={(e) => setModelProvider(e.target.value)} 
                    className="w-full bg-[#090e1a] border border-zinc-800 py-1 px-1.5 rounded text-zinc-300 focus:outline-none"
                  >
                    <option value="Ollama">Ollama (Local)</option>
                    <option value="Hugging Face">HuggingFace Inference</option>
                    <option value="ModelScope">ModelScope</option>
                    <option value="Local Proxy">Local Proxy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-1">OS Model</label>
                  <select 
                    value={aiModel} 
                    onChange={(e) => setAiModel(e.target.value)} 
                    className="w-full bg-[#090e1a] border border-zinc-800 py-1 px-1.5 rounded text-zinc-300 focus:outline-none"
                  >
                    <option value="Gemma">Gemma (Default)</option>
                    <option value="Llama">Llama 3</option>
                    <option value="Qwen Base44">Qwen Base44</option>
                    <option value="DeepSeek">DeepSeek</option>
                    <option value="Devstral">Devstral</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-650 hover:shadow-red-500/10 hover:shadow-lg text-white font-mono text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            {loading ? "SYNTHESIZING MODEL..." : `GENERATE ${activeTool.toUpperCase()}`}
          </button>
        </div>

        {/* Results output pane: renders text or raw SVG container */}
        <div className="md:col-span-7 col-span-12 bg-zinc-950/45 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between min-h-[290px]">
          <div className="space-y-2 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-900 pb-1.5">
              <span>Synthesized Response Panel</span>
              {(textOutput || svgOutput) && (
                <button
                  onClick={() => triggerCopy(svgOutput || textOutput)}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy Output"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto max-h-[200px] text-xs font-mono py-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-2 py-10">
                  <div className="w-8 h-8 border-4 border-[#ff2d55] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-zinc-500">Querying {aiModel} server...</span>
                </div>
              ) : activeTool === "Clipart" ? (
                svgOutput ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full items-center">
                    <div className="bg-[#040811] border border-zinc-900 rounded-lg p-4 flex items-center justify-center h-36 relative group">
                      <div className="absolute top-2 left-2 text-[9px] uppercase tracking-wider text-red-500 font-bold bg-zinc-900/40 px-1 border border-red-950">Visual SVG Preview</div>
                      <div 
                        className="w-full h-full max-h-[120px] max-w-[125px] flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: svgOutput }}
                      />
                    </div>
                    <div className="space-y-1.5 h-full flex flex-col justify-center">
                      <span className="text-[10px] uppercase text-zinc-500 block">Raw SVG Code Block</span>
                      <textarea
                        readOnly
                        rows={6}
                        className="w-full bg-[#02050c] text-[10px] text-zinc-400 p-2 rounded border border-zinc-900 font-mono focus:outline-none"
                        value={svgOutput}
                      />
                    </div>
                  </div>
                ) : textOutput ? (
                  <div className="text-red-400 p-4 font-mono text-xs bg-red-950/20 border border-red-900/50 rounded-lg">
                    {textOutput}
                  </div>
                ) : (
                  <div className="text-zinc-600 italic py-10 text-center">
                    Rendered vectors will construct inline here.
                  </div>
                )
              ) : textOutput ? (
                <div className="whitespace-pre-wrap leading-relaxed text-zinc-300">
                  {textOutput}
                </div>
              ) : (
                <div className="text-zinc-600 italic py-10 text-center">
                  Your creative textual response will generate safely inside the sandbox container.
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono border-t border-zinc-900 pt-2 flex items-center gap-1">
            <Info className="h-3 w-3 text-blue-500 shrink-0" />
            <span>Integrates with {aiModel} for high performance vector generation & writing algorithms.</span>
          </div>
        </div>
      </div>
    </div>
  );

  function setOutputDefault(tool: AiToolType) {
    setTextOutput("");
    setSvgOutput("");
    if (tool === "Writer") {
      setPrompt("A professional project statement introducing a high-performance 300+ utility catalog suite.");
    } else if (tool === "Article") {
      setPrompt("How Bento Layouts revolutionized application design in modern developer suites.");
    } else if (tool === "Poem") {
      setPrompt("Cores of a computational grid writing poems programmatically at midnight.");
    } else if (tool === "Acrostic") {
      setPrompt("Cybernetic data networks running in cloud isolation.");
      setAcrosticWord("BENTO");
    } else if (tool === "Clipart") {
      setPrompt("neon quantum core chip logo");
    }
  }
}
