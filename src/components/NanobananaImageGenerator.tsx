import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Download, 
  Image as ImageIcon, 
  Loader2, 
  Copy, 
  Check, 
  Sliders, 
  Eye, 
  Code, 
  RefreshCw, 
  Compass, 
  Cpu, 
  Maximize2,
  Bookmark,
  Zap
} from "lucide-react";

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  secondary: string;
  glow: number;
  complexity: "low" | "medium" | "quantum";
  gridLines: boolean;
  frame: "hex" | "radar" | "blueprint" | "none";
}

const PRESETS: Preset[] = [
  {
    id: "cyberpunk",
    name: "Cyber Neon Gold",
    description: "Sleek glowing tech circuits with high neon contrast",
    icon: "⚡",
    accent: "#facc15", // yellow-400
    secondary: "#06b6d4", // cyan-500
    glow: 85,
    complexity: "quantum",
    gridLines: true,
    frame: "hex"
  },
  {
    id: "vaporwave",
    name: "Synth Sunset",
    description: "1980s retro grid with hot pink & purple gradients",
    icon: "🌅",
    accent: "#ec4899", // pink-500
    secondary: "#a855f7", // purple-500
    glow: 70,
    complexity: "medium",
    gridLines: true,
    frame: "radar"
  },
  {
    id: "cosmic",
    name: "Nebula Constellation",
    description: "Constellations, deep indigo starry cosmic field",
    icon: "🌌",
    accent: "#6366f1", // indigo-500
    secondary: "#3b82f6", // blue-500
    glow: 60,
    complexity: "medium",
    gridLines: false,
    frame: "blueprint"
  },
  {
    id: "golem",
    name: "Ancient Runes",
    description: "Stone carvings with magical golden active veins",
    icon: "🗿",
    accent: "#d97706", // amber-650
    secondary: "#78716c", // stone-500
    glow: 40,
    complexity: "low",
    gridLines: false,
    frame: "none"
  },
  {
    id: "toxic",
    name: "Acid Bio-Hazard",
    description: "Glow nuclear waste green with industrial amber alert",
    icon: "☣️",
    accent: "#22c55e", // green-550
    secondary: "#f97316", // orange-500
    glow: 90,
    complexity: "quantum",
    gridLines: true,
    frame: "hex"
  }
];

