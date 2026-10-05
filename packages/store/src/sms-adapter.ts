/* B-07: SMS goes through one adapter, like auth and data. The mock is the demo mode (nothing leaves the
   browser); the aggregator implementation arrives with O8 (supplier and sender registration), and the inbound
   reply webhook is provider-specific, so it ships with that adapter. The SMS bodies themselves stay in
   @rc/domain (EN/TL/HIL) so the app and the provider send exactly the reviewed text. */
export type SmsTemplate = 'slot' | 'advance' | 'balance';
export interface SmsSendInput {
    /** E.164, e.g. +639171234567. */
    to: string;
    template: SmsTemplate;
    vars: Record<string, string>;
}
export type SmsErrorCode = 'not_configured' | 'network' | 'rejected';
export type SmsSendResult = { ok: true; providerId: string } | { ok: false; code: SmsErrorCode };

export interface SmsAdapter {
    send(input: SmsSendInput): Promise<SmsSendResult>;
}

/** Demo mode: accept and report a simulated provider id; nothing is sent or stored. */
export class MockSmsAdapter implements SmsAdapter {
    private seq = 0;
    async send(_input: SmsSendInput): Promise<SmsSendResult> {
        this.seq += 1;
        return { ok: true, providerId: `mock-sms-${String(this.seq).padStart(4, '0')}` };
    }
}

/** Product mode before O8: fail closed with a typed code instead of pretending to send. */
export class UnconfiguredSmsAdapter implements SmsAdapter {
    async send(_input: SmsSendInput): Promise<SmsSendResult> {
        return { ok: false, code: 'not_configured' };
    }
}

export const createSmsAdapter = (live: boolean): SmsAdapter =>
    live ? new UnconfiguredSmsAdapter() : new MockSmsAdapter();
