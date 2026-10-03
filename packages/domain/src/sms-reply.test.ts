import { describe, expect, it } from 'vitest';
import { parseSmsReply } from './sms-reply';

describe('parseSmsReply', () => {
    it('accepts OK in any case and spacing', () => {
        for (const s of ['1 OK', '1 ok', ' 1   OK ', '1ok', '1-OK!', 'OK', 'ok', '1', 'Okay', '1 Oo']) expect(parseSmsReply(s)).toBe('ok');
    });
    it('accepts move in EN, TL and HIL', () => {
        for (const s of ['2 Move', '2 MOVE', 'move', '2', ' 2  move. ', '2move', '2 ilipat', 'Ibalhin', '2 IBALHIN']) expect(parseSmsReply(s)).toBe('move');
    });
    it('rejects anything else', () => {
        for (const s of ['', '3', '12', 'hello', '1 2', 'ok move', 'okk', '2 ok']) expect(parseSmsReply(s)).toBeNull();
    });
});
