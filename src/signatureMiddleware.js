/**
 * Signature Middleware — Express-compatible middleware wrapper.
 * 
 * This code WORKS correctly. All tests pass.
 * Your job is to REFACTOR it — improve quality without breaking functionality.
 */

const { SignatureVerifier } = require('./signatureVerifier');

// TODO (code review): These should be loaded from environment variables
// or a configuration service, not hardcoded in source code.
const CLIENT_SECRETS = {
    'client-web': 'web-secret-key-abc123',
    'client-mobile': 'mobile-secret-key-def456',
    'client-partner': 'partner-secret-key-ghi789'
};

function createSignatureMiddleware(options = {}) {
    const verifier = new SignatureVerifier(options.secrets || CLIENT_SECRETS);
    // TODO (code review): No way to configure which routes skip verification.
    // Some routes (health checks, public endpoints) shouldn't require signatures.
    // Add an 'exclude' option like { exclude: ['/health', '/public/*'] }

    return function signatureMiddleware(req, res, next) {
        // Skip verification for OPTIONS (CORS preflight)
        if (req.method === 'OPTIONS') {
            return next();
        }

        const result = verifier.verify(req);

        if (!result.valid) {
            return res.status(401).json({
                error: 'Unauthorized',
                details: result.error  // TODO (code review): This leaks internal error
                // details to the client. Only send 'Unauthorized' in production.
            });
        }

        // Attach verified client info to request
        req.verifiedClient = {
            clientId: result.clientId,
            verifiedAt: new Date().toISOString()
        };

        next();
    };
}

module.exports = { createSignatureMiddleware };
