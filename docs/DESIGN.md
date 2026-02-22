# ADR-021: Request Signing â€” HMAC vs RSA

**Date:**  
**Status:** Accepted  
**Authors:** Kavitha Rajan, Deepak Reddy

## Decision

Use **HMAC-SHA256** for API request signing rather than RSA signatures.

## Context

Third-party integrations need tamper-proof request verification. Both parties can share a secret key securely during onboarding.

## Rationale

- HMAC is faster for our throughput (~10K req/min)
- Simpler key management (symmetric key vs keypair)
- Sufficient security for B2B API calls over TLS

## Consequences

- Shared secret must be exchanged securely during partner onboarding
- Key rotation requires coordination with all partners
- Both source and verifier authenticate (not just signer like RSA)
