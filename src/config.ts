import os from "node:os";
import path from "node:path";

export interface McpConfig {
  dbPath: string;
  openaiApiKey?: string;
  openaiModel?: string;
  debug: boolean;
}

function expandHome(p: string): string {
  if (!p) return p;
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): McpConfig {
  const dbPath = expandHome(env.SUPERLOCALMEMORY_DB_PATH ?? "~/.superlocalmemory/mcp.db");
  const openaiApiKey = env.OPENAI_API_KEY;
  const openaiModel = env.OPENAI_EMBEDDING_MODEL;
  const debug = (env.SUPERLOCALMEMORY_DEBUG ?? "").toLowerCase() === "true";

  return { dbPath, openaiApiKey, openaiModel, debug };
}
