# Phase 14: Shareable Location URLs - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<vision>
## How This Should Work

Users can share a specific location with anyone via a URL. The ideal experience has two complementary approaches:

1. **Browser URL updates** as users browse the map — clicking a marker updates the URL to something like `/map?location=paris-tower`. Users can copy directly from the address bar.

2. **Share button in popup** — a small icon in the popup corner that copies the link with one click.

When someone opens a shared link, the map immediately zooms to that location with the popup already open, ready to explore. No extra clicks needed — they land directly on the location info.

</vision>

<essential>
## What Must Be Nailed

- **Works instantly** — Link opens and immediately shows the location with no loading confusion
- **Popup visible** — The location info is front and center when link is opened
- **Easy to share** — Getting the link should be obvious and quick

All three are equally important. The feature should feel seamless from both the sharer's and receiver's perspective.

</essential>

<specifics>
## Specific Ideas

- Share button as a simple icon in the popup corner (not a text button)
- Icon copies link to clipboard on click
- Both approaches preferred (URL updates + share button) if implementation doesn't clutter the popup or break the app

</specifics>

<notes>
## Additional Context

User preference for minimal UI impact — the share functionality should integrate cleanly without cluttering the existing popup design. Implementation should be additive, not disruptive to current map behavior.

</notes>

---

*Phase: 14-shareable-location-urls*
*Context gathered: 2026-01-30*
