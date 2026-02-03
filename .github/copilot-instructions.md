# Copilot Instructions for sql-loader-node

## Project Overview

This is a lean CLI utility in Node.js for loading SQL scripts in minimal setups. The project emphasizes simplicity, small footprint, and test-first development.

## Tech Stack

- **Runtime**: Node.js (latest LTS recommended)
- **CLI Framework**: Commander.js
- **Database**: pg (PostgreSQL client)
- **Testing**: SQLite or pg for embedded tests

## Core Principles

### 1. Lean Design
- Keep dependencies minimal
- Avoid unnecessary abstractions
- Prefer simple, straightforward solutions over complex patterns
- Every line of code should have a clear purpose
- No bloat - if it's not essential, don't add it

### 2. Test-First Development
- Write tests before implementing features
- Use SQLite or pg for embedded tests (no external database required)
- Tests should be fast and isolated
- Aim for high test coverage, especially for core functionality
- Tests are documentation - make them clear and readable

### 3. Code Quality Standards
- Use clear, descriptive variable and function names
- Keep functions small and focused (single responsibility)
- Prefer pure functions where possible
- Handle errors explicitly - no silent failures
- Use async/await for asynchronous operations

## Coding Guidelines

### File Structure
- Keep source files in `src/` or project root if minimal
- Keep test files adjacent to source or in `test/` directory
- Use clear naming: `*.test.js` or `*.spec.js` for tests

### Database Operations
- Always use parameterized queries (never string concatenation)
- Handle connection pooling appropriately
- Clean up connections and resources
- Support both PostgreSQL and SQLite for testing

### CLI Design
- Commands should have clear, intuitive names
- Provide helpful error messages
- Include usage examples in help text
- Exit with appropriate status codes

### Error Handling
- Validate inputs early
- Provide clear error messages to users
- Log errors appropriately
- Don't expose sensitive information in errors

## Development Workflow

1. Write a test that fails
2. Implement the minimal code to make it pass
3. Refactor if needed while keeping tests green
4. Commit with clear, descriptive messages

## What NOT to Do

- Don't add unnecessary dependencies
- Don't create complex inheritance hierarchies
- Don't use global state
- Don't skip error handling
- Don't write tests after code (test-first!)
- Don't commit code without tests
- Don't add features that aren't needed

## Documentation

- Update README.md for user-facing changes
- Add inline comments only when the code isn't self-explanatory
- Keep documentation accurate and up-to-date
- Include usage examples for CLI commands
