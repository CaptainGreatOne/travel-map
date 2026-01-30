# Phase 16: Photography Page CMS - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<vision>
## How This Should Work

Admin can manage photos displayed on the Photography page through a simple interface:

1. **Upload photos** — Select and upload images from local device
2. **View list** — See all uploaded photos in a list view
3. **Reorder** — Use up/down buttons to change display order
4. **Delete** — Remove photos that are no longer needed

Photos are stored in Supabase Storage (already in the stack). The Photography page displays photos in the order set by admin.

</vision>

<essential>
## What Must Be Nailed

- **Simple upload** — Easy to add new photos without technical knowledge
- **Clear ordering** — Admin can control exactly which photos appear first
- **Reliable storage** — Photos persist and load reliably from Supabase Storage

</essential>

<specifics>
## Specific Ideas

- Simple upload list (not drag-and-drop grid)
- Up/down buttons for reordering
- Basic management UI in admin panel
- Supabase Storage buckets for image storage

</specifics>

<notes>
## Additional Context

Phase 15 (Enhanced Location Popup with Google Static Maps) is deferred pending API access setup. Proceeding with Phase 16 instead.

Storage decision: Supabase Storage is already part of the stack, avoiding new external dependencies.

</notes>

---

*Phase: 16-photography-page-cms*
*Context gathered: 2026-01-30*
