# Project: Travel Map

## Core Value

**Interactive companion app for a travel vlog YouTube channel** — transforms Google Maps location lists into an engaging viewer experience where audiences can explore visited/planned destinations, suggest locations, and connect videos to real-world places.

## What We're Building

A web application that serves as an extension of a YouTube travel vlog channel:

- **Interactive Map**: Display locations from Google Maps with visited/not-visited status
- **YouTube Integration**: Link locations to their featured videos
- **Community Features**: Viewers can suggest new locations and remind creator to visit existing ones
- **Photo Gallery**: Showcase additional photos that didn't make it into videos (potential Instagram integration)
- **Engaging UI**: Stand out from typical travel content with polished, interactive experience

## Current State

The application is **production-ready** after v1.0 MVP and v1.1 Core Enhancements:

### Tech Stack
- React 19.2.3 + Vite 7.2.4
- Leaflet for mapping with react-leaflet-cluster
- Supabase for auth and database
- React Router for navigation
- Tailwind CSS for styling
- Vitest for testing

### Architecture
- Component-based SPA (<150 lines per component)
- Context API for auth
- Service layer for Supabase (locationService, suggestionService, adminService)
- Custom hooks (useMapFilters, useAuth)
- Error boundaries for graceful failure

### v1.1 Shipped Features
| Feature | Status |
|---------|--------|
| Tailwind CSS architecture | ✅ Replaced 190+ inline styles |
| Component decomposition | ✅ All components <150 lines |
| Error boundaries & validation | ✅ Full coverage |
| Database schema with RLS | ✅ Production-ready |
| Admin panel | ✅ Full CRUD + moderation |
| Country tracking | ✅ 75+ country mappings |
| Security hardening | ✅ URL validation + sanitization |
| Map performance | ✅ Clustering for 600+ pins |
| User search/filter | ✅ Name + country filtering |

## Non-Goals

- Complete rebuild (architecture is sound)
- Mobile native apps (web-first for now)
- Real-time collaboration features
- Monetization/payment systems

## Constraints

- **Existing codebase**: Must refactor incrementally, not rewrite
- **Solo developer**: Learning experience is part of the value
- **YouTube integration**: Locations must link to video content
- **Viewer-friendly**: Non-technical users must find it intuitive

## Key Decisions

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1 | Refactor over rebuild | Architecture is 85-90% aligned with needs; saves 100+ hours | 2026-01-15 |
| 2 | Keep Supabase | Already integrated, handles auth + database well | 2026-01-15 |
| 3 | Keep Leaflet | Mapping already works, no reason to change | 2026-01-15 |

## Success Criteria

- [x] Responsive design works on mobile and desktop — v1.0
- [x] Components under 150 lines each — v1.0
- [x] Proper CSS architecture (not inline styles) — v1.0
- [x] Error boundaries prevent full app crashes — v1.0
- [x] Loading states provide feedback — v1.0
- [x] YouTube video links functional — v1.0
- [x] Photo gallery works — v1.0
- [x] Location suggestions can be submitted — v1.0
- [x] Country tracking for locations — v1.1
- [x] Admin search/sort/filter — v1.1
- [x] Security hardening (XSS, URL validation) — v1.1
- [x] Map performance for 600+ pins — v1.1
- [x] User-facing search and country filter — v1.1

## References

- YouTube channel: [To be linked]
- Google Maps list: Source of location data
- Supabase project: Backend services
