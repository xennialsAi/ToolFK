import React, { useState, useRef } from "react";
import { Upload, Copy, Check, FileCode, Binary } from "lucide-react";

export function Base64Sandbox() {
  const [inputText, setInputText] = useState("Hello, ToolFK Playground!");
  const [outputBase64, setOutputBase64] = useState(btoa("Hello, ToolFK Playground!"));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = (text: string) => {
    setInputText(text);
    try {
      setError(null);
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setOutputBase64(encoded);
    } catch (e) {
      setError("UTF-8 encoding issue: " + (e as Error).message);
    }
  };

  const handleDecode = (b64: string) => {
    setOutputBase64(b64);
    try {
      setError(null);
      // Clean whitespace
      const cleanB64 = b64.replace(/\s/g, "");
      const decoded = decodeURIComponent(escape(atob(cleanB64)));
      setInputText(decoded);
    } catch (e) {
      setError("Invalid Base64 string: " + (e as Error).message);
    }
  };

  const triggerCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag & drop file to base64
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // extract raw b64
        const splitIndex = result.indexOf(",") + 1;
        const b64 = splitIndex > 0 ? result.substring(splitIndex) : result;
        setOutputBase64(b64);
        setInputText(`[Decompiled ${file.name} - MIME: ${file.type} - Size: ${file.size} bytes]`);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div id="base64-sandbox" className="space-y-6 text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Binary className="h-5 w-5 text-red-500" />
          <h3 className="font-mono text-lg font-bold text-zinc-100">Base64 Transcoder & File Encoder</h3>
        </div>
        <span className="rounded-full bg-blue-900/40 px-2.5 py-0.5 font-mono text-xs text-blue-400 border border-blue-500/20">Online</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left pane: UTF-8 String */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">Plain text string</label>
          <textarea
            id="base64-plain-input"
            rows={6}
            className="w-full rounded-md bg-[#0d1220] border border-zinc-800 p-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
            placeholder="Type text to encode..."
            value={inputText}
            onChange={(e) => handleEncode(e.target.value)}
          />
          <div className="flex justify-between items-center text-xs text-zinc-500 font-mono">
            <span>Length: {inputText.length} chars</span>
            <button 
              onClick={() => triggerCopy(inputText)} 
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
              title="Copy input string"
            >
              <Copy className="h-3 w-3" /> Copy Plain text
            </button>
          </div>
        </div>

        {/* Right pane: Base64 outputs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">Base64 encoded string</label>
            {error && <span className="text-xs text-red-500 font-mono">{error}</span>}
          </div>
          <textarea
            id="base64-encoded-input"
            rows={6}
            className="w-full rounded-md bg-[#0d1220] border border-zinc-800 p-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Paste base64 code to decode..."
            value={outputBase64}
            onChange={(e) => handleDecode(e.target.value)}
          />
          <div className="flex justify-between items-center text-xs text-zinc-500 font-mono">
            <span>Length: {outputBase64.length} chars</span>
            <button 
              onClick={() => triggerCopy(outputBase64)} 
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors text-blue-400"
              title="Copy base64 code"
            >
              {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy Base64 Output"}
            </button>
          </div>
        </div>
      </div>

      {/* File to Base64 drop zone */}
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragOver 
            ? "border-red-500 bg-red-950/10" 
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
        <Upload className="mx-auto h-8 w-8 text-zinc-500 mb-2" />
        <p className="text-sm font-mono text-zinc-300">
          Drag & drop any binary or asset (Image, PDF, Audio) here
        </p>
        <p className="text-xs font-mono text-zinc-500 mt-1">
          or click folder to browse local drives (Processed entirely in-browser sandbox)
        </p>
      </div>

      {/* Quick converter cheat sheet */}
      <div className="bg-[#0f1526]/60 border border-zinc-800 rounded-lg p-3 text-xs font-mono space-y-1">
        <span className="text-sky-400 font-bold">ℹ️ Data URL Prefix Templates:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400 mt-1">
          <div><code className="text-red-400">data:image/png;base64,...</code> for images</div>
          <div><code className="text-blue-400">data:audio/mp3;base64,...</code> for audio buffers</div>
          <div><code className="text-yellow-400">data:application/pdf;base64,...</code> for PDFs</div>
          <div><code className="text-green-400">data:text/plain;charset=utf-8;base64,...</code> for raw text</div>
        </div>
      </div>
    </div>
  );
}
