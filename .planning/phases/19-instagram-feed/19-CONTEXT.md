# Phase 19: Instagram Feed Integration - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<vision>
## How This Should Work

The About page displays an Instagram feed widget showing recent posts in a grid or carousel format. Users can see the most recent Instagram photos and click through to the Instagram profile.

The profile link behavior is platform-aware:
- Desktop: Opens Instagram profile in a new browser tab
- Mobile: Opens the Instagram app if installed, otherwise falls back to browser

Two implementation paths available with an admin toggle to switch between them:
1. Official Instagram embed (for when API access is available)
2. Third-party widget (works without API setup)

</vision>

<essential>
## What Must Be Nailed

- **Visual feed display** - Recent Instagram posts shown in grid/carousel on About page
- **Profile link** - Clear way to jump to Instagram profile with smart mobile/desktop behavior
- **Dual implementation** - Both official embed and third-party widget options
- **Admin toggle** - Switch between embed types from admin panel

</essential>

<specifics>
## Specific Ideas

- Build both widget types, admin can toggle which one is active
- Third-party options: SnapWidget, Elfsight, LightWidget (no API required)
- Official embed: Instagram oEmbed or Basic Display API (requires Meta developer setup)
- Instagram handle stored in about_content table (already has instagram_url)
- Smart link behavior: `instagram://user?username=X` for app, fallback to web URL

</specifics>

<notes>
## Additional Context

User doesn't have Instagram creator account yet. Implementation should:
1. Work immediately with third-party widget (no API needed)
2. Be ready to switch to official embed when account/API is available
3. Admin toggle in About editor to switch between modes

Priority: Get third-party widget working first as the default, official embed as future option.

</notes>

---

*Phase: 19-instagram-feed*
*Context gathered: 2026-01-31*
