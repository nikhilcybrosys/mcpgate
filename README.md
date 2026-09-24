- `description` is `""` if absent.
- `inputSchema` is `null` if absent.
- `canonical_json` is `JSON.stringify` after **recursively sorting object keys** (array order preserved).

Any change to name, description text, or schema structure/values changes the hash. Verify also reports whether the mismatch was description, schema, new tool, or missing tool.

## Scripts

```bash
npm test          # vitest
npm run build     # tsc → dist/ (bin at dist/bin.js)
npm run demo      # expected exit ≠ 0
```

## CI

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — `npm test` + build + demo-must-fail
- [`.github/workflows/mcpgate.yml`](.github/workflows/mcpgate.yml) — example verify workflow
- [`action.yml`](action.yml) — composite action: `mcpgate verify --pins … --from …`

## License

MIT — see [LICENSE](LICENSE).
