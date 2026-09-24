import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { hashTool } from "./hash.js";
import { loadToolsFromFile } from "./load.js";
import type { PinsDocument, PinnedTool } from "./types.js";

export function buildPins(fromPath: string): PinsDocument {
  const tools = loadToolsFromFile(fromPath);
  const pinned: PinnedTool[] = tools.map((t) => {
    const description = t.description ?? "";
    const inputSchema =
      t.inputSchema && typeof t.inputSchema === "object"
        ? (t.inputSchema as Record<string, unknown>)
        : null;
    return {
      name: t.name,
      description,
      inputSchema,
      hash: hashTool({ name: t.name, description, inputSchema }),
    };
  });

  pinned.sort((a, b) => a.name.localeCompare(b.name));

  return {
    version: 1,
    algorithm: "mcpgate-v1",
    createdAt: new Date().toISOString(),
    tools: pinned,
  };
}

export function pinCommand(opts: { from: string; out: string }): PinsDocument {
  const pins = buildPins(opts.from);
  mkdirSync(dirname(opts.out), { recursive: true });
  writeFileSync(opts.out, JSON.stringify(pins, null, 2) + "\n", "utf8");
  return pins;
}
