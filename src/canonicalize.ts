/**
 * Recursively sort object keys for stable JSON serialization.
 * Arrays keep order; primitives are returned as-is.
 */
export function canonicalize(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = canonicalize(obj[key]);
  }
  return sorted;
}

/** Stable JSON.stringify with sorted keys at every object level. */
export function stableStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}
