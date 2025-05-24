# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project
Online clicker game built with Next.js and Tailwind CSS.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run test` - Run all tests
- `npm run test -- -t "test name"` - Run specific test
- `npm run typecheck` - Type check with TypeScript
- `npm run verify-pages` - Verify all pages are accessible

## Code Style
- **Formatting**: Use Prettier with default config
- **Linting**: Use ESLint with Next.js recommended rules
- **Imports**: Group and sort imports by type (React, components, utils, types)
- **TypeScript**: Use strict type checking, prefer explicit types over inference
- **Components**: Use functional components with hooks
- **CSS**: Use Tailwind utility classes for everything CSS related when possible, create custom classes in globals.css when needed
- **State**: Use React hooks for local state, consider Zustand for global state
- **Error Handling**: Use try/catch for async operations, display user-friendly error messages
- **Naming**: camelCase for variables/functions, PascalCase for components, ALL_CAPS for constants
- **Unused Variables**: Prefix with underscore (_) to acknowledge intentionally unused variables

## MCP Servers
- Use servers-knowledge-graph MCP to store knowledge
- Use server-sequential-thinking MCP for sequential thinking and reasoning of advanced tasks or when needed
- Use mcp-hyperbrowserai to browse and debug our web application
- Use context7-mcp MCP server to view the React documentation or other documentation