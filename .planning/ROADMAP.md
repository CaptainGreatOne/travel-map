# Roadmap: Travel Map

## Overview

Transform an existing functional but messy travel map application into a polished, maintainable YouTube channel companion. The journey goes from cleaning up technical debt (styling, components, error handling) through database redesign and admin features, to enhanced location suggestions and comprehensive testing.

## Domain Expertise

None (general React/Supabase web application)

## Milestones

- ✅ **v1.0 MVP** - Phases 1-7 (shipped 2026-01-23)
- ✅ **v1.1 Core Enhancements** - Phases 8-13 (shipped 2026-01-29) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v1.2 Content & Sharing** - Phases 14-19 (shipped 2026-02-01) — [Archive](milestones/v1.2-ROADMAP.md)
- 🚧 **v1.3 Production Ready** - Phases 20-26 (in progress)

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

### 🚧 v1.3 Production Ready (In Progress)

**Milestone Goal:** Simplify suggestion flow, enhance admin capabilities, add full site customization, prepare for production deployment

#### Phase 20: Suggestion Form Simplification

**Goal**: Require Google Maps URL, remove manual location naming, streamline submission flow
**Depends on**: Phase 19
**Research**: Unlikely (internal patterns)
**Plans**: TBD

Key work:
- Make Google Maps URL required field
- Auto-fill location name from URL (non-editable)
- Display extracted info (name, country, coordinates)
- Keep "why should I visit" textarea
- Remove ability to manually rename location

#### Phase 21: Social Media & About Improvements

**Goal**: Fix Instagram widget options, accept full YouTube URLs, dynamic social media buttons, fix location count
**Depends on**: Phase 20
**Research**: Unlikely (internal patterns)
**Plans**: TBD

Key work:
- Remove third-party Instagram widget option, keep button or API
- YouTube video URL field accepts full URLs (not just video IDs)
- Dynamic social media buttons: list of platforms, admin fills URLs, auto-generates buttons
- Fix dynamic location count bug

#### Phase 22: Website Customization CMS

**Goal**: Full admin control over site branding, colors, and headers
**Depends on**: Phase 21
**Research**: Unlikely (CSS variables, internal patterns)
**Plans**: TBD

Key work:
- Admin can set color combinations (primary, secondary, accent)
- Admin can edit website header and subheader
- Admin can edit page headers
- Changes apply site-wide via CSS variables or Tailwind config

#### Phase 23: Menu & UX Polish

**Goal**: Reorganize navigation, address remaining TODOs
**Depends on**: Phase 22
**Research**: None
**Plans**: TBD

Key work:
- Move "Suggest Location" menu item immediately below "Map View"
- Fix TODO: MapPage.jsx:61 location loading failure handling
- Any other minor UX improvements

#### Phase 24: Mass Location Import

**Goal**: Allow admin to bulk import locations
**Depends on**: Phase 23
**Research**: Likely (Google Maps export limitations)
**Research topics**: Google Maps list export options, KML/JSON parsing, Google My Maps integration
**Plans**: TBD

Key work:
- Research Google Maps export capabilities
- Support JSON/KML/XML file upload
- File validation and parsing
- Preview list before import with edit capability
- Batch insert to database

#### Phase 25: Location Popup Enhancement

**Goal**: Fetch location info/images from Google Maps API with graceful fallback
**Depends on**: Phase 24
**Research**: Likely (Google Places API)
**Research topics**: Places API setup, usage limits, photo references, fallback strategies
**Plans**: TBD

Key work:
- Google Places API integration
- Fetch place details (photos, description, rating)
- Display in popup with current content as fallback
- Handle API failures gracefully

#### Phase 26: Deployment Preparation

**Goal**: Prepare application for production deployment
**Depends on**: Phase 25
**Research**: Unlikely (standard deployment patterns)
**Plans**: TBD

Key work:
- Push to GitHub repository
- Write comprehensive README with installation instructions
- Docker containerization (Dockerfile, docker-compose)
- Create Supabase SQL deployment/seed file
- Environment variable documentation
- Production build verification

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → ... → 26

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
| 20. Suggestion Form Simplification | v1.3 | 1/1 | Complete | 2026-02-01 |
| 21. Social Media & About Improvements | v1.3 | 1/1 | Complete | 2026-02-03 |
| 22. Website Customization CMS | v1.3 | 0/? | Not started | - |
| 23. Menu & UX Polish | v1.3 | 0/? | Not started | - |
| 24. Mass Location Import | v1.3 | 0/? | Not started | - |
| 25. Location Popup Enhancement | v1.3 | 0/? | Not started | - |
| 26. Deployment Preparation | v1.3 | 0/? | Not started | - |

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
