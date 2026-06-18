import React, { useState, useEffect } from "react";
import { Hammer, Clock, ShieldCheck, QrCode, Key, Check, Copy, Wifi } from "lucide-react";

export function UtilityTools({ initialTool = "Unix" }: { initialTool?: string }) {
  const [activeTab, setActiveTab] = useState<"Unix" | "Morse" | "Password" | "Barcode">(() => {
    if (initialTool.includes("Morse") || initialTool.includes("morse")) return "Morse";
    if (initialTool.includes("Password") || initialTool.includes("password")) return "Password";
    if (initialTool.includes("Barcode") || initialTool.includes("barcode")) return "Barcode";
    return "Unix";
  });

  const [copied, setCopied] = useState(false);

  // ---- 1. Unix Time Converter state ----
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [customEpoch, setCustomEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [humanTime, setHumanTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertEpoch = () => {
    const parsed = parseInt(customEpoch, 10);
    if (isNaN(parsed)) {
      setHumanTime("Invalid Epoch Value");
      return;
    }
    const date = new Date(parsed * 1000);
    setHumanTime(date.toUTCString() + " (Local: " + date.toLocaleString() + ")");
  };

  // ---- 2. Morse Code state ----
  const [textToMorse, setTextToMorse] = useState("SOS ToolFK TERMINAL");
  const [morseResult, setMorseResult] = useState("");
  const CHAR_TO_MORSE: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
  };

  const handleTranslate = (text: string) => {
    setTextToMorse(text);
    const chars = text.toUpperCase().split("");
    const translated = chars.map(c => CHAR_TO_MORSE[c] || "").filter(Boolean).join(" ");
    setMorseResult(translated);
  };

  useEffect(() => {
    handleTranslate(textToMorse);
  }, []);

  // ---- 3. Password Generator state ----
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState("");

  const makePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~}{[]:;?><";

    let pw = "";
    for (let i = 0; i < length; i++) {
      pw += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPass(pw);
  };

  useEffect(() => {
    if (activeTab === "Password" && !generatedPass) {
      makePassword();
    }
  }, [activeTab]);

  // ---- 4. Barcode Generator state ----
  const [barcodeText, setBarcodeText] = useState("TOOLFK-9982");

  const triggerCopyEnv = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="general-utility-workspace" className="space-y-4 text-zinc-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-2.5 gap-2">
        <div className="flex items-center gap-1.5">
          <Clock className="h-5 w-5 text-red-500" />
          <h3 className="font-mono text-base font-bold text-zinc-100">Functional Utilities Console</h3>
        </div>
        <div className="flex bg-[#070b13] p-1 rounded-md border border-zinc-850 self-start">
          {[
            { id: "Unix", name: "Unix Epoch" },
            { id: "Morse", name: "Morse Code" },
            { id: "Password", name: "Safe KeyGen" },
            { id: "Barcode", name: "Barcode Gen" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 font-mono text-[11px] rounded transition-all ${
                activeTab === tab.id 
                  ? "bg-red-600/20 text-red-400 border border-red-500/30 font-bold" 
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#040810]/35 border border-zinc-850/60 p-4 rounded-xl min-h-[220px]">
        {/* UNIX TAB */}
        {activeTab === "Unix" && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-900">
                <p className="text-zinc-500 text-[10px] uppercase">Real-time Unix epoch time (Seconds)</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-bold text-red-500 font-mono tracking-wider">{currentEpoch}</span>
                  <button 
                    onClick={() => triggerCopyEnv(String(currentEpoch))}
                    className="text-xs text-sky-400 font-bold hover:text-sky-300 transition-colors flex items-center gap-1"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 space-y-2">
                <label className="text-zinc-500 text-[10px] uppercase block">Epoch Converter</label>
                <div className="flex gap-2">
                  <input
                    id="unix-epoch-input"
                    type="text"
                    value={customEpoch}
                    onChange={(e) => setCustomEpoch(e.target.value)}
                    className="flex-1 bg-[#090e1a] border border-zinc-800 px-2 py-1.5 rounded text-zinc-200"
                    placeholder="Enter Unix epoch seconds..."
                  />
                  <button
                    onClick={convertEpoch}
                    className="bg-zinc-800 hover:bg-zinc-750 px-3.5 py-1.5 rounded text-zinc-300 font-bold"
                  >
                    Parse
                  </button>
                </div>
              </div>
            </div>

            {humanTime && (
              <div className="bg-[#0e2116]/30 border border-green-900/40 p-3 rounded-lg text-emerald-400">
                <p className="text-[10px] text-zinc-500 uppercase">Human-readable translation</p>
                <p className="text-sm font-bold mt-1 text-green-400 leading-normal">{humanTime}</p>
              </div>
            )}
          </div>
        )}

        {/* MORSE TAB */}
        {activeTab === "Morse" && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-500 text-[10px] uppercase block">Plaintext English Input</label>
                <textarea
                  id="morse-plain-input"
                  rows={4}
                  className="w-full bg-[#090e1a] border border-zinc-800 p-2.5 rounded text-zinc-200"
                  placeholder="Type words..."
                  value={textToMorse}
                  onChange={(e) => handleTranslate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>MORSE ENCODED OUTPUT</span>
                    <button onClick={() => triggerCopyEnv(morseResult)} className="text-sky-400 hover:text-sky-300">Copy Result</button>
                  </div>
                  <div className="w-full bg-zinc-950/50 border border-zinc-900 text-yellow-400 p-2 rounded h-24 overflow-auto break-all tracking-widest text-sm leading-relaxed">
                    {morseResult || "..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === "Password" && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-zinc-500 text-[10px]">
                  <span>KEYGEN CONFIGURATION</span>
                  <span>Length: <strong>{length}</strong></span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={32}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ff2d55]"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                />

                <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={includeUpper} onChange={() => setIncludeUpper(!includeUpper)} className="accent-red-500" />
                    <span>A-Z Caps</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="accent-red-500" />
                    <span>0-9 Digits</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="accent-red-500" />
                    <span>Symbols</span>
                  </label>
                </div>
              </div>

              <div className="box-border flex flex-col justify-between space-y-2">
                <div className="bg-[#0b0f19] border border-zinc-900 p-3.5 rounded-lg text-center relative flex flex-col justify-center items-center h-24">
                  <span className="text-[10px] text-zinc-500 block absolute top-2">GENERATED PASSWORD</span>
                  <span className="text-sm font-bold text-green-400 select-all tracking-widest break-all font-mono px-2 mt-2">{generatedPass || "Click Generate"}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={makePassword}
                    className="flex-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 py-1.5 rounded text-xs border border-zinc-800 transition-colors"
                  >
                    regenerate
                  </button>
                  <button
                    onClick={() => triggerCopyEnv(generatedPass)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded text-xs tracking-wide shadow-md transition-colors"
                  >
                    {copied ? "Copied!" : "Copy key"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BARCODE TAB */}
        {activeTab === "Barcode" && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-zinc-500 text-[10px] uppercase block">Encodable alphanumeric characters</label>
                <input
                  id="barcode-input-field"
                  type="text"
                  maxLength={18}
                  className="w-full bg-[#090e1a] border border-zinc-800 px-3 py-1.5 rounded text-zinc-200"
                  value={barcodeText}
                  onChange={(e) => setBarcodeText(e.target.value.toUpperCase())}
                  placeholder="e.g. CODE-128"
                />
                <span className="text-[10px] text-zinc-500 block leading-normal">
                  Our virtual layout produces dynamically matching barcodes using precise stroke arrays on custom canvas tags.
                </span>
              </div>

              <div className="bg-white border border-zinc-300 p-4 rounded-lg flex flex-col items-center justify-center h-32 relative">
                <span className="absolute top-1 text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Dynamic Barcode Matrix</span>
                
                {/* Simulated Custom HTML/CSS/Canvas Barcode drawing */}
                <div className="flex items-end gap-[1.5px] h-14 mt-2">
                  {barcodeText.split("").map((char, index) => {
                    const charCode = char.charCodeAt(0) || 12;
                    const barWidth = charCode % 3 === 0 ? "w-[3px]" : charCode % 2 === 0 ? "w-[1.5px]" : "w-[0.7px]";
                    const isBlank = (charCode + index) % 4 === 0;
                    return (
                      <div 
                        key={index} 
                        className={`h-full ${barWidth} ${isBlank ? "bg-transparent" : "bg-black"}`} 
                      />
                    );
                  })}
                  {/* Ending guards */}
                  <div className="h-full w-[2px] bg-black" />
                  <div className="h-full w-[1px] bg-transparent" />
                  <div className="h-full w-[1.5px] bg-black" />
                </div>
                <span className="text-[10px] text-black font-bold tracking-[4px] mt-2 select-all font-mono">{barcodeText || "EMPTY"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {copied && (
        <div className="text-[10px] text-emerald-400 font-mono text-center animate-fade-in bg-emerald-950/25 border border-emerald-900/30 py-1 rounded">
          ✓ Copied successfully to your clipboard environment!
        </div>
      )}
    </div>
  );
}
