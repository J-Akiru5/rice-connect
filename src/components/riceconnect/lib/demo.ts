/* Step 1 stub. Replaced in step 2 by re-exports from src/data (same shapes as the design's lib/demo.ts). */
export const PRICE = { quoted: 2250, drying: 150, margin: 100, net: 2000, advancePct: 0.8, buyerFee: 68 };
export const SMS: { key: string; time: string; text: Record<'en' | 'tl' | 'hil', string> }[] = [];
export const peso = (centavos: number) => '₱' + (centavos / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const rate = (centavos: number) => (centavos / 100).toFixed(2);
