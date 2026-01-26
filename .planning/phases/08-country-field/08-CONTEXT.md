# Phase 8: Country Field - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<vision>
## How This Should Work

When users paste a Google Maps URL (in the suggestion form or admin), the country is automatically extracted and displayed alongside the location name. Country code is valued for ease of use.

The country field enables better organization across the app:
- **Admin side**: Filter and sort the location list by country for efficient management
- **Map side**: Eventually helps with clustering - when many locations are in one area, they can be grouped rather than overlapping

The extraction should be seamless - users paste a URL, country appears automatically without manual entry.

</vision>

<essential>
## What Must Be Nailed

- **Auto-extraction accuracy** - Country must be reliably pulled from Google Maps URLs without requiring manual input
- **Admin filtering/sorting** - Admin needs to filter and sort the locations list by country efficiently

</essential>

<specifics>
## Specific Ideas

- Country code (e.g., "US", "JP") is valued for compact display
- Pin clustering will be addressed in Phase 12 (Map Performance), but country data enables future grouping options
- Number badge style clustering preferred over flags or generic dots (for Phase 12)
- Country should be visible when browsing locations to help distinguish between similarly-named places

</specifics>

<notes>
## Additional Context

The main concern with maps is pins rendering on top of each other when locations are clustered. Country data supports future clustering work but the visual clustering itself is Phase 12 scope.

Priority is reliable extraction + admin workflow. User-facing filtering can follow.

</notes>

---

*Phase: 08-country-field*
*Context gathered: 2026-01-24*
