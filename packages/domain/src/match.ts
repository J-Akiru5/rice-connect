/* Auto-match: fill each commitment from forecast lots whose harvest week is inside its window.
   Whole lots only, so a filled commitment always has matched kg >= requested kg. */
export interface MatchLot {
    id: string;
    week: string;
    dayIndex: number;
    driedKg: number;
    grade: string;
    mcPct: number;
}
export interface MatchCommitment {
    id: string;
    tonnes: number;
    grade: string;
    mcPct: number;
    window: readonly string[];
}
export interface MatchResult {
    commitment: string;
    lots: string[];
    kg: number;
    requestedKg: number;
    filled: boolean;
}

export function autoMatch(
    commitments: readonly MatchCommitment[],
    lots: readonly MatchLot[],
    pinned: Record<string, string> = {}
): MatchResult[] {
    const used = new Set<string>();
    const out = new Map<string, MatchResult>();
    for (const c of commitments)
        out.set(c.id, { commitment: c.id, lots: [], kg: 0, requestedKg: c.tonnes * 1000, filled: false });
    const fits = (c: MatchCommitment, l: MatchLot) =>
        c.window.includes(l.week) && c.grade === l.grade && c.mcPct === l.mcPct;
    // 1. Lots the coordinator committed by hand (the demo's Commit Lot) go first.
    for (const [lotId, cId] of Object.entries(pinned)) {
        const l = lots.find((x) => x.id === lotId);
        const c = commitments.find((x) => x.id === cId);
        const r = out.get(cId);
        if (!l || !c || !r || !fits(c, l)) throw new Error(`pinned lot ${lotId} does not fit ${cId}`);
        r.lots.push(l.id);
        r.kg += l.driedKg;
        used.add(l.id);
    }
    // 2. Earliest window first; inside it, earliest harvest first, then lot id.
    const order = [...commitments].sort((a, b) => a.window[0].localeCompare(b.window[0]) || a.id.localeCompare(b.id));
    const pool = [...lots].sort((a, b) => a.dayIndex - b.dayIndex || a.id.localeCompare(b.id));
    for (const c of order) {
        const r = out.get(c.id)!;
        for (const l of pool) {
            if (r.kg >= r.requestedKg) break;
            if (used.has(l.id) || !fits(c, l)) continue;
            r.lots.push(l.id);
            r.kg += l.driedKg;
            used.add(l.id);
        }
        r.filled = r.kg >= r.requestedKg;
    }
    return commitments.map((c) => out.get(c.id)!);
}

/** Forecast kg available inside a window (for the "forecast vs requested" line). */
export const forecastKg = (window: readonly string[], lots: readonly MatchLot[]) =>
    lots.filter((l) => window.includes(l.week)).reduce((s, l) => s + l.driedKg, 0);
