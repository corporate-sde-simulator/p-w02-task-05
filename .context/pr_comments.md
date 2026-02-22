# PR #408 Review — API Signature Middleware (by Deepak Reddy)

## Reviewer: Kavitha Rajan — Feb 16, 2026

---

### `signatureVerifier.js`

> **Line 31** — `computeSignature`:  
> You're signing `body + timestamp` but the spec says `timestamp.body` (with dot separator). This mismatch means valid client signatures fail verification.

> **Line 48** — `verifySignature`:  
> You're using `===` for signature comparison. This is vulnerable to timing attacks. Use `crypto.timingSafeEqual()` instead.

> **Line 55** — Timestamp validation:  
> You compute the age as `timestamp - Date.now()` which is negative. Should be `Date.now() - timestamp` then check if greater than threshold.

---

**Deepak Reddy** — Feb 17, 2026

> All valid points. The concatenation order mismatch is the critical one — it would cause all real client requests to be rejected.
