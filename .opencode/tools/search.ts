import { tool } from "@opencode-ai/plugin";

export default tool({
    description: "Search for text in files",
    args: {
        query: tool.schema.string().describe("Text to search"),
        path: tool.schema.string().describe("Directory or file to search"),
    },
    async execute(args) {
        const result = 
            await Bun.$`rg -n --ignore-file=../../.gitignore "${args.query}" "${args.path}"`.text();
        return result.trim() || "No matches found.";
    }
})