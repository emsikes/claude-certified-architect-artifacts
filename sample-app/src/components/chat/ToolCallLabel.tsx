import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  args: Record<string, any>;
  state: string;
  result?: unknown;
}

interface ToolCallLabelProps {
  toolInvocation: ToolInvocation;
}

function getLabel(toolName: string, args: Record<string, any>): string {
  const path = args?.path;
  const command = args?.command;

  if (toolName === "str_replace_editor" && path) {
    switch (command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
      case "insert":
        return `Editing ${path}`;
      case "view":
        return `Viewing ${path}`;
    }
  }

  if (toolName === "file_manager" && path) {
    switch (command) {
      case "rename":
        return `Renaming ${path}`;
      case "delete":
        return `Deleting ${path}`;
    }
  }

  return toolName;
}

export function ToolCallLabel({ toolInvocation }: ToolCallLabelProps) {
  const label = getLabel(toolInvocation.toolName, toolInvocation.args);
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
