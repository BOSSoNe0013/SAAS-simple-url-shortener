import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Return a list of files containing the text searched",
  args: {
    text: tool.schema.string().describe("Text to search"),
    path: tool.schema.string().optional().describe("The directory to search in. Defaults to the current working directory."),
  },
  async execute(args) {
    if (!args.text) {
      throw new Error("pattern is required")
    }

    const searchPath = args.path || Instance.directory
    const params = [searchPath, "-type f", "-name \"*\"", "-exec grep", "-il", args.text, "{} \\;"]

    const proc = Bun.spawn(["find", ...params], {
      stdout: "pipe",
      stderr: "pipe",
    })

    const output = await new Response(proc.stdout).text()
    const errorOutput = await new Response(proc.stderr).text()
    const exitCode = await proc.exited
    if (exitCode === 1) {
      return {
        title: args.text,
        metadata: { matches: 0, truncated: false },
        output: "No files found",
      }
    }

    if (exitCode !== 0) {
      throw new Error(`find failed: ${errorOutput}`)
    }

    const lines = output.trim().split("\n")
    const matches = []

    for (const line of lines) {
      if (!line) continue

      matches.push({
        path: filePath,
      })
    }
    const limit = 100
    const truncated = matches.length > limit
    const finalMatches = truncated ? matches.slice(0, limit) : matches

    if (finalMatches.length === 0) {
      return {
        title: args.text,
        metadata: { matches: 0, truncated: false },
        output: "No files found",
      }
    }

    const outputLines = [`Found ${finalMatches.length} matches`]
    if (truncated) {
      outputLines.push("")
      outputLines.push("(Results are truncated. Consider using a more specific path or text.)")
    }

    return {
      title: args.text,
      metadata: {
        matches: finalMatches.length,
        truncated,
      },
      output: outputLines.join("\n"),
    }
    
  },
})