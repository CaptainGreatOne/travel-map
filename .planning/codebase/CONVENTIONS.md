# Coding Conventions

**Analysis Date:** 2026-01-14

## Naming Patterns

**Files:**
- PascalCase for React components: `MapPage.jsx`, `AuthModal.jsx`, `CategoryFilters.jsx`
- camelCase for utilities: `supabaseClient.js`, `sampleData.js`
- Page components use "Page" suffix: `MapPage`, `PhotographyPage`, `AboutPage`
- `.jsx` extension for all React files

**Functions:**
- camelCase for all functions: `getCategoryCount()`, `handleSubmit()`, `setFiltersOpen()`
- Event handlers prefixed with `handle`: `handleToggleStatus()`, `handleToggleCategory()`, `handleSignOut()`
- Async functions: No special prefix

**Variables:**
- camelCase for variables: `selectedCategories`, `colorScheme`, `showingSuggestionForm`
- camelCase for state: `const [isOpen, setIsOpen] = useState(false)`
- No UPPER_SNAKE_CASE constants observed

**Types:**
- Not applicable (JavaScript project, no TypeScript)

## Code Style

**Formatting:**
- 2-space indentation
- No Prettier configuration (missing `.prettierrc`)
- Single quotes for JavaScript strings
- Double quotes for JSX attributes
- Semicolons: Inconsistent usage (some files use, some don't)

**Linting:**
- ESLint 9.x with flat config: `eslint.config.js`
- Plugins: eslint-plugin-react-hooks, eslint-plugin-react-refresh
- Rules: `no-unused-vars` with varsIgnorePattern for uppercase
- Run: `npm run lint`

## Import Organization

**Order:**
1. React imports: `import React, { useState } from 'react'`
2. External packages: `import { MapPin, Camera } from 'lucide-react'`
3. Internal modules: `import { useAuth } from '../contexts/AuthContext'`
4. Relative imports: `import AuthModal from './AuthModal'`

**Grouping:**
- No blank lines between groups (inconsistent)
- No alphabetical sorting enforced

**Path Aliases:**
- None configured (relative paths only)

## Error Handling

**Patterns:**
- Try/catch in async functions
- Error state in components: `const [error, setError] = useState(null)`
- Display errors inline with conditional rendering

**Error Types:**
- Throw on: Supabase API failures
- Log and continue: URL parsing failures, missing env vars
- No custom error classes

## Logging

**Framework:**
- Console.log for development debugging
- Console.error for errors

**Patterns:**
- Debug logs in components: `console.log('MapPage - user state:', user)`
- Error logging: `console.error('Error parsing URL:', e)`
- No structured logging

## Comments

**When to Comment:**
- Section headers: `// LAYOUT COMPONENT`, `// Map tile configurations`
- Debug notes: `// Debug logging - remove after testing`
- Sparse overall

**JSDoc/TSDoc:**
- Not used

**TODO Comments:**
- Not observed in codebase

## Function Design

**Size:**
- Large components: `MapPage.jsx` (461 lines), `SuggestPage.jsx` (376 lines)
- Should be broken into smaller components

**Parameters:**
- Props destructured in function signature: `function CategoryFilters({ categories, selectedCategories, onToggleCategory })`
- No options object pattern observed

**Return Values:**
- JSX returned from components
- Early returns for conditional rendering: `if (!isOpen) return null`

## Component Patterns

**Structure:**
```jsx
import React, { useState } from 'react';
import { Icon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function ComponentName({ prop1, prop2, onAction }) {
  const [state, setState] = useState(initialValue);

  const handleEvent = () => {
    // handler logic
  };

  return (
    <div style={{ /* inline styles */ }}>
      {/* JSX content */}
    </div>
  );
}

export default ComponentName;
```

**Hooks:**
- useState for local state
- useEffect for side effects
- useMemo for computed values
- useContext via custom hooks: `useAuth()`

**Styling:**
- Inline styles exclusively: `style={{ display: 'flex', ... }}`
- No CSS modules, styled-components, or Tailwind
- Color values: Hex colors inline (`#2d4356`, `#f4a261`)

## Module Design

**Exports:**
- Default exports for all components: `export default ComponentName`
- Named exports for data: `export const sampleLocations = [...]`

**Barrel Files:**
- Not used (no index.js re-exports)

---

*Convention analysis: 2026-01-14*
*Update when patterns change*
