/* Farmer SMS replies. The slot SMS ends with "Reply 1 OK, 2 to move" (EN), "Sagot 1 OK, 2 ilipat" (TL),
   "Sabat 1 OK, 2 ibalhin" (HIL). One pure parser, tolerant of case, spaces and punctuation. */
export type SmsAction = 'ok' | 'move';

const OK = new Set(['1', 'ok', 'okay', '1 ok', '1 okay', 'oo', '1 oo']);
const MOVE = new Set(['2', 'move', '2 move', 'ilipat', '2 ilipat', 'ibalhin', '2 ibalhin']);

/** "1 OK", " ok ", "1ok", "1-OK!" → 'ok'; "2 Move", "MOVE", "2 ilipat", "2 ibalhin" → 'move'; anything else → null. */
export function parseSmsReply(text: string): SmsAction | null {
    const t = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/([0-9])([a-z])/g, '$1 $2')
        .trim()
        .replace(/\s+/g, ' ');
    if (OK.has(t)) return 'ok';
    if (MOVE.has(t)) return 'move';
    return null;
}
