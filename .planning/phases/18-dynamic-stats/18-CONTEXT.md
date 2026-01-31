# Phase 18: Dynamic Stats - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<vision>
## How This Should Work

The About page displays full creator stats: locations visited, videos posted, countries explored, and potentially subscriber count. These numbers are real — pulled from the database and YouTube API — not hardcoded placeholders.

Stats update automatically (every 12-24 hours) via API calls, with the results cached in the database. The database serves as both storage and fallback — if the YouTube API is unavailable, the most recent cached values display instead.

The admin About page includes fields to manually update stats as a backup or override option.

</vision>

<essential>
## What Must Be Nailed

- **Real data, not placeholders** - Stats must reflect actual database/API data
- **Database as fallback** - Most recent API data stored in about table, used when API unavailable
- **Periodic refresh** - Stats update automatically (12-24 hour cycle), not on every page load
- **Manual override** - Admin can manually update stat fields from the About editor

</essential>

<specifics>
## Specific Ideas

- Build as if YouTube API key exists — ready to plug in when available
- Add manual input fields to admin About page for each stat
- Location count from database (simple count query)
- Video count from YouTube Data API (with DB fallback)
- Countries visited count from database
- Subscriber count if YouTube API supports it

</specifics>

<notes>
## Additional Context

User doesn't have the YouTube channel or API key yet. Implementation should:
1. Support the full YouTube API integration path
2. Provide admin manual entry as the primary input method initially
3. Store everything in the about table for persistence and fallback

Priority: Get the data model and admin UI working first. YouTube API integration can be activated later when credentials are available.

</notes>

---

*Phase: 18-dynamic-stats*
*Context gathered: 2026-01-31*
