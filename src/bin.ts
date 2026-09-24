#!/usr/bin/env node
import { Command } from "commander";
import { runDemo } from "./demo.js";
import { pinCommand } from "./pin.js";
import { formatVerifyReport } from "./report.js";
import { formatScanReport, scanDirectory } from "./scan.js";
import { verifyCommand } from "./verify.js";

const program = new Command();

program
  .name("mcpgate")
  .description(
    "MCP Runtime Trust Plane — pin MCP tool schemas/descriptions and fail on drift"
  )
  .version("0.1.0");

program
  .command("pin")
  .description("Pin tool name + description + inputSchema hashes to a pins file")
  .requiredOption(
    "--from <path>",
    "Path to tools/list style JSON (or bare tools array)"
  )
  .requiredOption("--out <path>", "Output pins JSON path", ".mcpgate/pins.json")
  .action((opts: { from: string; out: string }) => {
    const pins = pinCommand({ from: opts.from, out: opts.out });
    console.log(
      `Pinned ${pins.tools.length} tool(s) → ${opts.out} (algorithm=${pins.algorithm})`
    );
  });

program
  .command("verify")
  .description("Verify current tools/list against pins; exit 1 on drift")
  .requiredOption("--pins <path>", "Pins file", ".mcpgate/pins.json")
  .requiredOption("--from <path>", "Current tools/list JSON")
  .action((opts: { pins: string; from: string }) => {
    const result = verifyCommand({ pins: opts.pins, from: opts.from });
    process.stdout.write(formatVerifyReport(result));
    process.exitCode = result.ok ? 0 : 1;
  });

program
  .command("scan")
  .description("Find MCP-ish JSON configs / pins under a directory")
  .argument("<dir>", "Directory to scan")
  .action((dir: string) => {
    const hits = scanDirectory(dir);
    process.stdout.write(formatScanReport(hits, dir));
  });

program
  .command("demo")
  .description(
    "Run Deadbugz fixture: pin benign, verify malicious → fail with drift report"
  )
  .action(() => {
    const { exitCode } = runDemo();
    process.exitCode = exitCode;
  });

program.parse();