export function NanobananaImageGenerator() {
  const [prompt, setPrompt] = useState("A futuristic cyber banana embedded with glowing fiberoptic lines");
  const [activePreset, setActivePreset] = useState<string>("cyberpunk");
  
  // Custom Parameters
  const [accentColor, setAccentColor] = useState("#facc15");
  const [secondaryColor, setSecondaryColor] = useState("#06b6d4");
  const [glowIntensity, setGlowIntensity] = useState(85);
  const [complexity, setComplexity] = useState<"low" | "medium" | "quantum">("quantum");
  const [gridLines, setGridLines] = useState(true);
  const [frameShape, setFrameShape] = useState<"hex" | "radar" | "blueprint" | "none">("hex");
  const [customText, setCustomText] = useState("BANANA OS v4.2");

  const [loading, setLoading] = useState(false);
  const [svgSource, setSvgSource] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [isSimulated, setIsSimulated] = useState(true);
  const [generationCount, setGenerationCount] = useState(0);

  // Apply preset parameters
  const applyPreset = (preset: Preset) => {
    setActivePreset(preset.id);
    setAccentColor(preset.accent);
    setSecondaryColor(preset.secondary);
    setGlowIntensity(preset.glow);
    setComplexity(preset.complexity);
    setGridLines(preset.gridLines);
    setFrameShape(preset.frame);
  };

  // Generate real procedural fallback SVG based on customizable state
  const getProceduralSvgText = () => {
    const isQuantum = complexity === "quantum";
    const isMedium = complexity === "medium";
    
    // Draw grid lines
    const gridBlock = gridLines ? `
    <!-- Grid System -->
    <path d="M 0,10 L 500,10 M 0,30 L 500,30 M 0,50 L 500,50 M 0,70 L 500,70 M 0,90 L 500,90" stroke="${secondaryColor}33" stroke-width="0.5" stroke-dasharray="10,15" />
    <path d="M 10,0 L 10,500 M 30,0 L 30,500 M 50,0 L 50,500 M 70,0 L 70,500 M 90,0 L 90,500" stroke="${secondaryColor}33" stroke-width="0.5" stroke-dasharray="10,15" />
    <path d="M 0,100 L 500,100 M 0,150 L 500,150 M 0,200 L 500,200 M 0,250 L 500,250 M 0,300 L 500,300 M 0,350 L 500,350 M 0,400 L 500,400 M 0,450 L 500,450" stroke="${secondaryColor}11" stroke-width="1" />
    <path d="M 100,0 L 100,500 M 150,0 L 150,500 M 200,0 L 200,500 M 250,0 L 250,500 M 300,0 L 300,500 M 350,0 L 350,500 M 400,0 L 400,500 M 450,0 L 450,500" stroke="${secondaryColor}11" stroke-width="1" />
    ` : "";

    // Overlay frames
    let frameBlock = "";
    if (frameShape === "hex") {
      frameBlock = `
      <!-- Hexagonal HUD Grid -->
      <polygon points="250,30 450,140 450,360 250,470 50,360 50,140" fill="none" stroke="${accentColor}44" stroke-width="1.5" stroke-dasharray="8,4" />
      <polygon points="250,20 465,130 465,370 250,480 35,370 35,130" fill="none" stroke="${secondaryColor}aa" stroke-width="1" />
      <circle cx="250" cy="20" r="4" fill="${secondaryColor}" />
      <circle cx="465" cy="130" r="4" fill="${accentColor}" />
      <circle cx="465" cy="370" r="4" fill="${secondaryColor}" />
      <circle cx="250" cy="480" r="4" fill="${accentColor}" />
      <circle cx="35" cy="370" r="4" fill="${secondaryColor}" />
      <circle cx="35" cy="130" r="4" fill="${accentColor}" />
      `;
    } else if (frameShape === "radar") {
      frameBlock = `
      <!-- Radar Target Scanner -->
      <circle cx="250" cy="250" r="220" fill="none" stroke="${secondaryColor}66" stroke-width="1.5" />
      <circle cx="250" cy="250" r="230" fill="none" stroke="${accentColor}44" stroke-width="1" stroke-dasharray="12,12" />
      <circle cx="250" cy="250" r="180" fill="none" stroke="${secondaryColor}22" stroke-width="1" />
      <!-- Radar crosshair lines -->
      <line x1="20" y1="250" x2="100" y2="250" stroke="${accentColor}88" stroke-width="1" />
      <line x1="400" y1="250" x2="480" y2="250" stroke="${accentColor}88" stroke-width="1" />
      <line x1="250" y1="20" x2="250" y2="100" stroke="${accentColor}88" stroke-width="1" />
      <line x1="250" y1="400" x2="250" y2="480" stroke="${accentColor}88" stroke-width="1" />
      `;
    } else if (frameShape === "blueprint") {
      frameBlock = `
      <!-- Technical Blueprint Frame -->
      <rect x="25" y="25" width="450" height="450" fill="none" stroke="${secondaryColor}99" stroke-width="1" />
      <rect x="20" y="20" width="460" height="460" fill="none" stroke="${accentColor}33" stroke-width="0.5" />
      <!-- Blueprint alignment marks -->
      <path d="M 15,25 L 35,25 M 25,15 L 25,35" stroke="${accentColor}" stroke-width="1" />
      <path d="M 465,25 L 485,25 M 475,15 L 475,35" stroke="${accentColor}" stroke-width="1" />
      <path d="M 15,475 L 35,475 M 25,465 L 25,485" stroke="${accentColor}" stroke-width="1" />
      <path d="M 465,475 L 485,475 M 475,465 L 475,485" stroke="${accentColor}" stroke-width="1" />
      `;
    }

    // Complexity Circuits overlay
    let techCircuits = "";
    if (isQuantum) {
      techCircuits = `
      <!-- Quantum Node Networks -->
      <g stroke="${accentColor}" stroke-width="1" fill="none" opacity="0.8">
        <circle cx="240" cy="180" r="3" fill="${accentColor}" />
        <line x1="240" y1="180" x2="200" y2="190" />
        <circle cx="200" cy="190" r="2" />
        
        <circle cx="290" cy="270" r="3" fill="${secondaryColor}" />
        <line x1="290" y1="270" x2="330" y2="250" />
        <circle cx="330" cy="250" r="2" />
        
        <circle cx="180" cy="310" r="3" fill="${accentColor}" />
        <line x1="180" y1="310" x2="150" y2="280" />
        <line x1="150" y1="280" x2="160" y2="240" />
        <circle cx="160" cy="240" r="2" />

        <circle cx="320" cy="340" r="3.5" fill="${secondaryColor}" />
        <line x1="320" y1="340" x2="360" y2="360" />
        <circle cx="360" cy="360" r="2" />
      </g>
      <!-- Binary Floating Nodes -->
      <text x="80" y="440" fill="${accentColor}33" font-family="monospace" font-size="10">01100010 01100001</text>
      <text x="320" y="80" fill="${secondaryColor}33" font-family="monospace" font-size="10">NANO_SYS_ACTIVE</text>
      `;
    } else if (isMedium) {
      techCircuits = `
      <!-- Standard Hybrid Circuits -->
      <g stroke="${secondaryColor}" stroke-width="0.8" fill="none" opacity="0.6">
        <circle cx="220" cy="200" r="2.5" />
        <line x1="220" y1="200" x2="190" y2="220" />
        <circle cx="300" cy="290" r="2.5" />
        <line x1="300" y1="290" x2="320" y2="320" stroke="${accentColor}" />
      </g>
      `;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Dynamic Color Gradients -->
    <linearGradient id="banana-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="60%" stop-color="${accentColor}dd" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
    <linearGradient id="glow-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#050814" />
      <stop offset="100%" stop-color="#11182c" />
    </linearGradient>
    
    <!-- Dynamic Soft Glow Filter based on intensity -->
    <filter id="vector-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${glowIntensity / 8}" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Ground Cyber Sandbox Ambient Canvas -->
  <rect width="100%" height="100%" fill="url(#glow-grad)" />
  ${gridBlock}
  ${frameBlock}

  <!-- Main Nanobanana Graphic with glow engine applied -->
  <g filter="url(#vector-glow)" class="tech-banana-root">
    
    <!-- Stem End Connector -->
    <path d="M 120,120 C 130,105 155,95 165,100 C 175,105 165,130 150,135 Z" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="2" />
    <circle cx="145" cy="115" r="3" fill="#ffffff" />

    <!-- Highly stylized technical metallic Banana Curve -->
    <path d="M 143,130 
             C 210,135 340,160 380,260 
             C 410,340 370,410 320,430 
             C 285,445 282,410 310,395
             C 355,370 375,325 350,260
             C 310,175 190,165 140,150
             Z" 
          fill="url(#banana-grad)" 
          stroke="${accentColor}" 
          stroke-width="3.5" 
          stroke-linejoin="round" />

    <!-- Quantum Circuit Segments on Banana Shell -->
    <path d="M 190,161 C 240,175 290,205 320,245" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="15,6,3,6" />
    <path d="M 230,177 C 280,210 320,260 340,310" fill="none" stroke="${secondaryColor}" stroke-width="2" stroke-dasharray="2,2" />
    <path d="M 285,225 C 335,270 357,330 338,380" fill="none" stroke="#22d3ee" stroke-width="1.5" />

    <!-- Tech Core Microchips embedded on Banana center -->
    <rect x="290" y="275" width="22" height="22" rx="4" fill="#090d16" stroke="${accentColor}" stroke-width="1.8" />
    <line x1="290" y1="286" x2="280" y2="286" stroke="${accentColor}" stroke-width="1.5" />
    <line x1="312" y1="286" x2="322" y2="286" stroke="${accentColor}" stroke-width="1.5" />
    <line x1="301" y1="275" x2="301" y2="265" stroke="${accentColor}" stroke-width="1.5" />
    <line x1="301" y1="297" x2="301" y2="307" stroke="${accentColor}" stroke-width="1.5" />

    <!-- Banana Tip -->
    <path d="M 320,430 C 315,440 300,455 292,450 C 285,445 295,431 306,427 Z" fill="#090d16" stroke="${secondaryColor}" stroke-width="1.5" />
  </g>

  ${techCircuits}

  <!-- HUD Text Overlay Info -->
  <g font-family="monospace" font-size="10" fill="${secondaryColor}" opacity="0.85">
    <text x="45" y="445" font-weight="bold">${customText}</text>
    <text x="45" y="460" font-size="8">SEED: NANO-${prompt.length * 3 + 450}</text>
    <text x="350" y="445" font-size="8">GLOW: ${glowIntensity}%</text>
    <text x="350" y="460" font-size="8">GRID: ${gridLines ? "SECURE" : "CLEARED"}</text>
  </g>

  <!-- HUD Decorative Accents -->
  <path d="M 40,40 L 80,40 M 40,40 L 40,80" stroke="${accentColor}" stroke-width="2" fill="none" />
  <path d="M 460,40 L 420,40 M 460,40 L 460,80" stroke="${accentColor}" stroke-width="2" fill="none" />
  <path d="M 40,460 L 80,460 M 40,460 L 40,420" stroke="${accentColor}" stroke-width="2" fill="none" />
  <path d="M 460,460 L 420,460 M 460,460 L 460,420" stroke="${accentColor}" stroke-width="2" fill="none" />
</svg>
`;
  };

  // Run procedural local render by default
  useEffect(() => {
    setSvgSource(getProceduralSvgText());
  }, [accentColor, secondaryColor, glowIntensity, complexity, gridLines, frameShape, customText, prompt]);

  // Request high fidelity AI synthesis
  const handleAiSynthesis = async () => {
    setLoading(true);
    try {
      const finalPrompt = `Create a beautiful raw, highly detailed SVG vector clipart file for a "Nanobanana".
Instructions:
- Prompt context: ${prompt}
- Aesthetic Style: ${activePreset} with primary accent color (${accentColor}) and secondary ambient glow color (${secondaryColor})
- Glow level: ${glowIntensity}/100
- Complexity Level: ${complexity}
- Frame Style: ${frameShape} HUD frame
- HUD custom banner text to print inside the SVG: "${customText}"
Return only valid, clean, pure, raw SVG starting with <svg and ending with </svg> containing clean viewBox and gorgeous modern cyberpunk-oriented gradients in high contrast. Do not wrap in markdown codeblocks.`;

      const response = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          stylePreset: activePreset,
          accentColor,
          secondaryColor,
          glowIntensity,
          complexity,
          gridLines,
          frameShape,
          customText
        }),
      });
      
      const data = await response.json();
      if (data.status === "success" && data.svg) {
        setSvgSource(data.svg);
        setIsSimulated(false);
        setGenerationCount(prev => prev + 1);
        setActiveTab("preview");
      } else {
        // Handle simulation/fallback gracefully
        console.warn("AI route fallback triggered. Generating rich customized procedural SVG vector client-side.");
        setSvgSource(getProceduralSvgText());
        setIsSimulated(true);
      }
    } catch (e) {
      console.error("AI Clipart synthesis error, using custom procedural engine:", e);
      setSvgSource(getProceduralSvgText());
      setIsSimulated(true);
    } finally {
      // Simulate natural synthesis delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleCopySource = () => {
    navigator.clipboard.writeText(svgSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgSource], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nanobanana-${activePreset}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 text-zinc-300">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-900 pb-4 gap-3">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
                 <Sparkles className="h-4.5 w-4.5 text-yellow-400 rotate-12" />
               </div>
               <h3 className="font-sans text-lg font-bold text-white tracking-tight">
                 Nanobanana Clipart Creator V4
               </h3>
            </div>
            <p className="text-xs text-zinc-500">
              Modular high-fidelity cybernetic banana generator with responsive SVG vector physics.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-md text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-1.5 shrink-0 select-none">
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              NANO ENGINE STABLE
            </span>
         </div>
      </div>

      {/* Main Core Editor Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Custom Parameters Suite (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
           
           {/* Section 1: Presets selection */}
           <div className="bg-[#04060a]/95 border border-zinc-900 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5 text-yellow-500" />
                  Select Style Preset
                </span>
                <span className="text-[10px] text-zinc-650 font-mono">5 cores loaded</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[180px] overflow-auto pr-1">
                 {PRESETS.map((p) => {
                   const isSelected = activePreset === p.id;
                   return (
                     <button
                       key={p.id}
                       onClick={() => applyPreset(p)}
                       className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                         isSelected 
                           ? "bg-yellow-500/10 border-yellow-500 text-white font-medium" 
                           : "bg-zinc-950/50 border-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                       }`}
                     >
                       <span className="text-xl shrink-0">{p.icon}</span>
                       <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">{p.name}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping"></span>}
                          </div>
                          <p className="text-[10px] text-zinc-550 truncate mt-0.5">{p.description}</p>
                       </div>
                     </button>
                   );
                 })}
              </div>
           </div>

           {/* Section 2: Vector Customization Parameters */}
           <div className="bg-[#04060a]/95 border border-zinc-900 rounded-2xl p-4 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                <Sliders className="h-3.5 w-3.5 text-yellow-500" />
                Custom Parameters Core
              </span>

              {/* Color selectors */}
              <div className="grid grid-cols-2 gap-3.5">
                 <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-zinc-500 font-bold">ACCENT COLOR</label>
                    <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                      <input 
                        type="color" 
                        value={accentColor} 
                        onChange={(e) => {
                          setAccentColor(e.target.value);
                          setActivePreset("custom");
                        }} 
                        className="w-8 h-7 bg-transparent border-0 cursor-pointer rounded"
                      />
                      <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase">{accentColor}</span>
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-zinc-500 font-bold">AMBIENT GLOW</label>
                    <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-900">
                      <input 
                        type="color" 
                        value={secondaryColor} 
                        onChange={(e) => {
                          setSecondaryColor(e.target.value);
                          setActivePreset("custom");
                        }} 
                        className="w-8 h-7 bg-transparent border-0 cursor-pointer rounded"
                      />
                      <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase">{secondaryColor}</span>
                    </div>
                 </div>
              </div>

              {/* Glow input slide */}
              <div className="space-y-1.5">
                 <div className="flex justify-between text-[10px] font-mono font-bold">
                    <span className="text-zinc-500">NANO-GLOW INTENSITY</span>
                    <span className="text-yellow-400">{glowIntensity}/100</span>
                 </div>
                 <input 
                   type="range"
                   min="10"
                   max="100"
                   value={glowIntensity}
                   onChange={(e) => setGlowIntensity(Number(e.target.value))}
                   className="w-full accent-yellow-400 opacity-80 hover:opacity-100 transition-opacity"
                 />
              </div>

              {/* Options selection toggles */}
              <div className="grid grid-cols-2 gap-3.5">
                 <div className="space-y-1.5">
                    <span className="block text-[10px] font-mono text-zinc-500 font-bold">TECH OVERLOAD</span>
                    <select
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value as any)}
                      className="w-full bg-zinc-950 text-zinc-300 border border-zinc-900 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-yellow-500/50"
                    >
                      <option value="low">Low (Rustic)</option>
                      <option value="medium">Medium (Hybrid)</option>
                      <option value="quantum">Quantum (Loaded)</option>
                    </select>
                 </div>

                 <div className="space-y-1.5">
                    <span className="block text-[10px] font-mono text-zinc-500 font-bold">HUD FRAME</span>
                    <select
                      value={frameShape}
                      onChange={(e) => setFrameShape(e.target.value as any)}
                      className="w-full bg-zinc-950 text-zinc-300 border border-zinc-900 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-yellow-500/50"
                    >
                      <option value="hex">Hexagon HUD</option>
                      <option value="radar">Circular Radar</option>
                      <option value="blueprint">Tech Blueprint</option>
                      <option value="none">Frameless</option>
                    </select>
                 </div>
              </div>

              {/* Inputs details */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="block text-[10px] font-mono text-zinc-500 font-bold">CUSTOM HUD OVERLAY LABEL</span>
                    <span className="text-[9px] text-[#ff2d55]/70 font-mono">MAX 18 CHARS</span>
                 </div>
                 <input
                   type="text"
                   maxLength={18}
                   className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-yellow-500/50 font-mono"
                   placeholder="Enter custom banner label..."
                   value={customText}
                   onChange={(e) => setCustomText(e.target.value)}
                 />
              </div>

              {/* Circuit layout checkbox as stylish switch */}
              <label className="flex items-center justify-between p-2.5 bg-zinc-950/60 border border-zinc-900/50 rounded-xl cursor-pointer hover:bg-zinc-900/30 transition-all select-none">
                <span className="text-xs font-mono text-zinc-400">RENDER BACKGROUND CIRCUIT MATRIX</span>
                <input 
                  type="checkbox" 
                  checked={gridLines} 
                  onChange={(e) => setGridLines(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 text-yellow-500 bg-zinc-950 focus:ring-0 cursor-pointer"
                />
              </label>
           </div>

           {/* AI text prompt trigger */}
           <div className="bg-gradient-to-br from-[#0c101d] to-[#04060a] border border-zinc-850 rounded-2xl p-4 space-y-3 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl"></div>
              
              <div className="space-y-1">
                 <label className="block text-[10px] font-mono text-zinc-500 font-bold">AI PROMPT CONTEXT (OPTIONAL)</label>
                 <textarea
                   className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3 font-mono text-xs text-zinc-300 placeholder-zinc-750 focus:border-yellow-500/50 focus:outline-none resize-none"
                   rows={2}
                   placeholder="Prompt extra context details (e.g. glowing wireframes, cyber vines...)"
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                 />
              </div>
              
              <button 
                onClick={handleAiSynthesis}
                disabled={loading || !prompt.trim()}
                className={`w-full bg-gradient-to-r from-yellow-500/15 via-yellow-500/25 to-yellow-500/15 hover:from-yellow-500/20 hover:to-yellow-500/20 text-yellow-400 border border-yellow-500/40 transition-all font-mono text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                    <span className="animate-pulse">SYNTHESIZING VECTOR CORE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-bounce" />
                    <span>SYNTHESIZE GRADIENT SVG</span>
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Right column: Interactive Real-time Previewer Workspace (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
           
           {/* Navigation tabs for preview / source code */}
           <div className="flex items-center justify-between bg-[#04060a]/90 border border-zinc-900 rounded-2xl p-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-colors ${
                    activeTab === "preview" 
                      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  Live Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-colors ${
                    activeTab === "code" 
                      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Code className="h-4 w-4" />
                  SVG Code Source
                </button>
              </div>

              {/* Status display element */}
              <div className="hidden sm:flex items-center gap-2 pr-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                  {isSimulated ? "Procedural State" : `AI Generated Core (v${generationCount})`}
                </span>
              </div>
           </div>

           {/* Preview Canvas block */}
           <div className="bg-[#03050a]/90 border border-zinc-900 rounded-3xl p-5 flex flex-col justify-between items-center relative overflow-hidden min-h-[440px] shadow-2xl">
              
              {/* Backglow backdrop */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.06] transition-all duration-700"
                style={{ 
                  background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)` 
                }}
              />

              {loading ? (
                <div id="loading-canvas" className="absolute inset-0 flex flex-col items-center justify-center bg-[#03050a]/95 z-20 space-y-4">
                  <div className="w-14 h-14 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin flex items-center justify-center relative">
                    <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                     <span className="text-zinc-200 font-mono text-xs block font-bold tracking-wider animate-pulse uppercase">
                        Compiling Vector Matrix
                     </span>
                     <span className="text-[10px] text-zinc-600 font-mono block">
                        Converting prompts and style tokens to beautiful crisp curves
                     </span>
                  </div>
                </div>
              ) : null}

              {activeTab === "preview" ? (
                <div id="svg-renderer-wrapper" className="w-full flex-1 flex items-center justify-center relative z-10 max-w-[390px] min-h-[350px]">
                   {svgSource ? (
                      <div 
                        className="w-full h-full drop-shadow-[0_0_35px_rgba(240,185,11,0.08)] select-none hover:scale-[1.01] transition-transform duration-300"
                        dangerouslySetInnerHTML={{ __html: svgSource }}
                      />
                   ) : (
                      <div className="text-center text-zinc-700 space-y-3 font-mono">
                         <ImageIcon className="h-10 w-10 mx-auto opacity-30" />
                         <span className="text-xs">No vector data generated...</span>
                      </div>
                   )}
                </div>
              ) : (
                <div className="w-full flex-1 flex flex-col relative z-10">
                   <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-3">
                      <span className="text-[10px] font-mono text-zinc-500">FORMATTED SCALABLE VECTOR ML (XML Source)</span>
                      <button 
                        onClick={handleCopySource}
                        className="text-[10px] font-mono text-yellow-400 hover:text-yellow-300 flex items-center gap-1 bg-yellow-500/5 px-2 py-1 rounded border border-yellow-500/10 cursor-pointer"
                      >
                         {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                         {copied ? "COPIED" : "COPY CODE"}
                      </button>
                   </div>
                   <textarea
                     readOnly
                     value={svgSource}
                     className="w-full flex-1 bg-zinc-950 border border-zinc-900 rounded-xl p-4 font-mono text-[9px] text-zinc-400 focus:outline-none resize-none leading-relaxed overflow-auto max-h-[310px]"
                   />
                </div>
              )}

              {/* Action output operations */}
              <div className="w-full border-t border-zinc-900/60 pt-4 flex flex-wrap gap-2 justify-between items-center relative z-10 mt-2">
                 <div className="flex gap-2">
                    <button
                      onClick={handleDownloadSvg}
                      disabled={!svgSource}
                      className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold font-mono text-xs flex items-center gap-2 hover:bg-yellow-400 transition-colors cursor-pointer text-nowrap"
                    >
                       <Download className="h-4 w-4" /> Download SVG
                    </button>
                    <button
                      onClick={handleCopySource}
                      disabled={!svgSource}
                      className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                       {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                       {copied ? "Copied Source" : "Copy Code"}
                    </button>
                 </div>

                 <button
                   onClick={() => {
                     setAccentColor("#" + Math.floor(Math.random()*16777215).toString(16));
                     setSecondaryColor("#" + Math.floor(Math.random()*16777215).toString(16));
                     setGlowIntensity(Math.floor(Math.random() * 50) + 50);
                     setActivePreset("custom");
                   }}
                   className="bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-850 px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                   title="Randomize custom colors"
                 >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Randomize Colors
                 </button>
              </div>

           </div>

           {/* Core information board */}
           <div className="bg-[#04060a]/40 border border-zinc-900/80 p-3 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-zinc-500">
              <div className="bg-zinc-950/20 p-2 rounded">
                 <strong>RESOLUTION INVARIANT</strong>
                 <p className="text-[9px] text-zinc-650 mt-0.5">Scale infinitely inside high-DPI retina display container.</p>
              </div>
              <div className="bg-zinc-950/20 p-2 rounded">
                 <strong>SANDBOX READY</strong>
                 <p className="text-[9px] text-zinc-650 mt-0.5">Perfect for layout assets, web illustration overlays & design suites.</p>
              </div>
              <div className="bg-zinc-950/20 p-2 rounded">
                 <strong>ACCESSIBLE RGB MODEL</strong>
                 <p className="text-[9px] text-zinc-650 mt-0.5">Custom dynamic gradients render directly using GPU engine hardware.</p>
              </div>
           </div>

        </div>

      </div>

    </div>
  );
}
