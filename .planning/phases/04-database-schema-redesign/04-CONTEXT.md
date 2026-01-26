# Phase 4: Database Schema Redesign - Context

**Gathered:** 2026-01-20
**Status:** Ready for research

<vision>
## How This Should Work

The database is **location-centric**. Users open the website and see hundreds of map locations rendered from real database data. Everything revolves around locations — videos, suggestions, and reminders all connect back to places on the map.

**Locations** are stored in the database and rendered on the map. Each location can be marked as visited or not-yet-visited. When a user clicks a visited location pin, they see YouTube video links (up to 3) that feature that place.

**YouTube videos** exist in their own table and connect to locations via a many-to-many relationship. A location can have up to 3 linked videos, and the same video can be linked to multiple locations (e.g., a vlog covering several spots).

**Suggestions vs Reminders** are cleanly separated:
- **Suggestions**: New location ideas from users (places not yet in the locations table). Include the Google Maps link if provided. Manually reviewed — if approved, the admin creates the location entry. Built to potentially support auto-creation later.
- **Reminders**: Users reminding the creator to visit an *existing* not-yet-visited location. Purely for data/engagement tracking — "people want me to go here."

**Spam prevention** happens at the database level via counting tables:
- Users limited to **3 reminders per month**
- Users limited to **1 new location suggestion per month**

</vision>

<essential>
## What Must Be Nailed

- **Location storage** — Locations stored in DB, rendered on map from real data
- **Suggestion/reminder separation** — Clean distinction for querying and management
- **Spam limits enforced in DB** — Counting tables prevent abuse without relying on JS
- **Video-location linking** — Up to 3 videos per location, same video can link to multiple locations

</essential>

<specifics>
## Specific Ideas

- Counting tables for rate limiting (not JS-based validation)
- Google Maps URL saved when users submit suggestions
- Suggestions table rebuilt with clear type distinction (new location vs reminder)
- Admin workflow: view suggestions → manually create location → optionally link or delete suggestion
- Monthly limits: 3 reminders/month, 1 suggestion/month per user
- Many-to-many relationship between videos and locations (max 3 videos per location)

</specifics>

<notes>
## Additional Context

The current suggestion system needs a full rebuild to support the distinction between "suggest a new place" and "remind me to visit an existing place."

The admin panel (Phase 5) will need to work with this schema for content management, so the design should anticipate those workflows.

Rate limiting via DB counting is preferred over application-level limits for reliability and simplicity.

</notes>

---

*Phase: 04-database-schema-redesign*
*Context gathered: 2026-01-20*
