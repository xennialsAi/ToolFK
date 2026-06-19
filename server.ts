import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini SDK with telemetry header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("Warning: GEMINI_API_KEY is not configured or uses default placeholder.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to robustly execute generation with retries and failovers
async function generateWithRetryAndFallback(client: GoogleGenAI, contents: string, config: any, isComplexTask: boolean = false) {
  // Use lightweight first to help speed if simple, else pro.
  // Switch models if it's not working fast enough.
  const modelsToTry = isComplexTask ? [
    "gemini-3.1-pro-preview",
    "gemini-2.5-pro",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite"
  ] : [
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-lite"
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    const isPro = model.includes("pro");
    const timeoutMs = isPro ? 25000 : 15000; // Switch model if not fast enough (15s for flash, 25s for pro)

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Attempting generation with model: ${model} (Attempt ${attempt}/2)`);
        
        let operationCount = 0;
        const response = await Promise.race([
          client.models.generateContent({
            model: model,
            contents: contents,
            config: config
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("TimeoutExceeded")), timeoutMs))
        ]) as any;

        return response;
      } catch (error: any) {
        lastError = error;
        const errMsg = error?.message || String(error);
        const errStatus = error?.status;
        console.log(`Model ${model} failed on attempt ${attempt}:`, errMsg);
        
        // If bad request (non-recoverable), throw instantly unless it's model finding error
        if (errStatus === 400 && !errMsg.includes("model")) {
            throw error;
        }

        // Wait a short delay before retrying the SAME model
        if (attempt === 1) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
    console.log(`Model ${model} failed after retries. Switching to next best available model...`);
  }

  throw lastError;
}

// REST SDK API Endpoints
// API to generate text for Writer, Poem, Article, Acrostic, etc.
app.post("/api/ai/text", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ status: "error", error: "Prompt is required." });
    }

    const client = getGeminiClient();
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Graceful fallback if no actual api key
    const aiModelBeingSimulated = req.body.model || "Gemma";
    const providerBeingSimulated = req.body.provider || "ModelScope";
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      const simulatedOutput = `[SIMULATION MODE - OPEN SOURCE ROUTING]
This is a high-fidelity simulation of the output. 

Provider: ${providerBeingSimulated}
Model: ${aiModelBeingSimulated}

Generated response:
"Here is a creative output based on your request: '${prompt}'. In a real session, this content is synthesized in real-time by the ${aiModelBeingSimulated} open source model hosted on ${providerBeingSimulated}."`;
      return res.json({ status: "success", text: simulatedOutput, simulated: true });
    }

    const isComplex = typeof prompt === 'string' && prompt.length > 500;

    const response = await generateWithRetryAndFallback(client, prompt, {
      systemInstruction: systemInstruction || "You are a helpful assistant on ToolFK Playground.",
      temperature: 0.7,
    }, isComplex);

    res.json({ status: "success", text: response.text });
  } catch (err: any) {
    console.error("Gemini API Error Details:", err);
    res.status(500).json({ status: "error", error: "Failed to generate text output", details: err?.message || "Internal server error." });
  }
});

// API for Nanobanana custom image / vector SVG generation
app.post("/api/ai/image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ status: "error", error: "Prompt is required." });
    }

    const client = getGeminiClient();
    const apiKey = process.env.GEMINI_API_KEY;

    const sysInstruction = `You are an expert Frontend Clipart Developer and SVG artist. Based on user requirements, you generate clean, beautiful, scalable, raw, valid vector SVG files representing high-tech design models (specifically futuristic conceptual bananas or nanobananas with glowing wireframes and HUD indicators).
ALWAYS return ONLY raw, valid SVG XML block, starting with <svg and ending with </svg>. Do not wrap in markdown comments, do not say "here is your code", do not provide explanations, no leading or trailing commentary. Ensure the SVG fits inside a 500x500 box, includes deep high-contrast gradients and cyberpunk aesthetics matching specified parameters, and scales beautifully within dark mode UIs.`;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      // Return empty so client triggers highly functional procedural fallback
      return res.json({ status: "success", simulated: true, svg: "" });
    }

    const response = await generateWithRetryAndFallback(client, prompt, {
      systemInstruction: sysInstruction,
      temperature: 0.4,
    }, true /* Complex task formatting */);

    let rawSvg = response.text || "";
    // Clean any accidental markdown wrap
    rawSvg = rawSvg.replace(/```xml/g, "").replace(/```html/g, "").replace(/```svg/g, "").replace(/```/g, "").trim();
    if (!rawSvg.startsWith("<svg")) {
      const idx = rawSvg.indexOf("<svg");
      if (idx !== -1) {
        rawSvg = rawSvg.substring(idx);
      }
    }

    res.json({ status: "success", svg: rawSvg });
  } catch (err: any) {
    console.error("Gemini Image API Error:", err);
    res.status(500).json({ status: "error", error: "Failed to generate custom AI Clipart", details: err?.message || "Internal server error." });
  }
});

// API for SVG clipart generation
app.post("/api/ai/clipper", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ status: "error", error: "Prompt is required." });
    }

    const client = getGeminiClient();
    const apiKey = process.env.GEMINI_API_KEY;

    const sysInstruction = `You are a professional SVG Illustrator. You generate clean, raw, valid SVG code for cute vectors, clipart, and minimalist icons based on keywords. 
ALWAYS return ONLY the raw SVG xml block, starting with <svg and ending with </svg>. Do not wrap in markdown tags, do not provide explanations, no leading or trailing commentary. Ensure the SVG has viewBox, clean layout, fits perfectly in a dark mode cyber UI, uses modern cyberpunk gradients and styling (reds, blues, neons).`;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      // Fallback valid SVG
      const mockSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <radialGradient id="sim-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff2e5b" />
            <stop offset="100%" stop-color="#120c24" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#sim-grad)" stroke="#00d2ff" stroke-width="2" />
        <text x="50" y="52" fill="#ffffff" font-family="monospace" font-size="6" text-anchor="middle">SIMULATED SVG</text>
        <text x="50" y="60" fill="#ffffff" font-family="monospace" font-size="4" text-anchor="middle">(${prompt.substring(0, 15)})</text>
        <path d="M 30,30 L 70,70 M 70,30 L 30,70" stroke="#00d2ff" stroke-width="1" stroke-dasharray="2,2" />
      </svg>`;
      return res.json({ status: "success", svg: mockSvg, simulated: true });
    }

    const response = await generateWithRetryAndFallback(client, `Generate a beautiful visual SVG clipart vector representing: "${prompt}". Remember, ONLY raw SVG starting with <svg and ending with </svg>.`, {
      systemInstruction: sysInstruction,
      temperature: 0.3,
    }, true /* Complex task formatting */);

    let rawSvg = response.text || "";
    // Sanitize slightly in case of markdown block markers
    rawSvg = rawSvg.replace(/```xml/g, "").replace(/```html/g, "").replace(/```svg/g, "").replace(/```/g, "").trim();
    if (!rawSvg.startsWith("<svg")) {
      // Find where svg starts
      const idx = rawSvg.indexOf("<svg");
      if (idx !== -1) {
        rawSvg = rawSvg.substring(idx);
      }
    }

    res.json({ status: "success", svg: rawSvg });
  } catch (err: any) {
    console.error("Gemini API Error Details:", err);
    res.status(500).json({ status: "error", error: "Failed to generate clipart", details: err?.message || "Internal server error." });
  }
});

