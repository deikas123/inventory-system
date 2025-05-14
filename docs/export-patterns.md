# Export Patterns Guide

This document outlines the export patterns we use in our project to ensure consistency and prevent deployment issues.

## General Rules

1. **Use named exports for components, functions, and types**
   \`\`\`typescript
   // Good
   export function MyComponent() { ... }
   export const myFunction = () => { ... }
   export type MyType = { ... }
   
   // Avoid
   export default function MyComponent() { ... }
   \`\`\`

2. **Only use default exports for Next.js page components**
   - `app/page.tsx`
   - `app/*/page.tsx`
   - `app/layout.tsx`
   - `app/*/layout.tsx`

3. **When you need both named and default exports**
   \`\`\`typescript
   // Export the named function
   export function MyComponent() { ... }
   
   // Re-export as default for backward compatibility
   export default MyComponent;
   \`\`\`

4. **Re-export from other modules**
   \`\`\`typescript
   // Re-export specific items
   export { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
   
   // Re-export with a different name
   export { originalName as newName } from "./some-module";
   \`\`\`

## Common Patterns

### Components

\`\`\`typescript
// components/my-component.tsx
export function MyComponent() { ... }
\`\`\`

### Utility Functions

\`\`\`typescript
// lib/utils.ts
export function utilityFunction() { ... }
\`\`\`

### Types

\`\`\`typescript
// types/my-types.ts
export type MyType = { ... }
export interface MyInterface { ... }
\`\`\`

## Checking for Export Issues

Run the export check script:

\`\`\`bash
npx ts-node scripts/check-exports.ts
\`\`\`

Or use the ESLint command:

\`\`\`bash
npm run lint:exports
