export interface Tool {
  name: string;
  category: string;
  subcategory: string;
  isRealDemo?: boolean;
}

export type ToolCategory = 
  | "All tools"
  | "AI & Image Editing"
  | "Development & Code"
  | "Conversion & PDF"
  | "Specialized Chinese"
  | "General Utility";

export interface SandboxState {
  tool: Tool;
  status: "idle" | "booting" | "compiled" | "running" | "ready";
}
