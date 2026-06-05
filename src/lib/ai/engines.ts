/**
 * Engine loader — reads the prompt MD files in docs/engines/ at request time
 * and exposes a registry of available humanizer engines.
 *
 * Why MD files instead of TS strings: Arslan wants to edit the engine prompts
 * as documents, not as code. Drop a new file in docs/engines/, redeploy, done.
 */

import fs from "node:fs";
import path from "node:path";

export const ENGINE_IDS = [
  "humora-original",
  "blader-v29",
  "blader-upstream",
  "brandonwise",
  "lynote-style",
] as const;

export type EngineId = (typeof ENGINE_IDS)[number];

export const DEFAULT_ENGINE_ID: EngineId = "humora-original";

export type EngineMeta = {
  id: EngineId;
  name: string;
  shortName: string;
  version: string;
  description: string;
  isDefault: boolean;
};

export type Engine = EngineMeta & {
  system: string;
};

function isEngineId(value: string): value is EngineId {
  return (ENGINE_IDS as readonly string[]).includes(value);
}

export function normalizeEngineId(value: unknown): EngineId {
  if (typeof value === "string" && isEngineId(value)) return value;
  return DEFAULT_ENGINE_ID;
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw };
  const headerBlock = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\r?\n/, "");
  const meta: Record<string, string> = {};
  for (const line of headerBlock.split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    meta[key] = value;
  }
  return { meta, body };
}

const cache = new Map<EngineId, Engine>();

function loadEngine(id: EngineId): Engine {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "docs", "engines", `${id}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(raw);

  const engine: Engine = {
    id,
    name: meta.name || id,
    shortName: meta.shortName || meta.name || id,
    version: meta.version || "",
    description: meta.description || "",
    isDefault: meta.isDefault === "true",
    system: body.trim(),
  };
  cache.set(id, engine);
  return engine;
}

export function getEngine(id: EngineId): Engine {
  return loadEngine(id);
}

export function listEngines(): EngineMeta[] {
  return ENGINE_IDS.map((id) => {
    const e = loadEngine(id);
    return {
      id: e.id,
      name: e.name,
      shortName: e.shortName,
      version: e.version,
      description: e.description,
      isDefault: e.isDefault,
    };
  });
}
