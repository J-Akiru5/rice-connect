import { describe, expect, it } from 'vitest';
import { MockSmsAdapter, createSmsAdapter } from './sms-adapter';

describe('SmsAdapter (B-07)', () => {
    it('the mock accepts and returns a simulated provider id', async () => {
        const adapter = new MockSmsAdapter();
        expect(await adapter.send({ to: '+639171234567', template: 'slot', vars: {} })).toEqual({
            ok: true,
            providerId: 'mock-sms-0001'
        });
    });

    it('live mode without a provider fails closed until O8', async () => {
        expect(await createSmsAdapter(true).send({ to: '+639171234567', template: 'advance', vars: {} })).toEqual({
            ok: false,
            code: 'not_configured'
        });
    });
});
