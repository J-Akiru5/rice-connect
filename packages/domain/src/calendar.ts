import overrides from './overrides.json';

const DAY = 86_400_000;
const W1 = Date.parse(overrides.calendarW1Monday + 'T00:00:00Z');
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Day index 0 = Monday of W1. */
export const isoOf = (dayIndex: number) => new Date(W1 + dayIndex * DAY).toISOString().slice(0, 10);
/** "Thu 22 Oct" */
export function dayLabel(dayIndex: number) {
    const d = new Date(W1 + dayIndex * DAY);
    return `${DOW[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
}
/** "Thu 22 Oct 2026" */
export const dateLabel = (dayIndex: number) =>
    `${dayLabel(dayIndex)} ${new Date(W1 + dayIndex * DAY).getUTCFullYear()}`;
/** Planting week label for a day index that may be negative (before W1): "Jul W1" = days 1-7 of July. */
export function monthWeekLabel(dayIndex: number) {
    const d = new Date(W1 + dayIndex * DAY);
    return `${MON[d.getUTCMonth()]} W${Math.ceil(d.getUTCDate() / 7)}`;
}
