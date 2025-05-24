# ESLint Setup Documentation

This document outlines the ESLint configuration and practices for the Paperclip Clicker project.

## Overview

ESLint is a static code analysis tool that helps identify problematic patterns in JavaScript code. Our setup provides:

- Code consistency across the project
- Early detection of potential bugs and issues
- Improved code quality through standardized practices

## Configuration

The ESLint configuration is located in the `.eslintrc.json` file at the root of the project. We use the Next.js recommended configuration as a base and have added custom rules to better suit our project needs.

### Key Rules

- **Unused Variables**: Warns about unused variables (prefixing variables with `_` allows them to be unused without warnings)
- **Console Statements**: Allowed during development, but should be removed in production code
- **React Hook Dependencies**: Warns about missing dependencies in React hooks
- **JSX Accessibility**: Ensures accessibility best practices
- **Import Order**: Organizes imports logically

### Ignored Patterns

- `lib/phaser.js`: Third-party library excluded from linting

## Usage

### Basic Linting

To check for linting issues, run:

```bash
npm run lint
```

### Auto-fixing Issues

Many ESLint issues can be automatically fixed with:

```bash
npm run lint:fix
```

This command runs ESLint with the `--fix` option on both the `src` and `pages` directories.

## Best Practices

1. **Run ESLint Before Committing**: Check for and fix linting issues before committing changes
2. **Fix Warnings Proactively**: Even though warnings don't fail the build, they should be addressed
3. **Use Type Annotations**: Proper TypeScript types reduce many ESLint warnings
4. **Maintain Clean Imports**: Remove unused imports to reduce clutter
5. **Keep React Dependencies Updated**: Always include all dependencies in useEffect hooks

## Common Issues and Solutions

### Unused Variables

```javascript
// Warning:
const unusedVar = 'not used';

// Fix:
// Either use the variable or remove it
// If needed for future use, prefix with underscore:
const _unusedVar = 'not used yet';
```

### React Hook Dependencies

```javascript
// Warning:
useEffect(() => {
  doSomething(value);
}, []); // Missing dependency: value

// Fix:
useEffect(() => {
  doSomething(value);
}, [value]);
```

## Integration with IDE

For the best development experience, configure your editor to show ESLint warnings and errors in real-time:

- **VS Code**: Install the ESLint extension
- **WebStorm/IntelliJ**: Enable ESLint in the settings
- **Sublime Text**: Install the SublimeLinter-eslint package

## Further Improvements

Future improvements to our ESLint setup could include:

- Adding stricter rules as the project matures
- Implementing a pre-commit hook to prevent committing code with ESLint errors
- Adding specialized rules for accessibility and performance