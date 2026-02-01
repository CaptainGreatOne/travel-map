# Roadmap: Travel Map

## Overview

Transform an existing functional but messy travel map application into a polished, maintainable YouTube channel companion. The journey goes from cleaning up technical debt (styling, components, error handling) through database redesign and admin features, to enhanced location suggestions and comprehensive testing.

## Domain Expertise

None (general React/Supabase web application)

## Milestones

- ✅ **v1.0 MVP** - Phases 1-7 (shipped 2026-01-23)
- ✅ **v1.1 Core Enhancements** - Phases 8-13 (shipped 2026-01-29) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v1.2 Content & Sharing** - Phases 14-19 (shipped 2026-02-01) — [Archive](milestones/v1.2-ROADMAP.md)

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

<details>
<summary>✅ v1.1 Core Enhancements (Phases 8-13) — SHIPPED 2026-01-29</summary>

- [x] Phase 8: Country Field (3/3 plans) — completed 2026-01-26
- [x] Phase 9: Admin Search & Sort (1/1 plan) — completed 2026-01-28
- [x] Phase 10: Video-Location UX (2/2 plans) — completed 2026-01-29
- [x] Phase 11: Security Hardening (2/2 plans) — completed 2026-01-29
- [x] Phase 12: Map Performance (1/1 plan) — completed 2026-01-29
- [x] Phase 13: User Map Search (1/1 plan) — completed 2026-01-29

See [v1.1 Archive](milestones/v1.1-ROADMAP.md) for full details.

</details>

---

<details>
<summary>✅ v1.2 Content & Sharing (Phases 14-19) — SHIPPED 2026-02-01</summary>

- [x] Phase 14: Shareable Location URLs (1/1 plan) — completed 2026-01-30
- [ ] Phase 15: Enhanced Location Popup (DEFERRED) — pending Google Cloud API
- [x] Phase 16: Photography Page CMS (3/3 plans) — completed 2026-01-31
- [x] Phase 17: About Page CMS (2/2 plans) — completed 2026-01-31
- [x] Phase 18: Dynamic Stats (2/2 plans) — completed 2026-01-31
- [x] Phase 19: Instagram Feed Integration (2/2 plans) — completed 2026-01-31

See [v1.2 Archive](milestones/v1.2-ROADMAP.md) for full details.

</details>

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
| 12. Map Performance | v1.1 | 1/1 | Complete | 2026-01-29 |
| 13. User Map Search | v1.1 | 1/1 | Complete | 2026-01-29 |
| 14. Shareable Location URLs | v1.2 | 1/1 | Complete | 2026-01-30 |
| 15. Enhanced Location Popup | v1.2 | 0/? | Deferred | - |
| 16. Photography Page CMS | v1.2 | 3/3 | Complete | 2026-01-31 |
| 17. About Page CMS | v1.2 | 2/2 | Complete | 2026-01-31 |
| 18. Dynamic Stats | v1.2 | 2/2 | Complete | 2026-01-31 |
| 19. Instagram Feed Integration | v1.2 | 2/2 | Complete | 2026-01-31 |

## v1.0 MVP Complete

All 7 phases executed successfully on 2026-01-23.

**v1.0 Stats:**
- 29 plans executed
- 69 automated tests
- ~110 minutes total execution time

## v1.1 Core Enhancements Complete

All 6 phases executed successfully on 2026-01-29.

**v1.1 Stats:**
- 10 plans executed
- 4 days (2026-01-26 → 2026-01-29)
- Country tracking, admin UX, security, performance

## v1.2 Content & Sharing Complete

All 5 active phases executed successfully on 2026-02-01 (Phase 15 deferred).

**v1.2 Stats:**
- 10 plans executed
- 5 days (2026-01-26 → 2026-01-31)
- 43 files changed, +4,429 lines
- Shareable URLs, photography CMS, about CMS, dynamic stats, Instagram feed
