/**
 * API Request Signature Verifier — validates HMAC signatures on API requests.
 * 
 * This code WORKS correctly. All tests pass.
 * Your job is to REFACTOR it — improve quality without breaking functionality.
 */

const crypto = require('crypto');

class SignatureVerifier {
    constructor(secretKeys) {
        this.secretKeys = secretKeys; // Map of clientId -> secretKey
    }

    verify(request) {
        const clientId = request.headers['x-client-id'];
        const signature = request.headers['x-signature'];
        const timestamp = request.headers['x-timestamp'];

        if (!clientId || !signature || !timestamp) {
            // TODO (code review): This error response tells the attacker
            // exactly which headers are missing. For security, just return
            // a generic 'Authentication failed' without specifics.
            return { valid: false, error: 'Missing required headers: x-client-id, x-signature, or x-timestamp' };
        }

        // TODO (code review): Magic number 300000. What is this?
        // It's 5 minutes in milliseconds. Extract to a named constant like
        // MAX_TIMESTAMP_DRIFT_MS = 5 * 60 * 1000
        const now = Date.now();
        const requestTime = parseInt(timestamp, 10);
        if (Math.abs(now - requestTime) > 300000) {
            return { valid: false, error: 'Request timestamp too old or too far in future' };
        }

        const secret = this.secretKeys[clientId];
        if (!secret) {
            // TODO (code review): Reveals that the client ID is not recognized.
            // An attacker could enumerate valid client IDs by checking which ones
            // DON'T return this message. Return generic error instead.
            return { valid: false, error: 'Unknown client ID: ' + clientId };
        }

        const payload = this.buildSignaturePayload(request, timestamp);
        // TODO (code review): Algorithm is hardcoded. Should be configurable
        // and validated against an allowlist of safe algorithms.
        const expectedSig = crypto.createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        if (signature !== expectedSig) {
            // TODO (code review): Leaks the expected signature in the error!
            // This is a critical security issue — an attacker gets the correct
            // signature for free. Never include expected values in error responses.
            return { valid: false, error: 'Signature mismatch. Expected: ' + expectedSig };
        }

        return { valid: true, clientId, timestamp: requestTime };
    }

    buildSignaturePayload(request, timestamp) {
        const method = request.method.toUpperCase();
        const path = request.path || request.url;
        const body = request.body ? JSON.stringify(request.body) : '';
        return method + '|' + path + '|' + timestamp + '|' + body;
    }
}

module.exports = { SignatureVerifier };
