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

The application is **functional but needs refactoring**:

### Tech Stack (Solid)
- React 19.2.3 + Vite 7.2.4
- Leaflet for mapping
- Supabase for auth and database
- React Router for navigation

### Architecture (Correct)
- Component-based SPA
- Context API for auth
- Service layer for Supabase
- Route-based page organization

### Issues (Need Fixing)
| Problem | Impact |
|---------|--------|
| 190+ inline styles | No responsive design, no theming |
| Large components (MapPage 461 lines) | Hard to maintain |
| Zero tests | Can't safely refactor |
| Missing error handling | App crashes on errors |
| Placeholder content | YouTube ID, Instagram handle not set |

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

- [ ] Responsive design works on mobile and desktop
- [ ] Components under 150 lines each
- [ ] Proper CSS architecture (not inline styles)
- [ ] Error boundaries prevent full app crashes
- [ ] Loading states provide feedback
- [ ] YouTube video links functional
- [ ] Photo gallery works
- [ ] Location suggestions can be submitted

## References

- YouTube channel: [To be linked]
- Google Maps list: Source of location data
- Supabase project: Backend services
