# Roadmap: Travel Map

## Overview

Transform an existing functional but messy travel map application into a polished, maintainable YouTube channel companion. The journey goes from cleaning up technical debt (styling, components, error handling) through database redesign and admin features, to enhanced location suggestions and comprehensive testing.

## Domain Expertise

None (general React/Supabase web application)

## Milestones

- ✅ **v1.0 MVP** - Phases 1-7 (shipped 2026-01-23)
- 🚧 **v1.1 Core Enhancements** - Phases 8-13 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Styling Infrastructure** - Extract inline styles, add responsive design
- [x] **Phase 2: Component Decomposition** - Break apart large components into maintainable pieces
- [x] **Phase 3: Error Handling & Validation** - Add error boundaries, form validation, retry logic
- [x] **Phase 4: Database Schema Redesign** - Flesh out tables, relationships, migrations
- [x] **Phase 5: Admin Panel** - Admin page with metrics, content management, moderation
- [x] **Phase 6: Location Suggestions** - Improve Google Maps URL parsing and suggestion flow
- [ ] **Phase 7: Testing & Polish** - Test suite, loading states, placeholder replacement

## Phase Details

### Phase 1: Styling Infrastructure
**Goal**: Replace 190+ inline styles with proper CSS architecture, add responsive design
**Depends on**: Nothing (first phase)
**Research**: Complete (chose Tailwind CSS)
**Plans**: 5 plans in 3 waves

Plans:
- [x] 01-01: Tailwind setup + design tokens (Wave 1)
- [x] 01-02: Sidebar + navigation components (Wave 2)
- [x] 01-03: Modal + form components (Wave 2)
- [x] 01-04: Page layouts + photo components (Wave 2)
- [x] 01-05: Responsive design + verification (Wave 3)

### Phase 2: Component Decomposition
**Goal**: Break large components (MapPage 354 lines, SuggestPage 218 lines) into smaller, focused pieces
**Depends on**: Phase 1
**Research**: None (internal refactoring using established React patterns)
**Plans**: 5 plans in 3 waves

Plans:
- [x] 02-01: Extract MapPage pieces (hook, popup, config) (Wave 1)
- [x] 02-02: Extract SuggestPage pieces (AuthPrompt, URL parser) (Wave 1)
- [x] 02-03: Refactor MapPage to use extractions (Wave 2)
- [x] 02-04: Refactor SuggestPage to use extractions (Wave 2)
- [x] 02-05: Verify component sizes + human approval (Wave 3)

Key work:
- Extract useMapFilters hook from MapPage
- Extract MarkerPopup component from MapPage
- Extract AuthPrompt component from SuggestPage
- Extract parseGoogleMapsUrl utility
- Target: no component over 150 lines

### Phase 3: Error Handling & Validation
**Goal**: Add error boundaries, form validation, and graceful error recovery
**Depends on**: Phase 2
**Research**: Unlikely (standard patterns: React Error Boundaries, Zod)
**Plans**: 4 plans

Plans:
- [x] 03-01: Error boundaries (ErrorBoundary, MapErrorBoundary)
- [x] 03-02: Loading states and timeout handling
- [x] 03-03: Form validation with inline errors
- [x] 03-04: Verification

Key work:
- Create ErrorBoundary component
- Add Zod schemas for form validation
- Implement retry logic for network failures
- Add user-friendly error messages
- Fix fragile URL parsing with proper fallbacks

### Phase 4: Database Schema Redesign
**Goal**: Flesh out Supabase tables, data relationships, and security policies
**Depends on**: Phase 3
**Research**: Complete
**Plans**: TBD

Plans:
- [x] 04-01: Core tables (locations, categories, videos, location_videos)
- [x] 04-02: Suggestions, reminders, and rate limiting infrastructure
- [x] 04-03: Service layer integration (locationService, suggestionService, MapPage)
- [x] 04-04: Seed data and verification

Key work:
- Core tables: categories, locations, videos, location_videos
- Suggestions and reminders tables with rate limiting
- Trigger functions for monthly limits (1 suggestion, 3 reminders)
- RLS policies for public read and authenticated insert

### Phase 5: Admin Panel
**Goal**: Create admin page for content management, metrics viewing, and moderation
**Depends on**: Phase 4
**Research**: Unlikely (internal UI using existing patterns)
**Plans**: 5 plans

Plans:
- [x] 05-01: Admin foundation (AdminGuard, adminService)
- [x] 05-02: Admin dashboard and layout
- [x] 05-03: Location management UI
- [x] 05-04: Suggestion moderation and video management UI
- [x] 05-05: Final admin panel enhancements

Key work:
- Admin authentication/authorization
- Dashboard with key metrics (suggestions, votes, visitors)
- Location management (add, edit, delete, link to videos)
- Suggestion moderation (approve, reject, flag)
- Content editing capabilities

### Phase 6: Location Suggestions
**Goal**: Improve the location suggestion flow with better Google Maps URL parsing
**Depends on**: Phase 5
**Research**: Likely (external URL structure)
**Research topics**: Google Maps URL structure, coordinate extraction patterns
**Plans**: TBD

