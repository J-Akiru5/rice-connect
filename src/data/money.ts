/* Money is integer centavos everywhere. Only these helpers turn it into text. */
export type Centavos = number;

const group = (n: number) => n.toLocaleString('en-US');
function split(c: Centavos) {
    if (!Number.isInteger(c)) throw new Error(`money must be integer centavos, got ${c}`);
    const neg = c < 0;
    const abs = Math.abs(c);
    return { neg, whole: Math.floor(abs / 100), cents: String(abs % 100).padStart(2, '0') };
}
/** ₱112,500.00 */
export function peso(c: Centavos): string {
    const { neg, whole, cents } = split(c);
    return `${neg ? '−' : ''}₱${group(whole)}.${cents}`;
}
/** 22.50 (a per-kg rate, no symbol; the column or unit says ₱/kg). */
export function rate(c: Centavos): string {
    const { neg, whole, cents } = split(c);
    return `${neg ? '-' : ''}${group(whole)}.${cents}`;
}
/** PHP 80,000.00 — plain ASCII for SMS (₱ is not in the GSM-7 alphabet). */
export function pesoAscii(c: Centavos): string {
    const { neg, whole, cents } = split(c);
    return `${neg ? '-' : ''}PHP ${group(whole)}.${cents}`;
}
/** Integer percentage of an integer amount, rounded half up. */
export const pct = (c: Centavos, percent: number): Centavos => Math.round((c * percent) / 100);