// API endpoint to simulate online code compilers / runners
app.post("/api/ai/compiler", async (req, res) => {
  try {
    const { language, code, input, model, provider } = req.body;
    if (!language || !code) {
      return res.status(400).json({ status: "error", error: "Language and Code are required." });
    }

    const client = getGeminiClient();
    const apiKey = process.env.GEMINI_API_KEY;
    const aiModelBeingSimulated = model || "Qwen3-Coder";
    const providerBeingSimulated = provider || "ModelScope";

    const systemInstruction = `You are the ${aiModelBeingSimulated} open source model hosted on ${providerBeingSimulated} running as an expert compiler simulator sandbox. You receive code written in a programming language (like C#, Python, Rust, Golang, C++, PHP, Lua) and a simulated optional stdin input. 
You must simulate compiling and running this code, and output the standard stdout, stderr, and execution details. 
Return your response as a JSON object, with exact formatting:
{
  "exitCode": 0,
  "stdout": "...",
  "stderr": "...",
  "executionTimeMs": 15,
  "memoryUsageKb": 128
}
Make the program outputs highly realistic, conforming to the language's natural behavior and grammar. Do not write markdown blocks wrapping the JSON. Return only the parsable JSON.`;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      // High quality local simulator for simple programs or general template
      let stdout = `[PROVIDER_HUB: ${providerBeingSimulated}]\nExecuting simulated compiler for ${language} using ${aiModelBeingSimulated}...\n`;
      if (code.includes("print") || code.includes("echo") || code.includes("Console.Write") || code.includes("System.out.print")) {
        stdout += `[Virtual Out] Hello World!\nExecution successful.\nInput received: "${input || "none"}"`;
      } else {
        stdout += `Program compiled successfully in sandbox environment.\nStdout: (No print statement captured)`;
      }
      return res.json({
        status: "success",
        simulated: true,
        exitCode: 0,
        stdout,
        stderr: "",
        executionTimeMs: 12,
        memoryUsageKb: 64
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Simulate compiling and running this ${language} code:\n\nCODE:\n${code}\n\nSTDIN INPUT:\n${input || ""}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    let rawJson = response.text || "";
    const parsed = JSON.parse(rawJson);
    res.json({ status: "success", ...parsed });
  } catch (err: any) {
    console.error("Sandbox execution simulation failed:", err);
    res.status(500).json({ status: "error", error: err?.message || "Virtual execution stalled." });
  }
});

// Setup Vite Development Server or Static Production Handler
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Development Server middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from dist/");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ToolFK Playground Server running on port ${PORT}`);
  });
}

setupServer();
