import { readFileSync } from "node:fs";
import type { McpTool, PinsDocument, ToolsListDocument } from "./types.js";

export function readJsonFile(path: string): unknown {
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw) as unknown;
}

/** Accept tools/list style: { tools: [...] }, { result: { tools: [...] } }, or a bare array. */
export function extractTools(doc: unknown): McpTool[] {
  if (Array.isArray(doc)) {
    return doc as McpTool[];
  }
  if (doc && typeof doc === "object") {
    const d = doc as ToolsListDocument;
    if (Array.isArray(d.tools)) return d.tools;
    if (d.result && Array.isArray(d.result.tools)) return d.result.tools;
  }
  throw new Error(
    "Unrecognized tools JSON: expected { tools: [...] }, { result: { tools: [...] } }, or a bare array of tools"
  );
}

export function loadToolsFromFile(path: string): McpTool[] {
  return extractTools(readJsonFile(path));
}

export function loadPinsFromFile(path: string): PinsDocument {
  const doc = readJsonFile(path) as PinsDocument;
  if (!doc || doc.version !== 1 || !Array.isArray(doc.tools)) {
    throw new Error(`Invalid pins file: ${path}`);
  }
  return doc;
}
