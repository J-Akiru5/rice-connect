'use client';
import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import Icon from './Icon';
import { useI18n, LANGS, Lang, tx } from '@rc/i18n';
import { peso, rate, PRICE, SMS } from '../lib/demo';

/* ================================================================
   Enactus 2026 additions. Glass for everything except Haul, which
   uses Karl's hard logistics style (HaulRequestCard, DriverCard,
   RouteLine, StatusChip hard).
   ================================================================ */

/* ---------- DemoChip ---------- */
export function DemoChip({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
    const { t } = useI18n();
    return (
        <span {...props} role="note"
            className={'inline-flex items-center gap-1.5 min-h-[28px] px-3 py-1 rounded-full bg-[var(--brand-gold)] text-black text-[12px] leading-4 font-extrabold uppercase tracking-[0.08em] whitespace-nowrap ' + className}>
            <Icon name="Info" size={16} strokeWidth={2.5} />{t('demo.chip')}
        </span>
    );
}

/* ---------- StatusChip ---------- */
type Kind = 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'brand';
const KIND: Record<Kind, { cls: string; icon: string }> = {
    success: { cls: 'bg-[var(--success)] text-black', icon: 'CircleCheck' },
    warning: { cls: 'bg-[var(--warning)] text-black', icon: 'Clock' },
    info: { cls: 'bg-[var(--info)] text-black', icon: 'Truck' },
    danger: { cls: 'bg-[var(--danger-strong)] text-white', icon: 'CircleX' },
    neutral: { cls: 'bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]', icon: 'Dot' },
    brand: { cls: 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]', icon: 'Verified' },
};
export const STATUS_KIND: Record<string, Kind> = {
    registered: 'neutral', verified: 'brand', cluster: 'success', requested: 'neutral', assigned: 'info', accepted: 'info',
    pickedup: 'warning', delivered: 'success', pending: 'warning', paid: 'success', failed: 'danger', matched: 'success', open: 'neutral', full: 'brand',
};
export function StatusChip({ status, label, kind, hard = false, className = '' }: { status: string; label?: string; kind?: Kind; hard?: boolean; className?: string }) {
    const { t } = useI18n();
    const k = kind ?? STATUS_KIND[status] ?? 'neutral';
    /* Prototype port: a hard (Haul) neutral chip is white, not glass, so no glass sits inside a hard card. */
    const s = hard && k === 'neutral' ? { cls: 'bg-white text-black', icon: KIND.neutral.icon } : KIND[k];
    const shape = hard ? 'rounded-none border-2 border-black' : 'rounded-full';
    return (
        <span className={`inline-flex items-center gap-1.5 min-h-[28px] px-2.5 py-1 text-[12px] leading-4 font-extrabold uppercase tracking-[0.06em] whitespace-nowrap ${s.cls} ${shape} ${className}`}>
            <Icon name={s.icon} size={16} strokeWidth={2.5} />{label ? tx(t, label) : t('status.' + status)}
        </span>
    );
}

/* ---------- BigStat ---------- */
export function BigStat({ label, value, unit, note, icon, size = 'lg', className = '' }: { label: string; value: ReactNode; unit?: string; note?: ReactNode; icon?: string; size?: 'lg' | 'md'; className?: string }) {
    const { t } = useI18n(); label = tx(t, label); note = tx(t, note);
    return (
        <div className={'glass-panel rounded-[1.5rem] p-5 min-w-0 ' + className}>
            <div className="flex items-center gap-2 eyebrow">{icon && <Icon name={icon} size={18} />}{label}</div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 tabular min-w-0">
                <span className={`${size === 'md' ? 'text-[30px] leading-[36px]' : 'text-[40px] leading-[44px]'} font-extrabold tracking-[-0.02em] text-[var(--ink)] break-all`}>{value}</span>
                {unit && <span className="text-lg font-bold text-[var(--text-muted)]">{unit}</span>}
            </div>
            {note && <div className="mt-1 text-[13px] font-semibold text-[var(--text-secondary)]">{note}</div>}
        </div>
    );
}

/* ---------- Field row (internal) ---------- */
function Field({ label, children }: PropsWithChildren<{ label: string }>) {
    return (
        <div className="min-w-0 py-2.5 border-b border-[color:var(--glass-border-strong)] last:border-0">
            <dt className="text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{label}</dt>
            <dd className="mt-1 text-[16px] leading-6 font-bold text-[var(--ink)] break-words">{children}</dd>
        </div>
    );
}

/* ---------- FarmProfileCard ---------- */
export interface FarmLike { id: string; name: string; mobile: string; barangay: string; areaHa: number; variety: string; plantingWeek: string; status: string; }
export function FarmProfileCard({ farm, added = false, onAdd, className = '' }: { farm: FarmLike; added?: boolean; onAdd?: () => void; className?: string }) {
    const { t } = useI18n();
    const status = added ? 'cluster' : farm.status;
    return (
        <article className={'glass-panel rounded-[2rem] p-5 ' + className} aria-labelledby={`farm-${farm.id}`}>
            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="eyebrow">{t('farm.title')}</div>
                    <h2 id={`farm-${farm.id}`} className="mt-1 text-[24px] leading-7 font-extrabold tracking-[-0.02em]">{farm.id}</h2>
                </div>
                <StatusChip status={status} label={t(status === 'cluster' ? 'status.cluster' : 'status.' + status)} />
            </header>
            <dl className="mt-3 grid grid-cols-2 gap-x-4">
                <Field label={t('farm.id')}>{farm.id}</Field>
                <Field label={t('farm.status')}>{t(status === 'cluster' ? 'status.cluster' : 'status.' + status)}</Field>
                <div className="col-span-2"><Field label={t('farm.name')}>{farm.name}</Field></div>
                <Field label={t('farm.mobile')}><span className="tabular">{farm.mobile}</span></Field>
                <Field label={t('farm.barangay')}>{farm.barangay}</Field>
                <Field label={t('farm.area')}><span className="tabular">{farm.areaHa.toFixed(1)} ha</span></Field>
                <Field label={t('farm.variety')}>{farm.variety}</Field>
                <div className="col-span-2"><Field label={t('farm.planting')}>{farm.plantingWeek}</Field></div>
            </dl>
            {onAdd !== undefined && (
                <div className="mt-4">
                    {added ? (
                        <p className="flex items-center gap-2 text-[20px] leading-7 font-extrabold text-[var(--success-ink)]" role="status"><Icon name="CircleCheck" size={24} />{t('farm.added')}</p>
                    ) : (
                        <button type="button" onClick={onAdd} className="btn-2026 w-full"><Icon name="Plus" size={24} /><span>{t('farm.add')}</span></button>
                    )}
                </div>
            )}
        </article>
    );
}

/* ---------- CommitmentCard ---------- */
export interface Commitment { id: string; buyer: string; tonnes: number; grade: string; mc: string; price: number; week: string; filled: number; status: string; }
export function CommitmentCard({ c, highlight = false, onCommit, className = '' }: { c: Commitment; highlight?: boolean; onCommit?: () => void; className?: string }) {
    const { t } = useI18n();
    const pct = Math.min(100, Math.round((c.filled / c.tonnes) * 100));
    return (
        <article className={`glass-panel rounded-[1.5rem] p-5 ${highlight ? 'outline outline-[3px] outline-[color:var(--text-accent)]' : ''} ${className}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="eyebrow">{c.id} · {c.week}</div>
                    <h3 className="mt-1 text-[18px] leading-6 font-extrabold">{c.buyer}</h3>
                </div>
                <StatusChip status={c.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular">
                <span className="text-[32px] leading-9 font-extrabold tracking-[-0.02em]">{c.tonnes.toFixed(1)} t</span>
                <span className="text-[15px] font-bold">{c.grade} · {c.mc}</span>
                <span className="text-[15px] font-bold text-[var(--gold-ink)]">{peso(c.price)}/kg</span>
            </div>
            <div className="mt-3">
                <div className="h-3 rounded-full bg-[rgba(2,44,34,.12)] overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t('market.filled')}>
                    <div className="h-full rounded-full bg-[var(--fill-strong)]" style={{ width: pct + '%' }} />
                </div>
                <div className="mt-1.5 text-[13px] font-semibold text-[var(--text-secondary)] tabular">{t('market.filledof', { filled: c.filled.toFixed(1), tonnes: c.tonnes.toFixed(1), pct })}</div>
            </div>
            {onCommit && c.status !== 'full' && (
                <button type="button" onClick={onCommit} className="mt-4 inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-[2rem] border-2 border-[color:var(--text-accent)] text-[var(--text-accent)] text-[13px] font-extrabold uppercase tracking-[0.08em]">
                    <Icon name="Plus" size={18} /><span>{t('market.commit')}</span>
                </button>
            )}
        </article>
    );
}

/* ---------- SearchField ---------- */
export function SearchField({ className = '', label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
    const { t } = useI18n();
    const l = label ?? t('market.search');
    return (
        <label className={'relative block ' + className}>
            <span className="sr-only">{l}</span>
            <Icon name="Search" size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input type="search" placeholder={l} {...props} className="input-2026 !pl-12 !text-base" />
        </label>
    );
}

/* ---------- FilterChips ---------- */
export function FilterChips({ options, value, onChange, label = 'Filters', className = '' }: { options: { id: string; label: string; count?: number }[]; value: string[]; onChange?: (v: string[]) => void; label?: string; className?: string }) {
    const toggle = (id: string) => onChange?.(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
    return (
        <div role="group" aria-label={label} className={'flex flex-wrap gap-2 ' + className}>
            {options.map((o) => {
                const on = value.includes(o.id);
                return (
                    <button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)}
                        className={`inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full text-[14px] font-bold transition-colors ${on ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]'}`}>
                        {on && <Icon name="Check" size={16} strokeWidth={3} />}{o.label}{o.count !== undefined && <span className="tabular opacity-90">({o.count})</span>}
                    </button>
                );
            })}
        </div>
    );
}

