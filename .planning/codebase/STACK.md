# Technology Stack

**Analysis Date:** 2026-01-14

## Languages

**Primary:**
- JavaScript (JSX) - All application code (`src/**/*.jsx`, `src/**/*.js`)

**Secondary:**
- CSS - Global styles (`src/App.css`, `src/index.css`)
- HTML5 - Entry point (`index.html`)

## Runtime

**Environment:**
- Node.js (implicit, no specific version lock)
- Browser runtime (client-side React SPA)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.3 - UI framework (`src/**/*.jsx`)
- React DOM 19.2.3 - DOM rendering (`src/main.jsx`)
- React Router DOM 7.12.0 - Client-side routing (`src/App.jsx`)

**Testing:**
- None configured (no Jest, Vitest, or similar)

**Build/Dev:**
- Vite 7.2.4 - Build tool and dev server (`vite.config.js`)
- ESLint 9.39.1 - Linting (`eslint.config.js`)
- @vitejs/plugin-react 5.1.1 - React support for Vite

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.90.1 - Backend, auth, and database (`src/utils/supabaseClient.js`)
- leaflet 1.9.4 - Map rendering (`src/pages/MapPage.jsx`)
- react-leaflet 5.0.0 - React bindings for Leaflet (`src/pages/MapPage.jsx`)
- lucide-react 0.562.0 - Icon library (used throughout components)

**Infrastructure:**
- react-markdown 10.1.0 - Markdown rendering (`package.json`)

## Configuration

**Environment:**
- `.env.local` for environment variables (gitignored)
- Required vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Vite prefix convention: `import.meta.env.VITE_*`

**Build:**
- `vite.config.js` - Vite configuration with React plugin
- `eslint.config.js` - ESLint flat config with React hooks/refresh plugins

## Platform Requirements

**Development:**
- Any platform with Node.js
- No external dependencies required

**Production:**
- Static site deployment (Vercel, Netlify, etc.)
- No server-side runtime required (client-side SPA)

---

*Stack analysis: 2026-01-14*
*Update after major dependency changes*
