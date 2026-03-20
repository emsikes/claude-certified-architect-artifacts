# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator. Users describe components in a chat interface, and an LLM (Claude) generates React code that renders in a live preview. Components exist in a virtual file system (no disk writes). Authenticated users get project persistence via SQLite.

## Commands

- `npm run setup` — install deps, generate Prisma client, run migrations (first-time setup)
- `npm run dev` — start dev server with Turbopack (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — run all tests (vitest)
- `npx vitest run src/lib/__tests__/file-system.test.ts` — run a single test file
- `npx prisma migrate dev` — apply schema changes
- `npm run db:reset` — reset database

## Architecture

### AI Chat Flow

1. User sends a message via `ChatProvider` (`src/lib/contexts/chat-context.tsx`), which wraps the Vercel AI SDK's `useChat`
2. Request hits `POST /api/chat` (`src/app/api/chat/route.ts`) which uses `streamText` with two tools: `str_replace_editor` and `file_manager`
3. The LLM makes tool calls to create/edit files in a server-side `VirtualFileSystem` instance
4. Tool call results stream back to the client where `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`) mirrors changes into a client-side `VirtualFileSystem`
5. `PreviewFrame` transforms files via Babel (`src/lib/transform/jsx-transformer.ts`), builds an import map with blob URLs, and renders in an iframe

### Virtual File System

`VirtualFileSystem` (`src/lib/file-system.ts`) is the core abstraction — a tree of `FileNode` objects (files and directories) with serialize/deserialize for JSON transport. It exists on both server (for LLM tool execution) and client (for UI state). No real files are written to disk.

### Mock Provider

When `ANTHROPIC_API_KEY` is not set, `MockLanguageModel` (`src/lib/provider.ts`) returns canned responses so the app runs without API access. It simulates the multi-step tool-calling flow.

### Auth

JWT-based auth using `jose`. Sessions stored in httpOnly cookies. Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem` routes. Anonymous users can use the app but can't persist projects.

### Preview Pipeline

`jsx-transformer.ts` handles: Babel transpilation of JSX/TSX, CSS import extraction, import map generation with `@/` alias support, third-party package resolution via esm.sh, and placeholder modules for missing imports. The preview HTML loads Tailwind via CDN.

### Database

Prisma with SQLite (`prisma/dev.db`). Two models: `User` and `Project`. Project stores messages and file system state as JSON strings.

## Key Conventions

- UI components use shadcn/ui pattern (`src/components/ui/`) with Radix primitives + Tailwind + `class-variance-authority`
- Path alias `@/` maps to `src/`
- Server actions in `src/actions/`
- Tests use vitest + jsdom + React Testing Library, colocated in `__tests__/` directories
- Next.js App Router with server components (pages) and client components (interactive UI)
