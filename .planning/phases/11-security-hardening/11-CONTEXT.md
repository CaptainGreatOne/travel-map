# Phase 11: Security Hardening - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<vision>
## How This Should Work

Security should be mostly invisible to users. Bad data simply doesn't get through — no feedback to potential attackers about what failed or why.

The one exception is Google Maps URL validation: when a user submits an invalid URL in the suggestion form, show them a clear message that the URL is invalid. This helps legitimate users who made a mistake, and URL format validation isn't sensitive security information.

For everything else (XSS, SQL injection, content sanitization), protection happens silently in the background.

</vision>

<essential>
## What Must Be Nailed

- **XSS protection** - Sanitize all user-submitted content (location suggestions, reminder messages)
- **SQL injection prevention** - Verify Supabase queries are parameterized, no string concatenation
- **URL validation** - Validate Google Maps URLs before processing, reject non-Google domains

All three are equally critical — this is foundational security work.

</essential>

<specifics>
## Specific Ideas

- Google Maps URL validation: Show user-friendly "Invalid URL" message
- All other security: Silent rejection, no feedback to user
- Don't give hackers information about what security measures are in place

</specifics>

<notes>
## Additional Context

This is a public-facing app where users can submit location suggestions and reminder messages. User input flows through:
- SuggestForm / LocationSuggestionForm (Google Maps URLs, messages)
- Reminder messages on map popups
- Admin forms for location/video management (trusted users, but still validate)

</notes>

---

*Phase: 11-security-hardening*
*Context gathered: 2026-01-29*