Key work:
- Robust Google Maps URL parsing (various URL formats)
- Better UX for suggestion submission
- Validation feedback for users
- Integration with database schema from Phase 4

### Phase 7: Testing & Polish
**Goal**: Add test coverage and finish incomplete features
**Depends on**: Phase 6
**Research**: Unlikely (Vitest well-documented)
**Plans**: 4 plans in 3 waves

Plans:
- [x] 07-01: Validation TDD (Wave 1) - TDD tests for validation utilities
- [ ] 07-02: Placeholder replacement (Wave 1) - Update AboutPage with real content (skipped by user)
- [x] 07-03: Hook tests (Wave 2) - React Testing Library for useMapFilters
- [x] 07-04: Final verification (Wave 3) - Cross-browser testing and sign-off

Key work:
- TDD for validation utilities (building on Vitest setup from 06-02)
- React Testing Library for hook testing
- Replace placeholder content (YouTube ID, stats)
- Cross-browser testing
- Full application walkthrough

---

### 🚧 v1.1 Core Enhancements (In Progress)

**Milestone Goal:** Enhance admin UX, add country tracking, improve video-location linking, harden security, and optimize map performance for 600+ pins.

#### Phase 8: Country Field
**Goal**: Add country column to locations table, update suggestion forms to extract and display country from Google Maps
**Depends on**: Phase 7
**Research**: Unlikely (database migration + form updates using established patterns)
**Plans**: 3 plans

Plans:
- [x] 08-01: Country field infrastructure (migration + parser)
- [x] 08-02: Admin integration (LocationManager)
- [x] 08-03: Form integration (SuggestForm, LocationSuggestionForm)

#### Phase 9: Admin Search & Sort
**Goal**: Add sortable columns (name, date), searchbar, and category/country filtering to admin location list
**Depends on**: Phase 8
**Research**: Unlikely (React table patterns, existing Tailwind styling)
**Plans**: 1 plan

Plans:
- [x] 09-01: Search, category filter, and sortable columns

#### Phase 10: Video-Location UX
**Goal**: Searchable dropdown for video-location linking, multi-select, visited-only filter, display video links on map popups
**Depends on**: Phase 9
**Research**: Unlikely (React select patterns, existing component structure)
**Plans**: 2 plans in 2 waves

Plans:
- [x] 10-01: SearchableLocationSelect component (Wave 1)
- [x] 10-02: Batch operations and map popup videos (Wave 2)

#### Phase 11: Security Hardening
**Goal**: XSS protection, SQL injection prevention, URL validation for Google Maps inputs
**Depends on**: Phase 10
**Research**: Likely (security best practices, DOMPurify or similar)
**Research topics**: XSS sanitization libraries, Supabase parameterized queries verification, URL validation patterns
**Plans**: TBD

Plans:
- [x] 11-01: Security utilities (URL validation, content sanitization) (Wave 1)
- [x] 11-02: Form integration and SQL audit (Wave 2)

#### Phase 12: Map Performance
**Goal**: Handle 600+ pins efficiently with clustering, click-away to close popup
**Depends on**: Phase 11
**Research**: Likely (Leaflet clustering plugins)
**Research topics**: react-leaflet-cluster or Leaflet.markercluster integration, performance benchmarks
**Plans**: TBD

Plans:
- [ ] 12-01: Marker clustering and click-away popup (Wave 1)

#### Phase 13: User Map Search
**Goal**: Add search functionality for all users to filter map pins by country and location name
**Depends on**: Phase 12
**Research**: Unlikely (search/filter using existing patterns)
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → ... → 13

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Styling Infrastructure | v1.0 | 5/5 | Complete | 2026-01-17 |
| 2. Component Decomposition | v1.0 | 5/5 | Complete | 2026-01-18 |
| 3. Error Handling & Validation | v1.0 | 4/4 | Complete | 2026-01-19 |
| 4. Database Schema Redesign | v1.0 | 4/4 | Complete | 2026-01-21 |
| 5. Admin Panel | v1.0 | 5/5 | Complete | 2026-01-22 |
| 6. Location Suggestions | v1.0 | 3/3 | Complete | 2026-01-23 |
| 7. Testing & Polish | v1.0 | 4/4 | Complete | 2026-01-23 |
| 8. Country Field | v1.1 | 3/3 | Complete | 2026-01-26 |
| 9. Admin Search & Sort | v1.1 | 1/1 | Complete | 2026-01-28 |
| 10. Video-Location UX | v1.1 | 2/2 | Complete | 2026-01-29 |
| 11. Security Hardening | v1.1 | 2/2 | Complete | 2026-01-29 |
| 12. Map Performance | v1.1 | 0/1 | Not started | - |
| 13. User Map Search | v1.1 | 0/? | Not started | - |

## v1.0 MVP Complete

All 7 phases executed successfully on 2026-01-23.

**v1.0 Stats:**
- 29 plans executed
- 69 automated tests
- ~110 minutes total execution time
