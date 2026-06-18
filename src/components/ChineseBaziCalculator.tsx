import React, { useState } from "react";
import { Sparkles, Calendar, Heart, Flame, ShieldAlert, Sparkle, RefreshCw } from "lucide-react";

interface BaziResult {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
  zodiac: string;
  luckyElement: string;
  yinYang: string;
  elements: {
    Fire: number;
    Wood: number;
    Earth: number;
    Water: number;
    Metal: number;
  };
}

const STEMS = ["Jia (Yang Wood)", "Yi (Yin Wood)", "Bing (Yang Fire)", "Ding (Yin Fire)", "Wu (Yang Earth)", "Ji (Yin Earth)", "Geng (Yang Metal)", "Xin (Yin Metal)", "Ren (Yang Water)", "Gui (Yin Water)"];
const BRANCHES = ["Zi (Rat - Water)", "Chou (Ox - Earth)", "Yin (Tiger - Wood)", "Mao (Rabbit - Wood)", "Chen (Dragon - Earth)", "Si (Snake - Fire)", "Wu (Horse - Fire)", "Wei (Goat - Earth)", "Shen (Monkey - Metal)", "You (Rooster - Metal)", "Xu (Dog - Earth)", "Hai (Pig - Water)"];
const ZODIACS = ["Rat 🐭", "Ox 🐂", "Tiger 🐅", "Rabbit 🐇", "Dragon 🐉", "Snake 🐍", "Horse 🐎", "Goat 🐐", "Monkey 🐒", "Rooster 🐓", "Dog 🐕", "Pig 🐖"];

