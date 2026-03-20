import { describe, test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallLabel } from "../ToolCallLabel";

afterEach(cleanup);

function makeTool(toolName: string, args: Record<string, any>, state = "result", result: unknown = "Success") {
  return { toolName, toolCallId: "test-id", args, state, result };
}

describe("ToolCallLabel", () => {
  test("shows 'Creating' for str_replace_editor create command", () => {
    render(<ToolCallLabel toolInvocation={makeTool("str_replace_editor", { command: "create", path: "/components/Card.jsx" })} />);
    expect(screen.getByText("Creating /components/Card.jsx")).toBeDefined();
  });

  test("shows 'Editing' for str_replace_editor str_replace command", () => {
    render(<ToolCallLabel toolInvocation={makeTool("str_replace_editor", { command: "str_replace", path: "/App.jsx" })} />);
    expect(screen.getByText("Editing /App.jsx")).toBeDefined();
  });

  test("shows 'Editing' for str_replace_editor insert command", () => {
    render(<ToolCallLabel toolInvocation={makeTool("str_replace_editor", { command: "insert", path: "/index.tsx" })} />);
    expect(screen.getByText("Editing /index.tsx")).toBeDefined();
  });

  test("shows 'Viewing' for str_replace_editor view command", () => {
    render(<ToolCallLabel toolInvocation={makeTool("str_replace_editor", { command: "view", path: "/App.jsx" })} />);
    expect(screen.getByText("Viewing /App.jsx")).toBeDefined();
  });

  test("shows 'Renaming' for file_manager rename command", () => {
    render(<ToolCallLabel toolInvocation={makeTool("file_manager", { command: "rename", path: "/old.jsx" })} />);
    expect(screen.getByText("Renaming /old.jsx")).toBeDefined();
  });

  test("shows 'Deleting' for file_manager delete command", () => {
    render(<ToolCallLabel toolInvocation={makeTool("file_manager", { command: "delete", path: "/temp.jsx" })} />);
    expect(screen.getByText("Deleting /temp.jsx")).toBeDefined();
  });

  test("falls back to toolName for unknown tools", () => {
    render(<ToolCallLabel toolInvocation={makeTool("unknown_tool", {})} />);
    expect(screen.getByText("unknown_tool")).toBeDefined();
  });

  test("falls back to toolName when args has no path", () => {
    render(<ToolCallLabel toolInvocation={makeTool("str_replace_editor", { command: "create" })} />);
    expect(screen.getByText("str_replace_editor")).toBeDefined();
  });

  test("shows spinner when tool is in progress", () => {
    const { container } = render(
      <ToolCallLabel toolInvocation={makeTool("str_replace_editor", { command: "create", path: "/App.jsx" }, "call", undefined)} />
    );
    expect(container.querySelector(".animate-spin")).toBeDefined();
    expect(screen.getByText("Creating /App.jsx")).toBeDefined();
  });

  test("shows green dot when tool is complete", () => {
    const { container } = render(
      <ToolCallLabel toolInvocation={makeTool("str_replace_editor", { command: "create", path: "/App.jsx" })} />
    );
    expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  });
});
