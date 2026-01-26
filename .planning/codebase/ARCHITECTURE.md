# Architecture

**Analysis Date:** 2026-01-14

## Pattern Overview

**Overall:** Single Page Application (SPA) with Component-Based Architecture

**Key Characteristics:**
- Client-side rendered React application
- Route-based page organization
- Context API for global state management
- External BaaS (Supabase) for backend services

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Contains: React components (pages and reusable components)
- Location: `src/pages/*.jsx`, `src/components/*.jsx`
- Depends on: State management layer, service layer
- Used by: React Router

**State Management Layer:**
- Purpose: Global application state
- Contains: React Context providers
- Location: `src/contexts/AuthContext.jsx`
- Depends on: Service layer (Supabase client)
- Used by: All components via `useAuth()` hook

**Service Layer:**
- Purpose: External service integration
- Contains: Supabase client initialization
- Location: `src/utils/supabaseClient.js`
- Depends on: Environment variables
- Used by: State management layer, page components

**Data Layer:**
- Purpose: Static/sample data definitions
- Contains: Location data, categories, photos
- Location: `src/data/sampleData.js`
- Depends on: None
- Used by: Page components

## Data Flow

**Authentication Flow:**

1. App loads, `AuthProvider` wraps entire app (`src/App.jsx`)
2. `AuthContext` checks session via `supabase.auth.getSession()` (`src/contexts/AuthContext.jsx`)
3. Auth state stored in context, accessible via `useAuth()` hook
4. `onAuthStateChange()` listener updates state on login/logout
5. Components conditionally render based on `user` state

**Map Data Flow:**

1. `MapPage` loads sample locations from `sampleData.js` (`src/pages/MapPage.jsx`)
2. Filters applied based on user selections (local component state)
3. `useMemo` recomputes filtered locations on filter changes
4. Markers rendered on Leaflet map with dynamic colors
5. Popup interactions trigger suggestion forms

**Location Suggestion Flow:**

1. User fills form in `LocationSuggestionForm` or `SuggestPage`
2. Form data submitted to Supabase `location_suggestions` table
3. User ID captured from `AuthContext`
4. Success/error state displayed to user

**State Management:**
- Local state: `useState` for component-specific state (filters, form inputs)
- Global state: Context API for auth state only
- No Redux or other state management library

## Key Abstractions

**Custom Hook:**
- Purpose: Provide auth context to components
- Example: `useAuth()` in `src/contexts/AuthContext.jsx`
- Pattern: Context consumer hook

**Page Component:**
- Purpose: Full-page views for each route
- Examples: `MapPage`, `PhotographyPage`, `AboutPage`, `SuggestPage`
- Pattern: Route-level components with composed child components

**Filter Component:**
- Purpose: Reusable filter UI elements
- Examples: `CategoryFilters`, `StatusFilters`, `ColorSchemeToggle`
- Pattern: Controlled components receiving state via props

**Layout Component:**
- Purpose: Consistent page structure
- Example: `Layout` wrapper in `src/App.jsx`
- Pattern: Composition with `Sidebar` and content area

## Entry Points

**HTML Entry:**
- Location: `index.html`
- Triggers: Browser page load
- Responsibilities: Load React app bundle

**React Entry:**
- Location: `src/main.jsx`
- Triggers: HTML script load
- Responsibilities: Mount React app to DOM, import global styles

**App Root:**
- Location: `src/App.jsx`
- Triggers: React render
- Responsibilities: Setup routing, wrap with AuthProvider

## Error Handling

**Strategy:** Try/catch at component level, display errors in UI

**Patterns:**
- Form submissions use try/catch with error state (`src/components/AuthModal.jsx`)
- Errors displayed inline with error messages
- Console logging for development debugging
- No global error boundary configured

## Cross-Cutting Concerns

**Logging:**
- Console.log for development debugging
- Debug statements present in `MapPage.jsx` (should be removed)

**Validation:**
- HTML5 form validation (`required`, `type="email"`, `minLength`)
- No schema validation library (no Zod, Yup)

**Authentication:**
- Supabase Auth integrated via Context
- Route protection via conditional rendering (not middleware)

**Styling:**
- Inline styles throughout (no CSS-in-JS library)
- Global CSS in `src/index.css`

---

*Architecture analysis: 2026-01-14*
*Update when major patterns change*
