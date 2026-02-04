# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-01)

**Core value:** Interactive companion app for a travel vlog YouTube channel
**Current focus:** v1.3 Production Ready — suggestion simplification, admin enhancements, deployment prep

## Current Position

Phase: 22 of 22 (Deployment Preparation)
Plan: 1 of 2 in current phase
Status: In progress
Last activity: 2026-02-04 — Completed 22-01-PLAN.md

Progress: █████████░ 96% (v1.3)

## Performance Metrics

**Velocity:**
- Total plans completed: 24
- Average duration: 4.5 min
- Total execution time: 107 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-styling-infrastructure | 5/5 | 14 min | 3 min |
| 02-component-decomposition | 5/5 | 12 min | 2.4 min |
| 03-error-handling-validation | 4/4 | 11 min | 2.75 min |
| 04-database-schema-redesign | 4/4 | ~37 min | ~9 min |
| 05-admin-panel | 5/5 | 32 min | 6.4 min |

**Recent Trend:**
- Last 5 plans: 05-01 (1 min), 05-02 (1 min), 05-03 (2 min), 05-04 (3 min), 05-05 (25 min)
- Note: 05-05 included significant bug fixes discovered during verification

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Refactor over rebuild (architecture is 85-90% aligned)
- Supabase for auth (spam prevention) + database
- Keep Leaflet for mapping
- Use Tailwind CSS for styling (Phase 1 decision)
- Tailwind v3 over v4 for stability (01-01)
- primary-hover and status colors added to config (01-02)
- Conditional className composition pattern (01-02)
- SlideIn animation kept as inline style tag (01-03)
- Tailwind arbitrary value syntax for calc() widths (01-04)
- `isolate z-0` to contain Leaflet z-index (01-05)
- `overflow-auto` for scrollable content areas (01-05)
- AuthPrompt manages AuthModal internally for self-contained flow (02-02)
- parseGoogleMapsUrl returns null on error for safe handling (02-02)
- Custom hooks in src/hooks/ directory (02-01)
- Keep hook and utility as separate files for clear imports (02-01)
- Extract SidebarFilters as separate component for line count target (02-03)
- Marker icon logic centralized in mapStyles utility (02-03)
- Extract SuggestForm component for line count target (02-04)
- Form receives user via props rather than useAuth directly (02-04)
- Async parseGoogleMapsUrlAsync for short URL support via fetch redirect (02-05)
- Modals use createPortal to render outside component DOM hierarchy (02-05)
- Class components for error boundaries (React requirement) (03-01)
- Nested error boundaries: MapErrorBoundary inside app ErrorBoundary (03-01)
- 10-second timeout for auth session check (03-02)
- 30-second default timeout for fetchWithTimeout utility (03-02)
- AppContent component separates auth loading from routes (03-02)
- Simple validation without Zod (no complex schemas needed) (03-03)
- Safe email extraction with fallback to 'user' (03-03)
- Use type='text' with custom validation over type='email' for consistent error UX (03-04)
- Text primary key for categories (semantic IDs like 'nature', 'city') (04-01)
- UUID for entity tables (locations, videos) with gen_random_uuid() (04-01)
- Trigger-based constraint for max 3 videos per location (04-01)
- Public read policies with no write policies (admin-only via service role) (04-01)
- Database-enforced rate limits over application-level validation (04-02)
- SECURITY DEFINER on trigger functions for cross-table writes (04-02)
- Separate counting tables for suggestions and reminders (04-02)
- Service functions return null on error for graceful fallback (04-03)
- Service layer pattern: src/services/*.js for DB operations (04-03)
- Fallback pattern: Initialize with sample data, replace with DB data (04-03)
- ON CONFLICT DO NOTHING for idempotent seed data (04-04)
- Rate limit whitelist for test accounts (04-04)
- Email whitelist from env var for admin access control (05-01)
- Admin service pattern: return { success, data, error } consistent with existing services (05-01)
- Authenticated users can write via RLS (AdminGuard restricts UI access) (05-03)
- Delete requires two clicks (confirm pattern) for admin operations (05-03)
- Auto-generate slug from name on input for locations (05-03)
- Local state update after moderation actions (no full refetch needed) (05-04)
- YouTube thumbnail auto-generated from ID (05-04)
- 5-second timeout for Edge Function calls (06-01)
- Graceful fallback to isShortUrl hint when Edge Function unavailable (06-01)
- Vitest for testing (Vite-native, fast, ESM-compatible) (06-02)
- Preserve Unicode from decodeURIComponent (not normalize to ASCII) (06-02)
- TDD for utility functions with clear input/output contracts (06-02)
- Short URL fallback shows info (blue) not error (red) - link still valid (06-03)
- LocationPreview component separate from SuggestForm for reusability (06-03)
- TDD discovered: validateEmail should trim whitespace before regex validation (07-01)
- jsdom environment for React hook testing (07-03)
- renderHook from @testing-library/react for hook tests (07-03)
- Nullable text column for country_code (08-01)
- Static COUNTRY_CODE_MAP for name-to-ISO conversion (08-01)
- Extract country from last comma-separated segment of place name (08-01)
- useMemo for sorted list to avoid re-sorting on every render (09-01)
- Combined filter state pattern for search/category/country (09-01)
- Single-select for video linking, multiSelect=false (10-01)
- SearchableLocationSelect pattern for reusable searchable dropdowns (10-01)
- Single user-friendly error message for all URL validation failures (11-01)
- Defense-in-depth sanitization: complements React/Supabase protections (11-01)
- URL validation at form input change for immediate feedback (11-02)
- Service-layer sanitization is silent (no user feedback) (11-02)
- react-leaflet-cluster for marker clustering (12-01)
- Remove closeOnClick={false} for native Leaflet click-away behavior (12-01)
- Blue cluster color scheme to complement marker colors (12-01)
- Case-insensitive search using toLowerCase() for user filtering (13-01)
- uniqueCountries computed from validLocations for country dropdown (13-01)
- Search and country filters combine with AND logic (13-01)
- useSearchParams for bidirectional URL/popup state sync (14-01)
- MapViewController pattern for programmatic map.setView() (14-01)
- markerRefs pattern for programmatic popup control (14-01)
- Link2 icon for share button, Check icon for copy feedback (14-01)
- Storage path pattern: photos/{timestamp}-{random}.{ext} for unique filenames (16-01)
- Delete DB record first, then storage (DB is source of truth) (16-01)
- Upload cleanup on DB insert failure to prevent orphaned files (16-01)
- PhotoManager follows existing admin component patterns (16-02)
- Move function inside useEffect to satisfy lint rules (16-02)
- Async data fetch in page component with loading/error/empty state pattern (16-03)
- Single-row table pattern with CHECK (id = 1) constraint for singleton config (17-01)
- Separate paragraph fields (not JSON array) for simple form binding (17-01)
- DB hints pattern: show current database value as reference when admin overrides (18-02)
- Nullish coalescing (??) for number input binding to handle null vs 0 distinction (18-02)
- Three widget types for Instagram: none, lightwidget, official (19-01)
- No service changes needed for new columns - select('*') pattern auto-includes (19-01)
- dangerouslySetInnerHTML for admin-controlled widget embed code (19-02)
- Component returns null for feature toggle visibility pattern (19-02)
- Mobile deep link with 500ms timeout fallback to web URL (19-02)
- Google Maps URL required for suggestions (no optional mode) (20-01)
- Location name from URL parsing only (no manual input) (20-01)
- Validate URL yields extractable location name before submit (20-01)
- URL constructor for robust YouTube URL parsing (21-01)
- Simplified Instagram widget: 2 options (none/custom) instead of 3 (21-01)
- JSONB array for flexible social links storage (21-01)
- Use != null check for numeric zero handling in display (21-01)

### Deferred Issues

None yet.

### Pending Todos

- **Normalize country data** (low priority): Extract `country`/`country_code` from locations and suggestions into a separate `countries` table with FK relationships. Not urgent given small dataset (~600 records), but would enable country metadata (flags, continents) and single-source-of-truth naming. Consider for a future "database cleanup" phase if needed.

- **Improve photo reordering UX** (low priority): Current up/down arrows work but aren't the most intuitive for bulk reordering. Consider drag-and-drop using `@dnd-kit/core` or `react-beautiful-dnd`. Would make reordering faster and more visual.

- **Photo watermarking system** (medium priority): Add watermarks to photos to deter theft. Options include: canvas-based client-side watermarking on upload, Supabase Edge Function for server-side processing, or external service like Cloudinary. Consider placement (corner vs diagonal), opacity, and whether to watermark originals or generate watermarked versions on-the-fly.

- **YouTube API integration testing** (blocked): Revisit Phase 18 YouTube stats integration once the channel has been created and a YouTube Data API key has been obtained. Test: subscriber count fetching, video count from channel, periodic refresh (12-24 hour caching), and fallback behavior when API is unavailable. Currently using manual entry via admin as primary input method.

- **Instagram API integration** (blocked): Implement official Instagram embed using Meta/Facebook Basic Display API or Instagram Graph API. Requires Instagram creator/business account and Meta developer app approval. Currently using third-party LightWidget as alternative.

- **Test API integration responsiveness** (blocked): Once YouTube and Instagram APIs are connected, verify: response times under various network conditions, graceful degradation when APIs are slow/unavailable, proper loading states during API calls, and caching behavior (12-24 hour refresh cycles).

- **Test About page stats updating** (medium priority): Manually verify the admin workflow for updating About page stats (location count, video count, country count, subscriber count). Confirm changes reflect on public About page, fallback values display correctly when fields are null, and number formatting works properly.

### Blockers/Concerns

- **YouTube API testing blocked**: Cannot test YouTube Data API integration (subscriber count, video count auto-fetch) until YouTube channel is created and API key is obtained from Google Cloud Console.

- **Instagram API testing blocked**: Cannot test official Instagram embed integration until Instagram creator account is set up and Meta developer app is approved. Third-party LightWidget option works without API but official embed requires credentials.

### Roadmap Evolution

- v1.0 MVP completed: Styling, components, error handling, database, admin panel, suggestions, testing (Phases 1-7, shipped 2026-01-23)
- v1.1 Core Enhancements completed: Admin UX, country tracking, video-location UX, security, map performance (Phases 8-13, shipped 2026-01-29)
- v1.2 Content & Sharing completed: Location sharing, photography CMS, about page CMS, dynamic stats, Instagram feed (Phases 14-19, shipped 2026-02-01)
- v1.3 Production Ready created: Suggestion simplification, social/about improvements, deployment prep (Phases 20-22)

## Session Continuity

Last session: 2026-02-04
Stopped at: Completed 22-01-PLAN.md (deployment documentation)
Resume file: None
Next action: Execute 22-02-PLAN.md (GitHub push and production verification)
