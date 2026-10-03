'use client';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@rc/ui';
import { BUYER_TYPES, isBuyerType, buysPalay, type BuyerType } from '@rc/domain/buyers';

const KEY = 'rc-buyer-type';
const DEFAULT: BuyerType = 'restaurant';

/** Buyer type from ?type= (shareable), else the last choice in localStorage (try/catch), else Restaurant. */
export function useBuyerType(): [BuyerType, (t: BuyerType) => void] {
    const sp = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const fromUrl = sp.get('type');
    const [stored, setStored] = useState<BuyerType | null>(null);
    useEffect(() => { try { const v = window.localStorage.getItem(KEY); if (isBuyerType(v)) setStored(v); } catch { /* blocked */ } }, []);
    const type = isBuyerType(fromUrl) ? fromUrl : stored ?? DEFAULT;
    const set = useCallback((t: BuyerType) => {
        try { window.localStorage.setItem(KEY, t); } catch { /* blocked */ }
        setStored(t);
        const next = new URLSearchParams(sp.toString());
        next.set('type', t);
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }, [sp, router, pathname]);
    return [type, set];
}

/** "I buy as: Miller / Retailer / Market Seller / Restaurant" (radio group, icon-free words, 44px targets). */
export function BuyerTypePicker({ value, onChange }: { value: BuyerType; onChange: (t: BuyerType) => void }) {
    const { t } = useI18n();
    return (
        <div className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-2">
            <div role="radiogroup" aria-label={t('buyer.type')} className="flex flex-wrap items-center gap-2">
                <span className="eyebrow mr-1">{t('buyer.type')}</span>
                {BUYER_TYPES.map((bt) => (
                    <button key={bt} type="button" role="radio" aria-checked={value === bt} onClick={() => onChange(bt)}
                        className={`min-h-[44px] px-4 rounded-full text-[14px] font-extrabold ${value === bt ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]'}`}>
                        {t('buyer.type.' + bt)}
                    </button>
                ))}
            </div>
            <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)]">{t(buysPalay(value) ? 'buyer.buys.palay' : 'buyer.buys.rice')}</p>
        </div>
    );
}
