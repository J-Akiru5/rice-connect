/* Pure timeline logic for /demo (tested in timeline.test.ts). */
/* The 78 s guided sequence. Beat times are from the brief (seconds). */
export const BEATS = [
    { key: 'farm', start: 0, end: 6 },
    { key: 'plan', start: 6, end: 16 },
    { key: 'market', start: 16, end: 28 },
    { key: 'dry', start: 28, end: 40 },
    { key: 'haul', start: 40, end: 52 },
    { key: 'pay', start: 52, end: 64 },
    { key: 'sms', start: 64, end: 72 },
    { key: 'end', start: 72, end: 78 },
] as const;
export const TOTAL = 78;
/** ?flip=1: the SMS beat switches EN → TL → HIL at 64 / 67 / 70 s (and stays HIL on the end card). */
export const flipLang = (t: number): 'en' | 'tl' | 'hil' => (t < 67 ? 'en' : t < 70 ? 'tl' : 'hil');
/** Inside the Haul beat: coordinator sees the auto-assigned driver, then the driver's phone moves the stepper. */
export function haulAt(t: number): { who: 'coordinator' | 'driver'; status: 'assigned' | 'accepted' | 'pickedup' | 'delivered' } {
    if (t < 46) return { who: 'coordinator', status: 'assigned' };
    if (t < 48) return { who: 'driver', status: 'accepted' };
    if (t < 50) return { who: 'driver', status: 'pickedup' };
    return { who: 'driver', status: 'delivered' };
}
export function beatIndexAt(t: number) {
    if (t >= TOTAL) return BEATS.length - 1;
    const i = BEATS.findIndex((b) => t >= b.start && t < b.end);
    return i < 0 ? 0 : i;
}

