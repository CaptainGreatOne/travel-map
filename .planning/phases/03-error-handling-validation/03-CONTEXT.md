# Phase 3: Error Handling & Validation - Context

**Gathered:** 2026-01-19
**Status:** Ready for planning

<vision>
## How This Should Work

When errors occur, the app continues functioning as much as possible without the failed functionality. If something breaks that affects the user, they get a simple, polite message declaring there's a problem — matter-of-fact and helpful, not scary or apologetic.

The map is the core experience and takes priority. If the map has issues (loading styles, pins, etc.), a kind error message appears explaining the issue. Users shouldn't see half-loaded or broken visual states.

For things like login failures or suggestion submissions failing, clear messages explain what happened. But the philosophy is: users either refresh and resume their session, or they don't. No retry buttons or complex error recovery flows.

</vision>

<essential>
## What Must Be Nailed

- **App never crashes to white screen** — Error boundaries catch everything, graceful degradation everywhere
- **Map takes priority** — As the core experience, map-related errors get the most careful handling
- **No indefinite loading** — Always have timeouts, never leave users waiting forever with a spinner
- **Forms validate clearly** — Bad input caught before submission with clear feedback
- **Network issues handled gracefully** — Flaky connections don't break the experience

</essential>

<specifics>
## Specific Ideas

- Matter-of-fact, helpful error messages ("Couldn't load the map. Try refreshing the page.")
- No retry buttons — if something fails, users refresh the page or move on
- Never show poorly loaded/half-rendered visual states
- User submissions (suggestions) can fail, but the map viewing experience must stay solid

</specifics>

<notes>
## Additional Context

The map is what viewers come for — it's the companion to the YouTube channel. Everything else (suggestions, login, etc.) is secondary. Error handling should reflect this priority: protect the map experience above all.

</notes>

---

*Phase: 03-error-handling-validation*
*Context gathered: 2026-01-19*
