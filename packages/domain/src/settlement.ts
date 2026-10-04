import { PRICE } from './params';
import { pct } from './money';
import type { Settlement } from './schemas';
export type { Settlement } from './schemas';

/** Per kg: quoted − drying − coordination margin = net. Advance = 80% of net within 24 h; balance when the buyer pays.
    Buyer sourcing fee = 3% of quoted, paid by the buyer, never deducted from the farmer. */
export function settle(kg: number, p = PRICE): Settlement {
    if (!Number.isInteger(kg) || kg < 0) throw new Error(`kg must be a whole non-negative number, got ${kg}`);
    const netRate = p.quoted - p.drying - p.margin;
    const gross = kg * p.quoted;
    const drying = kg * p.drying;
    const margin = kg * p.margin;
    const net = gross - drying - margin;
    const advance = pct(net, p.advancePct);
    return {
        kg,
        gross,
        drying,
        margin,
        net,
        advance,
        balance: net - advance,
        buyerFee: pct(gross, p.buyerFeePct),
        rates: {
            quoted: p.quoted,
            drying: p.drying,
            margin: p.margin,
            net: netRate,
            buyerFee: pct(p.quoted, p.buyerFeePct)
        }
    };
}
