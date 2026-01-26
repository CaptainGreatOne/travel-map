# Phase 6: Location Suggestions - Context

**Gathered:** 2026-01-22
**Status:** Ready for research

<vision>
## How This Should Work

When a viewer wants to suggest a location, they paste a Google Maps URL and the app just handles it — any format, any link type. Short URLs (maps.app.goo.gl), full URLs, search results, place pages — all of them should work.

Once they paste, they immediately see a preview showing what was parsed: the location name and coordinates appear right away so they know it worked. If something's off, clear feedback explains what's wrong and how to fix it.

The experience should feel effortless. Paste a link, see it recognized, hit submit. No confusion, no guessing whether it worked.

</vision>

<essential>
## What Must Be Nailed

- **It just works** — Any Google Maps link someone pastes should parse correctly. This is the non-negotiable. Users shouldn't need to know which URL format to use.
- **Instant visual feedback** — Show parsed location name and coordinates immediately so users know the link was recognized
- **Graceful failures** — When something can't be parsed, explain why and suggest what to try

</essential>

<specifics>
## Specific Ideas

- Short URLs (maps.app.goo.gl, goo.gl/maps) currently fail — must fix
- Sometimes can't extract the place name even when coordinates work
- Preview should appear as soon as a valid URL is detected
- Validation should feel helpful, not like an error wall

</specifics>

<notes>
## Additional Context

The roadmap notes this phase likely needs research into Google Maps URL structures. Multiple URL formats exist and they change over time.

Current pain points are specifically around short URLs failing and missing location info extraction. The overall goal is making it "smoother" — friction-free.

</notes>

---

*Phase: 06-location-suggestions*
*Context gathered: 2026-01-22*
