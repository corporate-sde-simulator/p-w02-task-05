const SignatureVerifier = require('../src/signatureVerifier');

describe('SignatureVerifier', () => {
    let verifier;
    const SECRET = 'test-secret-key';

    beforeEach(() => {
        verifier = new SignatureVerifier({ client_1: SECRET });
    });

    test('should verify valid signature', () => {
        const body = '{"amount":100}';
        const timestamp = Date.now();
        // Correct format: timestamp.body
        const sig = verifier.computeSignature(body, timestamp, SECRET);
        const result = verifier.verifySignature('client_1', body, timestamp, sig);
        expect(result.valid).toBe(true);
    });

    test('should reject tampered body', () => {
        const body = '{"amount":100}';
        const timestamp = Date.now();
        const sig = verifier.computeSignature(body, timestamp, SECRET);
        const result = verifier.verifySignature('client_1', '{"amount":999}', timestamp, sig);
        expect(result.valid).toBe(false);
    });

    test('should reject unknown client', () => {
        const result = verifier.verifySignature('unknown', 'body', Date.now(), 'sig');
        expect(result.error).toBe('unknown_client');
    });

    test('should reject old timestamps (replay protection)', () => {
        const oldTimestamp = Date.now() - (6 * 60 * 1000); // 6 minutes ago
        const body = '{"data":"test"}';
        const sig = verifier.computeSignature(body, oldTimestamp, SECRET);
        const result = verifier.verifySignature('client_1', body, oldTimestamp, sig);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('request_too_old');
    });

    test('should add and remove clients', () => {
        verifier.addClient('client_2', 'new-secret');
        const body = 'test';
        const ts = Date.now();
        const sig = verifier.computeSignature(body, ts, 'new-secret');
        expect(verifier.verifySignature('client_2', body, ts, sig).valid).toBe(true);

        verifier.removeClient('client_2');
        expect(verifier.verifySignature('client_2', body, ts, sig).error).toBe('unknown_client');
    });
});
