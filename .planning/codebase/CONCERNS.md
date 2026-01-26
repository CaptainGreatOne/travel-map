# Codebase Concerns

**Analysis Date:** 2026-01-14

## Tech Debt

**Massive Component Files:**
- Issue: Large monolithic components that handle too many responsibilities
- Files: `src/pages/MapPage.jsx` (461 lines), `src/pages/SuggestPage.jsx` (376 lines)
- Why: Rapid prototyping without refactoring
- Impact: Hard to maintain, test, and understand
- Fix approach: Extract filters, map logic, and layout into separate components

**Excessive Inline Styles:**
- Issue: 190+ instances of `style={{...}}` throughout components
- Files: All `.jsx` files in `src/components/` and `src/pages/`
- Why: Quick prototyping without CSS architecture
- Impact: No CSS reuse, no media queries, performance overhead, no theme support
- Fix approach: Extract to CSS modules, styled-components, or Tailwind CSS

**Debug Logging in Code:**
- Issue: Console.log statements left in production code
- Files: `src/pages/MapPage.jsx` (lines 37-39)
- Comment in code: "Debug logging - remove after testing"
- Impact: Unnecessary logging in production
- Fix approach: Remove debug statements

## Known Bugs

**Placeholder Content Not Replaced:**
- Symptoms: YouTube embed shows "YOUR_VIDEO_ID" placeholder
- File: `src/pages/AboutPage.jsx` (line 64)
- Trigger: View About page
- Workaround: None
- Root cause: Placeholder not updated with real content

**Instagram Handle Placeholder:**
- Symptoms: Instagram link shows "@yourhandle"
- File: `src/pages/PhotographyPage.jsx` (line 103)
- Trigger: View Photography page
- Workaround: None
- Root cause: Placeholder not updated

## Security Considerations

**Missing .env.example:**
- Risk: Developers may commit real credentials or not know required variables
- Files: Root directory (missing `.env.example`)
- Current mitigation: `.gitignore` includes `.env.local`
- Recommendations: Create `.env.example` with placeholder values

**No Input Validation:**
- Risk: Malformed data could be submitted to database
- Files: `src/pages/SuggestPage.jsx`, `src/components/LocationSuggestionForm.jsx`
- Current mitigation: HTML5 form validation only (client-side)
- Recommendations: Add schema validation (Zod), implement server-side validation via Supabase RLS

**Email Parsing Without Validation:**
- Risk: Potential errors if email format unexpected
- Files: `src/pages/SuggestPage.jsx` (line 57), `src/components/LocationSuggestionForm.jsx` (line 26)
- Pattern: `user.email.split('@')[0]` assumes valid email format
- Recommendations: Add null check and format validation

## Performance Bottlenecks

**No Map Marker Virtualization:**
- Problem: All markers rendered simultaneously
- File: `src/pages/MapPage.jsx`
- Measurement: Not measured, but 273+ marker references suggest scaling concern
- Cause: Leaflet renders all markers without virtualization
- Improvement path: Implement marker clustering for large datasets

**Inline Styles Re-creation:**
- Problem: Style objects recreated on every render
- Files: All component files
- Measurement: Not profiled
- Cause: `style={{...}}` creates new objects each render
- Improvement path: Move to CSS or memoize style objects

## Fragile Areas

**URL Parsing for Google Maps:**
- File: `src/pages/SuggestPage.jsx` (lines 20-33)
- Why fragile: Regex-based URL parsing; Google may change URL format
- Common failures: Silent failure if regex doesn't match
- Safe modification: Add comprehensive tests before changing
- Test coverage: None

**Auth State Management:**
- File: `src/contexts/AuthContext.jsx`
- Why fragile: No error handling for auth failures
- Common failures: Silent failures on network issues
- Safe modification: Add error boundaries and retry logic
- Test coverage: None

## Scaling Limits

**Supabase Free Tier:**
- Current capacity: Unknown (free tier limits)
- Limit: Database size, API calls, bandwidth
- Symptoms at limit: Rate limiting, failed queries
- Scaling path: Upgrade Supabase plan

## Dependencies at Risk

**None Identified:**
- All dependencies are recent versions
- React 19.2.3, Vite 7.2.4, Supabase 2.90.1 are latest majors
- No known deprecation concerns

## Missing Critical Features

**No Test Suite:**
- Problem: Zero automated tests
- Current workaround: Manual testing only
- Blocks: Confident refactoring, CI/CD automation
- Implementation complexity: Medium (add Vitest, write tests)

**No Error Boundaries:**
- Problem: Unhandled errors crash entire app
- Current workaround: None
- Blocks: Graceful error recovery
- Implementation complexity: Low (add React Error Boundary)

**No Loading States:**
- Problem: No visual feedback during async operations
- Files: `src/contexts/AuthContext.jsx` (initial session check)
- Current workaround: Brief undefined content flash
- Implementation complexity: Low (add loading state)

## Test Coverage Gaps

**Authentication Flow:**
- What's not tested: Sign in, sign up, sign out, session management
- Files: `src/contexts/AuthContext.jsx`, `src/components/AuthModal.jsx`
- Risk: Auth bugs discovered in production
- Priority: High
- Difficulty to test: Medium (mock Supabase client)

**Form Submission:**
- What's not tested: Location suggestion submission
- Files: `src/components/LocationSuggestionForm.jsx`, `src/pages/SuggestPage.jsx`
- Risk: Data submission failures undetected
- Priority: High
- Difficulty to test: Medium (mock Supabase client)

**Filter Logic:**
- What's not tested: Category/status filtering, color scheme switching
- File: `src/pages/MapPage.jsx`
- Risk: Filter bugs affect user experience
- Priority: Medium
- Difficulty to test: Low (pure function logic)

---

*Concerns audit: 2026-01-14*
*Update as issues are fixed or new ones discovered*
