# External Integrations

**Analysis Date:** 2026-01-14

## APIs & External Services

**Backend-as-a-Service:**
- Supabase - Backend, database, and authentication
  - SDK/Client: @supabase/supabase-js 2.90.1 (`src/utils/supabaseClient.js`)
  - Auth: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
  - Instance: Configured via environment variables

**Payment Processing:**
- Not detected

**Email/SMS:**
- Not detected

**External APIs:**
- Google Maps URL parsing - Extracts location names from shared links (`src/pages/SuggestPage.jsx`)
  - Pattern: `https://maps.app.goo.gl/` and `https://www.google.com/maps/place/`
  - Integration method: Client-side URL parsing with regex

## Data Storage

**Databases:**
- Supabase PostgreSQL - Primary data store
  - Connection: via `supabaseClient.js` with env vars
  - Client: @supabase/supabase-js
  - Tables Used:
    - `location_suggestions` - User-submitted location suggestions

**File Storage:**
- Not detected (no file upload functionality)

**Caching:**
- Not detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password authentication
  - Implementation: `src/contexts/AuthContext.jsx`
  - Token storage: Managed by Supabase client
  - Session management: `supabase.auth.getSession()`, `onAuthStateChange()`

**Methods:**
- `signUp(email, password)` - User registration
- `signIn(email, password)` - User login
- `signOut()` - User logout

**OAuth Integrations:**
- Not detected

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, LogRocket, etc.)

**Analytics:**
- Not detected

**Logs:**
- Console logging only (development)

## CI/CD & Deployment

**Hosting:**
- Not configured (static site ready)
- Compatible with: Vercel, Netlify, GitHub Pages

**CI Pipeline:**
- Not configured (no GitHub Actions, etc.)

## Environment Configuration

**Development:**
- Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Secrets location: `.env.local` (gitignored)
- No `.env.example` template (should be created)

**Staging:**
- Not configured

**Production:**
- Same env vars required
- Static site deployment

## Map Tile Providers

**OpenStreetMap:**
- Standard tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

**Stadia Maps (Stamen):**
- Terrain: `https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png`
- Watercolor: `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg`

**Esri ArcGIS:**
- Satellite: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`

**CARTO:**
- Dark Mode: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`

## CDN Resources

**Leaflet:**
- CSS: leaflet/dist/leaflet.css (npm package)
- Marker icons: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/`
- Custom markers: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/`

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-01-14*
*Update when adding/removing external services*