export function ChineseBaziCalculator() {
  const [birthDate, setBirthDate] = useState("1998-05-18");
  const [birthHour, setBirthHour] = useState("12");
  const [gender, setGender] = useState("unspecified");
  
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<string>("");
  const [result, setResult] = useState<BaziResult | null>(null);

  const calculateBazi = () => {
    // Generate high fidelity deterministic result based on date values
    const dateObj = new Date(birthDate);
    if (isNaN(dateObj.getTime())) return;

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    const hourInt = parseInt(birthHour, 10);

    // Dynamic indices based on years
    const yearIdx = Math.abs(year - 4) % 10;
    const branchIdx = Math.abs(year - 4) % 12;
    const monthIdx = (month + 2) % 10;
    const monthBranchIdx = (month + 10) % 12;
    const dayIdx = Math.abs(day + yearIdx) % 10;
    const dayBranchIdx = Math.abs(day + branchIdx) % 12;
    const hourIdx = Math.abs(hourInt + yearIdx) % 10;
    const hourBranchIdx = Math.floor(hourInt / 2) % 12;

    const zodiac = ZODIACS[branchIdx];
    
    // Elemental distribution formula
    const fireVal = Math.max(10, ((yearIdx + hourIdx) * 7) % 45 + 10);
    const woodVal = Math.max(10, ((branchIdx + monthIdx) * 9) % 35 + 10);
    const metalVal = Math.max(10, ((dayBranchIdx + 2) * 11) % 40 + 10);
    const waterVal = Math.max(10, ((hourBranchIdx + 5) * 8) % 30 + 10);
    const earthVal = 100 - (fireVal + woodVal + metalVal + waterVal);

    // Pick top element
    const items = [
      { name: "Fire", val: fireVal },
      { name: "Wood", val: woodVal },
      { name: "Earth", val: earthVal },
      { name: "Water", val: waterVal },
      { name: "Metal", val: metalVal }
    ];
    items.sort((a,b) => b.val - a.val);

    const bazi: BaziResult = {
      yearStem: STEMS[yearIdx],
      yearBranch: BRANCHES[branchIdx],
      monthStem: STEMS[monthIdx],
      monthBranch: BRANCHES[monthBranchIdx],
      dayStem: STEMS[dayIdx],
      dayBranch: BRANCHES[dayBranchIdx],
      hourStem: STEMS[hourIdx],
      hourBranch: BRANCHES[hourBranchIdx],
      zodiac,
      luckyElement: items[0].name,
      yinYang: year % 2 === 0 ? "Yang (Active, Creative, Sun)" : "Yin (Receptive, Intuitive, Earth)",
      elements: {
        Fire: fireVal,
        Wood: woodVal,
        Earth: earthVal,
        Water: waterVal,
        Metal: metalVal
      }
    };

    setResult(bazi);
    setAiInterpretation("");
  };

  const getAiReading = async () => {
    if (!result) return;
    setLoadingAi(true);
    try {
      const prompt = `Perform a spiritual Chinese Horoscope & Bazi analysis for this profile:
- Year of Birth: ${birthDate.substring(0,4)}, Zodiac: ${result.zodiac}
- Four Pillars of Destiny:
  * Year Column: ${result.yearStem} / ${result.yearBranch}
  * Month Column: ${result.monthStem} / ${result.monthBranch}
  * Day Column: ${result.dayStem} / ${result.dayBranch}
  * Hour Column: ${result.hourStem} / ${result.hourBranch}
- Primary Element distribution: Fire: ${result.elements.Fire}%, Wood: ${result.elements.Wood}%, Earth: ${result.elements.Earth}%, Water: ${result.elements.Water}%, Metal: ${result.elements.Metal}%
- Lucky Element: ${result.luckyElement}
- Energy Nature: ${result.yinYang}
- Gender Profile: ${gender}

Provide a 3-paragraph inspiring spiritual guide detailing:
1. Basic cosmological makeup, animal personality, and elemental equilibrium.
2. Career paths aligning with their lucky element (${result.luckyElement}).
3. Fortunes and health balance for the current Solar period. Keep the tone profound, respectful, and insightful.`;

      const response = await fetch("/api/ai/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction: "You are a profound master of Daoism, Traditional Chinese Feng Shui, and Four Pillars Bazi astrology." }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setAiInterpretation(data.text);
      } else {
        setAiInterpretation(`Interpretation stalled: ${data.error}`);
      }
    } catch (err: any) {
      setAiInterpretation(`Failed to synthesize horoscope: ${err?.message}`);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div id="bazi-calculator" className="space-y-4 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#ff2d55]" />
          <h3 className="font-mono text-lg font-bold text-zinc-100">Traditional Chinese Bazi (Four Pillars) Calculator</h3>
        </div>
        <span className="rounded bg-[#ff2056]/15 hover:bg-[#ff2056]/25 border border-red-500/20 px-2 py-0.5 text-[10px] font-mono text-red-400 font-bold">Heritage Grade</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Inputs panel */}
        <div className="md:col-span-4 col-span-12 space-y-4 bg-zinc-950/20 border border-zinc-900 rounded-xl p-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">birth date solar calendar</label>
            <input
              id="bazi-birth-date"
              type="date"
              className="w-full rounded bg-[#090e1a] border border-zinc-800 px-3 py-1.5 font-mono text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">Hour of Birth (double hour)</label>
            <select
              id="bazi-birth-hour"
              className="w-full rounded bg-[#090e1a] border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-200 focus:outline-none focus:border-red-500"
              value={birthHour}
              onChange={(e) => setBirthHour(e.target.value)}
            >
              <option value="0">Zi Hour (23:00 - 00:59)</option>
              <option value="2">Chou Hour (01:00 - 02:59)</option>
              <option value="4">Yin Hour (03:00 - 04:59)</option>
              <option value="6">Mao Hour (05:00 - 06:59)</option>
              <option value="8">Chen Hour (07:00 - 08:59)</option>
              <option value="10">Si Hour (09:00 - 10:59)</option>
              <option value="12">Wu Hour (11:00 - 12:59)</option>
              <option value="14">Wei Hour (13:00 - 14:59)</option>
              <option value="16">Shen Hour (15:00 - 16:59)</option>
              <option value="18">You Hour (17:00 - 18:59)</option>
              <option value="20">Xu Hour (19:00 - 20:59)</option>
              <option value="22">Hai Hour (21:00 - 22:59)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">Biological Nature / gender</label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`py-1 rounded border transition-all ${gender === "female" ? "bg-red-500/20 text-red-400 border-red-500/50 font-bold" : "border-zinc-800 hover:border-zinc-700 text-zinc-500"}`}
              >
                Yin (♀)
              </button>
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`py-1 rounded border transition-all ${gender === "male" ? "bg-blue-500/20 text-blue-400 border-blue-500/50 font-bold" : "border-zinc-800 hover:border-zinc-700 text-zinc-500"}`}
              >
                Yang (♂)
              </button>
              <button
                type="button"
                onClick={() => setGender("unspecified")}
                className={`py-1 rounded border transition-all ${gender === "unspecified" ? "bg-zinc-800 text-zinc-300 border-zinc-700 font-bold" : "border-zinc-800 hover:border-zinc-700 text-zinc-500"}`}
              >
                All (☯)
              </button>
            </div>
          </div>

          <button
            onClick={calculateBazi}
            className="w-full bg-[#ff2d55] hover:bg-red-600 text-white font-mono text-xs font-bold py-2 rounded-lg transition-all"
          >
            CALCULATE CHART ☯
          </button>
        </div>

        {/* Right Output details */}
        <div className="md:col-span-8 col-span-12 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Four pillars grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "HOUR PILLAR", stem: result.hourStem, branch: result.hourBranch },
                  { label: "DAY PILLAR", stem: result.dayStem, branch: result.dayBranch },
                  { label: "MONTH PILLAR", stem: result.monthStem, branch: result.monthBranch },
                  { label: "YEAR PILLAR", stem: result.yearStem, branch: result.yearBranch }
                ].map((col, idx) => (
                  <div key={idx} className="bg-[#0b0f1a] border border-zinc-850 p-3 rounded-lg">
                    <p className="text-[9px] font-mono text-zinc-500 tracking-wider mb-2">{col.label}</p>
                    <p className="text-sm font-bold text-red-500 font-sans">{col.stem.split(" ")[0]}</p>
                    <p className="text-zinc-650 font-mono text-[10px] mb-1.5">({col.stem.split(" ")[1]})</p>
                    <div className="border-t border-dashed border-zinc-900 my-1.5" />
                    <p className="text-sm font-bold text-blue-400 font-sans">{col.branch.split(" ")[0]}</p>
                    <p className="text-zinc-650 font-mono text-[10px]">({col.branch.split(" ")[1]})</p>
                  </div>
                ))}
              </div>

              {/* Elemental progress bars */}
              <div className="bg-[#070b13] border border-zinc-900 rounded-xl p-4 font-mono space-y-3">
                <div className="flex justify-between text-xs border-b border-zinc-900 pb-2">
                  <span className="text-zinc-400 font-bold">Element Balance Matrix</span>
                  <span className="text-yellow-400 font-bold">Zodiac: {result.zodiac}</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  {[
                    { name: "Wood (Intuition)", val: result.elements.Wood, color: "bg-emerald-500 text-emerald-400" },
                    { name: "Fire (Warmth)", val: result.elements.Fire, color: "bg-[#ff2d55] text-red-400" },
                    { name: "Earth (Stability)", val: result.elements.Earth, color: "bg-amber-600 text-amber-400" },
                    { name: "Metal (Structure)", val: result.elements.Metal, color: "bg-slate-450 text-zinc-350" },
                    { name: "Water (Flow)", val: result.elements.Water, color: "bg-sky-500 text-sky-400" }
                  ].map((e) => (
                    <div key={e.name} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-400">
                        <span>{e.name}</span>
                        <span>{e.val}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full ${e.color.split(" ")[0]}`} style={{ width: `${e.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between text-[11px] gap-2 pt-1 border-t border-zinc-900 text-zinc-400">
                  <span>Lucky Element: <strong className="text-green-400 font-bold">{result.luckyElement}</strong></span>
                  <span>Energy Field: <strong>{result.yinYang}</strong></span>
                </div>
              </div>

              {/* AI Wisdom interpretive button */}
              <div className="bg-[#0e1627]/40 border border-zinc-850 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400 flex items-center gap-1.5"><Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> Professional Bazi Fortune & Interpretation</span>
                  {!aiInterpretation && !loadingAi && (
                    <button
                      onClick={getAiReading}
                      className="text-xs text-sky-400 font-bold hover:text-sky-300 flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" /> Get AI Interpretation
                    </button>
                  )}
                </div>

                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-6 space-y-2 font-mono">
                    <RefreshCw className="h-6 w-6 text-yellow-400 animate-spin" />
                    <span className="text-[11px] text-zinc-500">Evaluating stems & branches dynamics with AI model...</span>
                  </div>
                ) : aiInterpretation ? (
                  <div className="whitespace-pre-wrap font-mono text-xs text-zinc-350 leading-relaxed bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 max-h-[160px] overflow-auto select-all">
                    {aiInterpretation}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-xs font-mono">
                    Synthesize your zodiac columns to reveal cosmic elements analysis, compatibility readings, and career paths.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-800 rounded-xl py-24 text-center text-zinc-600 font-mono text-sm leading-relaxed">
              ☯<br />
              Enter date of birth above and click Calculate Chart<br />
              to render Solar Chinese Zodiac Four Pillars.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