/* ---------- HarvestCalendar ---------- */
export function HarvestCalendar({ rows, weeks = ['W1', 'W2', 'W3', 'W4'], highlight, caption = 'Wet palay tonnes by barangay and harvest week', className = '' }: { rows: { barangay: string; farms: number; weeks: number[] }[]; weeks?: string[]; highlight?: { row: number; week: number; label: string }; caption?: string; className?: string }) {
    const { t } = useI18n();
    const max = Math.max(...rows.flatMap((r) => r.weeks));
    const totals = weeks.map((_, i) => Math.round(rows.reduce((s, r) => s + r.weeks[i], 0) * 10) / 10);
    return (
        <div className={'glass-panel rounded-[1.5rem] p-5 overflow-x-auto ' + className}>
            <table className="w-full border-separate border-spacing-0 tabular">
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr>
                        <th scope="col" className="text-left pb-3 pr-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{t('farm.barangay')}</th>
                        {weeks.map((w) => <th key={w} scope="col" className="pb-3 px-2 text-left text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{w}</th>)}
                        <th scope="col" className="pb-3 pl-2 text-right text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{t('cal.total')}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, ri) => (
                        <tr key={r.barangay}>
                            <th scope="row" className="text-left py-2 pr-3 border-t border-[color:var(--glass-border-strong)]">
                                <div className="text-[15px] font-extrabold">{r.barangay}</div>
                                <div className="text-[12px] font-semibold text-[var(--text-secondary)]">{t('cal.farms', { n: r.farms })}</div>
                            </th>
                            {r.weeks.map((v, wi) => {
                                const hl = highlight && highlight.row === ri && highlight.week === wi;
                                return (
                                    <td key={wi} className="py-2 px-2 border-t border-[color:var(--glass-border-strong)] align-middle min-w-[120px]">
                                        <div className={`relative h-11 rounded-xl overflow-hidden bg-[rgba(2,70,53,.08)] ${hl ? 'outline outline-[3px] outline-[color:var(--brand-gold)]' : ''}`}>
                                            <div className="absolute inset-y-0 left-0 bg-[var(--fill-strong)]" style={{ width: `${(v / max) * 100}%`, opacity: 0.9 }} />
                                            <div className="relative h-full flex items-center px-3 text-[15px] font-extrabold" style={{ color: v / max > 0.45 ? 'var(--on-fill-strong)' : 'var(--ink)' }}>{v.toFixed(1)} t</div>
                                        </div>
                                        {hl && <div className="mt-1 text-[12px] font-bold text-[var(--gold-ink)]">{highlight!.label}</div>}
                                    </td>
                                );
                            })}
                            <td className="py-2 pl-2 text-right text-[15px] font-extrabold border-t border-[color:var(--glass-border-strong)]">{(Math.round(r.weeks.reduce((a, b) => a + b, 0) * 10) / 10).toFixed(1)} t</td>
                        </tr>
                    ))}
                    <tr>
                        <th scope="row" className="text-left pt-3 pr-3 border-t-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.08em]">{t('filter.all')}</th>
                        {totals.map((v, i) => <td key={i} className="pt-3 px-2 border-t-2 border-[color:var(--text-muted)] text-[15px] font-extrabold">{v.toFixed(1)} t</td>)}
                        <td className="pt-3 pl-2 text-right border-t-2 border-[color:var(--text-muted)] text-[15px] font-extrabold">{totals.reduce((a, b) => a + b, 0).toFixed(1)} t</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

/* ---------- SlotTimeline ---------- */
export interface Slot { id: string; lot: string; sacks: number; time: string; hero?: boolean }
export function SlotTimeline({ days, capacity, className = '' }: { days: { day: string; slots: Slot[] }[]; capacity: number; className?: string }) {
    const { t } = useI18n();
    return (
        <div className={'glass-panel rounded-[1.5rem] p-5 ' + className}>
            <div className="grid gap-4 grid-cols-1 sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ['--n' as any]: days.length }}>
                {days.map((d) => {
                    const used = d.slots.reduce((s, x) => s + x.sacks, 0);
                    const pct = Math.min(100, Math.round((used / capacity) * 100));
                    return (
                        <section key={d.day} className="min-w-0" aria-label={d.day}>
                            <h4 className="text-[13px] font-extrabold uppercase tracking-[0.08em]">{d.day}</h4>
                            <div className="mt-2 h-2.5 rounded-full bg-[rgba(2,44,34,.12)] overflow-hidden"><div className="h-full bg-[var(--fill-strong)]" style={{ width: pct + '%' }} /></div>
                            <div className="mt-1 text-[12px] font-semibold text-[var(--text-secondary)] tabular">{used} / {capacity} {t('unit.sacks')}</div>
                            <ul className="mt-3 space-y-2">
                                {d.slots.map((s) => (
                                    <li key={s.id} className={`rounded-xl px-3 py-2 ${s.hero ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'bg-[rgba(2,70,53,.08)] text-[var(--ink)]'}`}>
                                        <div className="text-[14px] font-extrabold tabular">{s.lot} · {s.sacks} {t('unit.sacks')}</div>
                                        <div className={`text-[12px] font-semibold ${s.hero ? 'text-[var(--on-fill-strong)]' : 'text-[var(--text-secondary)]'}`}>{s.id} · {s.time}</div>
                                    </li>
                                ))}
                                {d.slots.length === 0 && <li className="text-[13px] font-semibold text-[var(--text-secondary)]">{t('status.open')}</li>}
                            </ul>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}

/* ---------- RouteLine (hard) ---------- */
export function RouteLine({ stops, km, active = 0, className = '' }: { stops: { label: string; place: string; icon: string }[]; km?: number; active?: number; className?: string }) {
    const { t } = useI18n();
    return (
        <div className={'hard-thin p-4 ' + className}>
            <ol className="relative flex flex-col gap-4">
                <span aria-hidden className="absolute left-[19px] top-6 bottom-6 w-1 bg-black" />
                {stops.map((s, i) => (
                    <li key={i} className="relative flex items-center gap-3 min-w-0">
                        <span className={`relative z-10 w-10 h-10 shrink-0 flex items-center justify-center border-[3px] border-black ${i < active ? 'bg-[var(--success)]' : i === active ? 'bg-[var(--warning)]' : 'bg-white'}`}>
                            <Icon name={s.icon} size={22} />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[15px] font-extrabold text-black break-words">{s.label}</span>
                            <span className="block text-[13px] font-semibold text-[var(--gray-900)]">{s.place}</span>
                        </span>
                    </li>
                ))}
            </ol>
            {km !== undefined && <div className="mt-3 pt-3 border-t-2 border-black flex items-center gap-2 text-[14px] font-extrabold text-black tabular"><Icon name="Route" size={20} />{km.toFixed(1)} km · {t('route.note')}</div>}
        </div>
    );
}

/* ---------- Vehicle option (hard) ---------- */
export function VehicleOption({ v, sacks, selected, onSelect }: { v: { id: string; icon: string; capacity: number; price: number }; sacks?: number; selected?: boolean; onSelect?: () => void }) {
    const { t } = useI18n();
    const trips = sacks ? Math.ceil(sacks / v.capacity) : 1;
    const tooSmall = trips > 3;
    return (
        <button type="button" role="radio" aria-checked={!!selected} disabled={tooSmall} onClick={onSelect}
            className={`flex flex-col items-start gap-1 min-h-[44px] p-3 text-left border-[3px] border-black ${selected ? 'bg-[var(--warning)] shadow-[var(--shadow-hard)]' : 'bg-white'} ${tooSmall ? 'border-dashed cursor-not-allowed' : ''}`}>
            <Icon name={v.icon} size={24} />
            <span className="text-[14px] font-extrabold text-black">{t('veh.' + v.id)}</span>
            <span className="text-[12px] font-bold text-black tabular">{t('haul.capacity')} {v.capacity} {t('unit.sacks')}</span>
            <span className="text-[12px] font-bold text-black tabular">{peso(v.price)} {t('haul.pertrip')}</span>
            {sacks && !tooSmall && trips > 1 && <span className="text-[12px] font-extrabold text-black tabular">{t('veh.trips').replace('{n}', String(trips))} · {peso(trips * v.price)}</span>}
            {tooSmall && <span className="text-[12px] font-extrabold text-black flex items-center gap-1"><Icon name="CircleX" size={14} />{t('veh.toosmall').replace('{n}', String(sacks))}</span>}
        </button>
    );
}

/* ---------- DriverCard (hard) ---------- */
export function DriverCard({ name, vehicle, plate, distanceKm, auto = true, onOverride, className = '' }: { name: string; vehicle: string; plate: string; distanceKm: number; auto?: boolean; onOverride?: () => void; className?: string }) {
    const { t } = useI18n();
    return (
        <div className={'hard p-4 ' + className}>
            <div className="flex items-start gap-3">
                <span className="w-12 h-12 shrink-0 flex items-center justify-center border-[3px] border-black bg-[var(--info)]"><Icon name={vehicle} size={26} /></span>
                <div className="min-w-0 flex-1">
                    {auto && <div className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-black flex items-center gap-1"><Icon name="CircleCheck" size={16} />{t('haul.autoassign')}</div>}
                    <div className="mt-0.5 text-[17px] font-extrabold text-black">{name}</div>
                    <div className="text-[13px] font-semibold text-[var(--gray-900)] tabular">{plate} · {t('driver.away', { km: distanceKm.toFixed(1) })}</div>
                </div>
            </div>
            {onOverride && (
                <button type="button" onClick={onOverride} className="hard-btn bg-white text-black mt-3 w-full"><Icon name="Users" size={20} /><span>{t('haul.override')}</span></button>
            )}
        </div>
    );
}

/* ---------- HaulRequestCard (hard) ---------- */
export function HaulRequestCard({ id, lot, sacks, status, children, className = '' }: PropsWithChildren<{ id: string; lot: string; sacks: number; status: string; className?: string }>) {
    const { t } = useI18n();
    return (
        <article className={'hard p-4 ' + className}>
            <header className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-black">{t('haul.title')}</div>
                    <h3 className="text-[24px] leading-7 font-extrabold text-black tabular">{id}</h3>
                    <div className="text-[14px] font-bold text-[var(--gray-900)] tabular">Lot {lot} · {sacks} {t('unit.sacks')}</div>
                </div>
                <StatusChip status={status} hard />
            </header>
            {children && <div className="mt-3 space-y-3">{children}</div>}
        </article>
    );
}

/* ---------- SettlementSlip (A6, black and white) ---------- */
export function SettlementSlip({ slip, farmer, logoSrc, className = '' }: { slip: { id: string; lot: string; farm: string; haul: string; slot: string; kg: number; gross: number; drying: number; margin: number; net: number; advance: number; balance: number; buyerFee: number; date: string }; farmer: string; logoSrc?: string; className?: string }) {
    const { t } = useI18n();
    const row = (label: string, rate: string, amount: string, strong = false) => (
        <tr className={strong ? 'border-t-2 border-black' : ''}>
            <th scope="row" className={`text-left py-1 pr-2 ${strong ? 'text-[15px] font-extrabold' : 'text-[13px] font-semibold'}`}>{label}</th>
            <td className={`py-1 px-1 text-right ${strong ? 'text-[15px] font-extrabold' : 'text-[13px] font-semibold'}`}>{rate}</td>
            <td className={`py-1 pl-2 text-right ${strong ? 'text-[15px] font-extrabold' : 'text-[13px] font-semibold'}`}>{amount}</td>
        </tr>
    );
    return (
        <section aria-label={t('slip.title')} className={'bg-white text-black w-[397px] min-h-[559px] p-6 flex flex-col tabular ' + className} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <header className="flex items-start justify-between gap-3 border-b-2 border-black pb-3">
                {logoSrc ? <img src={logoSrc} alt="RiceConnect" className="h-12 w-auto" style={{ filter: 'grayscale(1) contrast(10)' }} /> : <span className="text-[18px] font-extrabold">RiceConnect</span>}
                <div className="text-right">
                    <div className="text-[13px] font-extrabold uppercase tracking-[0.08em]">{t('slip.title')}</div>
                    <div className="text-[13px] font-bold">{slip.id}</div>
                    <div className="text-[12px] font-semibold">{slip.date}</div>
                </div>
            </header>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 py-3 text-[13px] border-b border-black">
                <div><dt className="font-semibold">{t('farm.name')}</dt><dd className="font-extrabold">{farmer}</dd></div>
                <div><dt className="font-semibold">{t('slip.farmlot')}</dt><dd className="font-extrabold">{slip.farm} · {slip.lot}</dd></div>
                <div><dt className="font-semibold">{t('slip.haulslot')}</dt><dd className="font-extrabold">{slip.haul} · {slip.slot}</dd></div>
                <div><dt className="font-semibold">{t('slip.weight')}</dt><dd className="font-extrabold">{slip.kg.toLocaleString('en-PH')} kg</dd></div>
            </dl>
            <table className="w-full mt-2">
                <thead><tr><th className="sr-only">Item</th><th className="text-right text-[12px] font-extrabold">₱/kg</th><th className="text-right text-[12px] font-extrabold">{t('slip.amount')}</th></tr></thead>
                <tbody>
                    {row(t('slip.quoted'), rate(PRICE.quoted), peso(slip.gross))}
                    {row('− ' + t('slip.drying'), rate(PRICE.drying), '− ' + peso(slip.drying))}
                    {row('− ' + t('slip.margin'), rate(PRICE.margin), '− ' + peso(slip.margin))}
                    {row('= ' + t('slip.net'), rate(PRICE.net), peso(slip.net), true)}
                </tbody>
            </table>
            <div className="mt-3 border-2 border-black p-3 space-y-1">
                <div className="flex justify-between gap-2 text-[13px] font-bold"><span>{t('slip.advance')}</span><span className="whitespace-nowrap">{peso(slip.advance)}</span></div>
                <div className="flex justify-between gap-2 text-[13px] font-bold"><span>{t('slip.balance')}</span><span className="whitespace-nowrap">{peso(slip.balance)}</span></div>
            </div>
            <p className="mt-2 text-[12px] font-semibold">{t('slip.fee', { rate: peso(PRICE.buyerFee) })} ({peso(slip.buyerFee)}). {t('slip.notdeducted')}</p>
            <div className="mt-auto pt-6 grid grid-cols-2 gap-4 text-[12px] font-semibold">
                <div className="border-t border-black pt-1">{t('slip.sign')}</div>
                <div className="border-t border-black pt-1">{t('slip.coordinator')}</div>
            </div>
            <p className="mt-3 text-[12px] font-extrabold uppercase tracking-[0.06em] border-t border-dashed border-black pt-2">{t('demo.chip')}</p>
        </section>
    );
}

/* ---------- PhoneFrame ---------- */
export function PhoneFrame({ children, time = '9:41', dark = false, className = '' }: PropsWithChildren<{ time?: string; dark?: boolean; className?: string }>) {
    return (
        <div className={`relative w-[390px] h-[844px] overflow-hidden rounded-[48px] border-[10px] border-[color:var(--black)] bg-[var(--canvas)] ${className}`} data-theme={dark ? 'dark' : undefined}>
            <div className="absolute top-0 inset-x-0 h-11 z-30 flex items-center justify-between px-7 text-[14px] font-bold text-[var(--ink)]">
                <span className="tabular">{time}</span>
                <span className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-7 rounded-full bg-[var(--black)]" aria-hidden />
                <span className="flex items-center gap-1" aria-hidden><Icon name="Phone" size={14} /> 4G</span>
            </div>
            <div className="absolute inset-0 pt-11 overflow-y-auto">{children}</div>
        </div>
    );
}

/* ---------- SmsBubble ---------- */
export function SmsBubble({ text, time, from = 'RiceConnect', className = '' }: { text: string; time?: string; from?: string; className?: string }) {
    const gsm = /^[\x0A\x0D\x20-\x7E]*$/.test(text);
    const parts = gsm ? (text.length <= 160 ? '1 SMS' : `${Math.ceil(text.length / 153)} SMS`) : 'Unicode';
    return (
        <figure className={'m-0 max-w-[320px] rounded-[1.25rem] rounded-bl-md glass-panel !shadow-[var(--shadow-card)] overflow-hidden ' + className}>
            <div className="px-4 pt-3 pb-2 text-[16px] leading-6 font-medium text-[var(--ink)]">{text}</div>
            <figcaption className="px-4 py-2 border-t border-[color:var(--glass-border-strong)] text-[12px] leading-4 font-semibold text-[var(--text-muted)] tabular">{from}{time ? ' · ' + time : ''} · {text.length} chars · {parts}</figcaption>
        </figure>
    );
}

/* ---------- SmsThread ---------- */
/** The three demo messages for Lot L-03 in the current (or a fixed) language. */
export function SmsThread({ lang, only, className = '' }: { lang?: Lang; only?: 'slot' | 'advance' | 'balance'; className?: string }) {
    const ctx = useI18n();
    const l = lang ?? ctx.lang;
    return (
        <div className={'flex flex-col gap-4 ' + className} lang={l === 'hil' ? 'hil' : l}>
            {SMS.filter((m) => !only || m.key === only).map((m) => <SmsBubble key={m.key} text={(m.text as any)[l]} time={m.time} />)}
        </div>
    );
}

/* ---------- LanguageSwitcher ---------- */
export function LanguageSwitcher({ showDraftNote = true, className = '' }: { showDraftNote?: boolean; className?: string }) {
    const { lang, setLang, t } = useI18n();
    const cur = LANGS.find((l) => l.id === lang)!;
    return (
        <div className={'inline-flex flex-col items-end gap-1 ' + className}>
            <div role="radiogroup" aria-label={t('lang.label')} className="inline-flex p-1 rounded-full glass-panel !shadow-none">
                {LANGS.map((l) => (
                    <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} lang={l.id === 'hil' ? 'hil' : l.id} title={l.name}
                        onClick={() => setLang(l.id as Lang)}
                        className={`min-w-[44px] min-h-[36px] px-3 rounded-full text-[13px] font-extrabold tracking-[0.06em] ${lang === l.id ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)]'}`}>
                        {l.short}
                    </button>
                ))}
            </div>
            {showDraftNote && cur.draft && <span className="text-[12px] font-bold text-[var(--warning-ink)] flex items-center gap-1"><Icon name="Alert" size={14} />{t('lang.draft')}</span>}
        </div>
    );
}

/* ---------- Terraces (internal; empty states + end card only) ---------- */
export function Terraces({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 320 120" className={className} aria-hidden preserveAspectRatio="xMidYMax slice">
            <path d="M0 52 L70 40 L150 46 L230 32 L320 40 L320 120 L0 120Z" fill="var(--terrace-1)" />
            <path d="M0 78 L90 66 L170 72 L250 60 L320 66 L320 120 L0 120Z" fill="var(--terrace-2)" />
            <path d="M0 100 L60 92 L140 98 L220 88 L320 94 L320 120 L0 120Z" fill="var(--terrace-3)" />
        </svg>
    );
}

/* ---------- EmptyState ---------- */
export function EmptyState({ variant = 'empty', title, body, action, onAction, className = '' }: { variant?: 'empty' | 'error' | 'success'; title: string; body?: ReactNode; action?: string; onAction?: () => void; className?: string }) {
    const { t } = useI18n(); title = tx(t, title); body = tx(t, body); action = tx(t, action);
    const icon = variant === 'error' ? 'Alert' : variant === 'success' ? 'CircleCheck' : null;
    const tone = variant === 'error' ? 'text-[var(--danger-ink)]' : variant === 'success' ? 'text-[var(--success-ink)]' : '';
    return (
        <div role={variant === 'error' ? 'alert' : 'status'} className={'glass-panel rounded-[2rem] overflow-hidden text-center ' + className}>
            {variant === 'empty' && <Terraces className="w-full h-28 block" />}
            <div className="p-6">
                {icon && <div className={`mx-auto w-14 h-14 flex items-center justify-center rounded-full border-[3px] border-current ${tone}`}><Icon name={icon} size={28} /></div>}
                <h3 className={`mt-3 text-[20px] leading-7 font-extrabold ${tone}`}>{title}</h3>
                {body && <p className="mt-2 text-[16px] leading-6 font-medium text-[var(--text-secondary)]">{body}</p>}
                {action && <button type="button" onClick={onAction} className="btn-2026 mt-5"><Icon name={variant === 'error' ? 'Retry' : variant === 'success' ? 'ArrowRight' : 'Plus'} size={22} /><span>{action}</span></button>}
            </div>
        </div>
    );
}

/* ---------- EndCard ---------- */
export function EndCard({ logoSrc, title = 'One cluster. One hundred farms. 80% paid within 24 hours.', team = 'Team Syntaxure Labs · ISUFST · Enactus Philippines 2026', className = '' }: { logoSrc?: string; title?: string; team?: string; className?: string }) {
    return (
        <section className={'relative overflow-hidden bg-[var(--brand-green)] text-white flex flex-col ' + className}>
            <div className="relative z-10 p-12 flex-1 flex flex-col items-start justify-center gap-6">
                {logoSrc && <img src={logoSrc} alt="RiceConnect" className="h-24 w-auto" />}
                <h2 className="max-w-[16ch] text-[56px] leading-[60px] font-extrabold tracking-[-0.03em]">{title}</h2>
                <p className="text-[18px] font-semibold text-white/90">{team}</p>
                <DemoChip />
            </div>
            <svg viewBox="0 0 320 80" className="relative w-full h-40 block" preserveAspectRatio="none" aria-hidden>
                <path d="M0 22 L70 12 L150 18 L230 6 L320 12 L320 80 L0 80Z" style={{ fill: "var(--emerald-900)" }} />
                <path d="M0 44 L90 34 L170 40 L250 28 L320 34 L320 80 L0 80Z" style={{ fill: "var(--emerald-800)" }} />
                <path d="M0 62 L60 56 L140 60 L220 52 L320 56 L320 80 L0 80Z" style={{ fill: "var(--brand-gold)" }} opacity=".9" />
            </svg>
        </section>
    );
}

/* ---------- PillButton helper re-export types ---------- */
export type PillProps = ButtonHTMLAttributes<HTMLButtonElement>;
