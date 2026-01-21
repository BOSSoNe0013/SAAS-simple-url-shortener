import { tool } from "@opencode-ai/plugin";
import { execSync } from "child_process";
import { resolve } from "path";

export default tool({
  description: "Search for text in files",
  args: {
    query: tool.schema.string().describe("Text to search"),
    path: tool.schema.string().describe("Directory or file to search"),
  },
  async execute(args) {
    // Build absolute path for the ignore file
    const ignoreFile = resolve(".gitignore");
    // Escape query & path for the shell
    const cmd = `rg -n --ignore-file="${ignoreFile}" "${args.query}" "${args.path}"`;
    // Run ripgrep
    let raw: string;
    try {
      raw = execSync(cmd, { encoding: "utf8" });
    } catch (err: any) {
      // Ripgrep returns non‑zero exit code when no matches are found
      if (err.stdout) raw = err.stdout;
      else raw = ""; // generic fallback
    }
    const result = raw.trim() || "No matches found.";
    return result;
  },
});
