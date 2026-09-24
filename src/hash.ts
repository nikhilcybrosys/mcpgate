import { createHash } from "node:crypto";
import { stableStringify } from "./canonicalize.js";

/**
 * mcpgate-v1 content hash
 * -----------------------
 * SHA-256 hex digest over the UTF-8 bytes of:
 *
 *   name + "\n" + description + "\n" + stableStringify(inputSchema)
 *
 * where:
 * - `name` is the tool name (exact)
 * - `description` is the tool description, or "" if absent
 * - `inputSchema` is the tool's inputSchema object, or null if absent
 * - stableStringify is JSON.stringify with object keys sorted recursively
 *
 * This catches description drift (Deadbugz / tool-poisoning) and schema
 * changes without caring about key order in the original JSON.
 */
export function hashTool(parts: {
  name: string;
  description?: string | null;
  inputSchema?: Record<string, unknown> | null;
}): string {
  const name = parts.name;
  const description = parts.description ?? "";
  const schema = parts.inputSchema ?? null;
  const payload = `${name}\n${description}\n${stableStringify(schema)}`;
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
