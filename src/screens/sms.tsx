'use client';
import Link from 'next/link';
import { DemoChip, Icon, LANGS, PhoneShell, SmsThread, T, TeamFooter, useI18n } from '@/components/riceconnect';
import { HERO_LOT } from "@/data/seed";

/** /sms — the three messages the farmer gets for Lot L-03, in the header language (phone). */
export function SmsScreen() {
    const { t } = useI18n();
    return (
        <PhoneShell title="sms.title" active="sms">
            <div className="flex flex-col gap-4">
                <p className="glass-panel !shadow-none m-0 px-4 py-3 rounded-2xl text-[16px] leading-6 font-semibold"><T k="sms.note" /></p>
                <div className="glass-panel rounded-[1.5rem] p-4"><SmsThread /></div>
                <Link href="/sms?all=1" className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]">
                    <Icon name="Language" size={24} /><span>{t('sms.all.link')}</span>
                </Link>
            </div>
        </PhoneShell>
    );
}

/** /sms?all=1 — the design's SMS-All-Languages board (desktop). */
export function SmsAllScreen() {
    const { t } = useI18n();
    return (
        <div className="rc-ground min-h-screen flex flex-col">
            <div className="flex-1 p-[clamp(16px,4vw,48px)]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h1 className="m-0 text-[32px] leading-9 font-extrabold tracking-[-0.03em] uppercase">{t('sms.all.title', { lot: HERO_LOT.id })}</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <DemoChip />
                        <Link href="/sms" className="inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"><Icon name="ChevronLeft" size={20} />{t('nav.sms')}</Link>
                    </div>
                </div>
                <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
                    {LANGS.map((l) => (
                        <section key={l.id} aria-labelledby={`sms-${l.id}`} className="glass-panel rounded-[1.5rem] p-5">
                            <h2 id={`sms-${l.id}`} className="m-0 text-[20px] font-extrabold">{l.name}</h2>
                            {l.draft && <p className="mt-1 text-[13px] font-bold text-[var(--warning-ink)] flex items-center gap-1"><Icon name="Alert" size={16} /><T k="lang.draft" /></p>}
                            <SmsThread lang={l.id} className="mt-3" />
                        </section>
                    ))}
                </div>
                <p className="mt-8 text-[15px] leading-[22px] font-semibold text-[var(--text-secondary)]">{t('sms.ascii')}</p>
            </div>
            <TeamFooter />
        </div>
    );
}
