# Claude Certified Architect — Foundations (CCAF) Study Repo

Personal study repository for the **Claude Certified Architect — Foundations** certification.
Covers all five exam domains through hands-on code samples, mini-projects, and reference notes.

---

## Exam Overview

| Domain | Weight |
|---|---|
| Agentic Architecture & Orchestration | 27% |
| Claude Code Configuration & Workflows | 20% |
| Prompt Engineering & Structured Output | 20% |
| Tool Design & MCP Integration | 18% |
| Context Management & Reliability | 15% |

**Format:** 60 questions · Proctored · Scenario-anchored (4 of 6 scenarios selected randomly)  
**Registration:** [anthropic.skilljar.com/claude-certified-architect-foundations-access-request](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)  
**Training courses:** [anthropic.skilljar.com](https://anthropic.skilljar.com)

---

## Repo Structure

One top-level directory per course. Sample projects live as subdirectories within each course folder.

```
/
├── .claude/
│   └── settings.example.json   # Claude Code settings template
├── .github/
│   └── workflows/              # CI workflows
├── claude-code-in-action/      # Course: Claude Code in Action ✓
│   ├── sample-app/
│   └── queries-app/
├── building-with-claude-api/   # Course: Building with the Claude API
├── intro-to-mcp/               # Course: Introduction to MCP
├── mcp-advanced/               # Course: MCP Advanced Topics
├── intro-to-agent-skills/      # Course: Introduction to Agent Skills
├── .gitignore
└── README.md
```

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- An Anthropic API key

### Python environment

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Environment variables

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

### Install dependencies

```bash
# Python
pip install anthropic

# Node / Claude Code
npm install -g @anthropic-ai/claude-code
```

---

## Domain Notes

### Domain 1 · Agentic Architecture & Orchestration (27%)

> Hub-and-spoke orchestration · Task decomposition · stop_reason handling · Multi-agent pipelines · Error propagation

<!-- Add notes and links to code samples here -->

---

### Domain 2 · Claude Code Configuration & Workflows (20%)

> CLAUDE.md hierarchy · Plan mode · Custom slash commands · Skills · CI/CD with -p flag · Batch processing

<!-- Add notes and links to code samples here -->

---

### Domain 3 · Prompt Engineering & Structured Output (20%)

> JSON schema design · tool_use for structured output · Validation-retry loops · Few-shot prompting · Prompt caching · Batch API

<!-- Add notes and links to code samples here -->

---

### Domain 4 · Tool Design & MCP Integration (18%)

> MCP server design · Tool boundary management · Tool count limits (4–5 per agent) · Sampling · Transport mechanisms

<!-- Add notes and links to code samples here -->

---

### Domain 5 · Context Management & Reliability (15%)

> Progressive summarization · Context positioning · Information provenance · Escalation patterns · Human-in-the-loop

<!-- Add notes and links to code samples here -->

---

## Exam Scenarios

The exam randomly selects 4 of these 6 scenarios. All questions anchor to the selected scenarios.

| # | Scenario | Key Concepts |
|---|---|---|
| 1 | Customer Support Agent | Escalation, complexity routing, tool use |
| 2 | Claude Code Dev Team Workflow | CLAUDE.md, plan mode, slash commands |
| 3 | Multi-Agent Research System | Orchestration, context passing, result synthesis |
| 4 | Developer Tools with Agent SDK | Tool selection, MCP servers, code generation |
| 5 | CI/CD Pipeline Integration | -p flag, structured output, Batch API |
| 6 | Structured Data Extraction | JSON schemas, tool_use, validation-retry loops |

<!-- Add scenario walkthroughs and code under /scenarios -->

---

## Key Anti-Patterns (Common Wrong Answers)

- ❌ Parsing natural language for loop termination → always check `stop_reason`
- ❌ Prompt-based enforcement for critical business rules → use hooks
- ❌ Same-session self-review → retains reasoning bias; use a separate agent
- ❌ Too many tools per agent (18+) → keep to 4–5; more degrades selection quality
- ❌ Sentiment-based escalation → sentiment ≠ complexity
- ❌ Aggregate accuracy metrics → track per document type

---

## Official Resources

| Resource | Link |
|---|---|
| Anthropic Academy | [anthropic.skilljar.com](https://anthropic.skilljar.com) |
| Claude Code Docs | [code.claude.com/docs](https://code.claude.com/docs) |
| Anthropic Docs | [docs.anthropic.com](https://docs.anthropic.com) |
| Claude Partner Network | [anthropic.com/news/claude-partner-network](https://www.anthropic.com/news/claude-partner-network) |
| Practice Questions | [claudecertifications.com](https://claudecertifications.com) |

---

## Progress Tracker

- [x] Claude Code in Action
- [ ] Introduction to Agent Skills
- [ ] Introduction to Model Context Protocol
- [ ] Model Context Protocol: Advanced Topics
- [ ] Building with the Claude API
- [ ] AI Fluency: Framework & Foundations
- [ ] Claude 101
- [ ] Domain 1 hands-on complete
- [ ] Domain 2 hands-on complete
- [ ] Domain 3 hands-on complete
- [ ] Domain 4 hands-on complete
- [ ] Domain 5 hands-on complete
- [ ] All 6 scenarios practiced
- [ ] Practice exam complete
- [ ] Exam registered
- [ ] ✅ Certified

---

## Notes

<!-- Personal notes, lessons learned, things to revisit -->
