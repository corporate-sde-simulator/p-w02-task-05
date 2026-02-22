# PLATFORM-2861: Refactor API request signature middleware

**Status:** In Progress · **Priority:** Medium
**Sprint:** Sprint 24 · **Story Points:** 5
**Reporter:** Karan Malhotra (API Security Lead) · **Assignee:** You (Intern)
**Due:** End of sprint (Friday)
**Labels:** `backend`, `security`, `javascript`, `refactor`
**Task Type:** Code Maintenance

---

## Description

The API signature verification middleware **works correctly** — all tests pass. But the code is hard to extend and has several quality issues. Refactor without breaking tests.

## What Needs Improvement

- `// TODO (code review):` comments mark specific issues
- Middleware has hardcoded algorithm list instead of configurable
- Error responses leak internal details (hash algorithm, expected vs actual)
- No request logging/auditing for security review
- Timestamp tolerance hardcoded as magic number
- Missing JSDoc on all functions

## Acceptance Criteria

- [ ] All `// TODO (code review):` items addressed
- [ ] Algorithm list made configurable via constructor
- [ ] Error responses sanitized (no internal details leaked)
- [ ] Timestamp tolerance extracted to named constant
- [ ] Security-relevant events logged
- [ ] All existing tests still pass
