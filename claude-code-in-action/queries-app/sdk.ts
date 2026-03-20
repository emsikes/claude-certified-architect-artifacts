// Note: the "@anthropic-ai/claude-code" package has been renamed
// to "@anthropic-ai/claude-agent-sdk"
import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = "Add a description to the package.json file.";

for await (const message of query({
  prompt,
  // By default the claude code sdk has only read permissions but can override as follows
  options: {
    allowedTools: ["Edit"]
  }
})) {
  console.log(JSON.stringify(message, null, 2));
}
