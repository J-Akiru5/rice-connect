'use client';
import { ZLink, useZoneNav } from '@rc/ui';
import { AppShell, DemoChip, Icon, LANGS, PhoneFrame, PhoneShell, PhoneStage, PrimaryButton, SecondaryButton, SmsBubble, SmsThread, StatusChip, T, TeamFooter, useI18n } from '@rc/ui';
import { useFramed } from './shell';
import { useState } from 'react';
import { useDemoState, updateDemoState } from '@rc/store/react';
import { farmerReply } from '@rc/store';
import { HAUL, HERO_FARM, HERO_LOT, SLOT, SMS } from "@rc/domain/seed";

/** /sms — the three messages the farmer gets for Lot L-03, in the header language.
    Always on a phone: inside the website shell the PhoneFrame is the farmer's phone; in /demo or ?frame=phone the whole
    screen is the coordinator's phone shell (as in the canvas board). */
/** Farmer replies typed in the farmer app, as chat bubbles. `mine` = seen from the farmer's own phone (right side). */
function Replies({ mine }: { mine: boolean }) {
    const { t } = useI18n();
    const replies = useDemoState().smsReplies.filter((r) => r.farm === HERO_FARM.id);
    return (
        <>
            {replies.map((r) => (
                <li key={r.id} className={`flex flex-col gap-1 ${mine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[min(420px,85%)] rounded-[1.25rem] px-4 py-3 text-[16px] leading-6 font-medium ${mine ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)] rounded-br-md' : 'glass-panel rounded-bl-md'}`}>{r.text}</div>
                    <StatusChip status={r.action === 'ok' ? 'paid' : r.action === 'move' ? 'pending' : 'failed'} label={t(r.action === 'ok' ? 'sms.reply.ok' : r.action === 'move' ? 'sms.reply.move' : 'sms.reply.unknown', { slot: SLOT.id })} />
                </li>
            ))}
        </>
    );
}

/** The farmer answers the slot SMS (farmer app only): quick replies or free text, parsed by parseSmsReply. */
function ReplyBox() {
    const { t } = useI18n();
    const [text, setText] = useState('');
    const send = (v: string) => { if (!v.trim()) return; updateDemoState(farmerReply(v, { farm: HERO_FARM.id, slot: SLOT.id, haul: HAUL.id })); setText(''); };
    return (
        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex flex-col gap-2" aria-label={t('sms.reply.label')}>
            <div className="flex flex-wrap gap-2">
                <SecondaryButton icon="Check" onClick={() => send('1 OK')}>{t('sms.reply.quickOk')}</SecondaryButton>
                <SecondaryButton icon="Clock" onClick={() => send('2 Move')}>{t('sms.reply.quickMove')}</SecondaryButton>
            </div>
            <div className="flex gap-2 items-stretch flex-wrap">
                <label className="flex-1 min-w-[180px]"><span className="sr-only">{t('sms.reply.label')}</span>
                    <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t('sms.reply.placeholder')} className="input-2026 !text-base" /></label>
                <PrimaryButton icon="Send" type="submit">{t('sms.reply.send')}</PrimaryButton>
            </div>
        </form>
    );
}

export function SmsScreen({ reply = false }: { reply?: boolean }) {
    const { t, lang } = useI18n();
    const framed = useFramed();
    const allLink = (
        <ZLink href="/sms?all=1" className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]">
            <Icon name="Language" size={24} /><span>{t('sms.all.link')}</span>
        </ZLink>
    );
    if (framed) return (
        <PhoneStage>
            <PhoneShell title="sms.title" active="sms">
                <div className="flex flex-col gap-4">
                    <p className="glass-panel !shadow-none m-0 px-4 py-3 rounded-2xl text-[16px] leading-6 font-semibold"><T k="sms.note" /></p>
                    <div className="glass-panel rounded-[1.5rem] p-4"><SmsThread /></div>
                    {allLink}
                </div>
            </PhoneShell>
        </PhoneStage>
    );
    const last = SMS[SMS.length - 1];
    return (
        <AppShell role="farmer" title="sms.title" active="sms">
            {/* Wide content: a desktop chat (derived, not in canvas). Conversation list left, the thread right. */}
            <div className="cq-wide-only glass-panel rounded-[1.5rem] overflow-hidden grid grid-cols-[minmax(240px,300px)_minmax(0,1fr)] min-h-[620px]">
                <nav aria-label={t('sms.conversations')} className="border-r border-[color:var(--glass-border-strong)] flex flex-col">
                    <h2 className="eyebrow px-4 pt-4 pb-2">{t('sms.conversations')}</h2>
                    <ul>
                        <li>
                            <a href="#sms-thread" aria-current="true" className="flex items-start gap-3 px-4 py-3 min-h-[64px] bg-[rgba(2,70,53,.08)] border-l-4 border-[color:var(--fill-strong)]">
                                <span className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[var(--fill-strong)] text-[var(--on-fill-strong)]"><Icon name="User" size={20} /></span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-baseline justify-between gap-2 flex-wrap">
                                        <span className="text-[15px] font-extrabold break-words">{HERO_FARM.name}</span>
                                        <span className="text-[12px] font-semibold text-[var(--text-secondary)] tabular">{last.time}</span>
                                    </span>
                                    <span className="block text-[14px] leading-5 font-medium text-[var(--text-secondary)] break-words">{last.text[lang]}</span>
                                </span>
                            </a>
                        </li>
                    </ul>
                    <p className="mt-auto m-0 p-4 text-[14px] leading-5 font-semibold text-[var(--text-secondary)]"><T k="sms.note" /></p>
                </nav>
                <section id="sms-thread" aria-labelledby="sms-thread-h" className="flex flex-col min-w-0" lang={lang}>
                    <header className="flex items-center gap-3 flex-wrap px-5 py-4 border-b border-[color:var(--glass-border-strong)]">
                        <div className="min-w-0 flex-1">
                            <h2 id="sms-thread-h" className="text-[18px] leading-6 font-extrabold break-words">{HERO_FARM.name}</h2>
                            <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)] tabular break-words">{HERO_FARM.mobile} · {HERO_FARM.barangay}</p>
                        </div>
                        <ZLink href={`/pay/${HERO_LOT.id}`} className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-[2rem] border-2 border-[color:var(--text-accent)] text-[var(--text-accent)] text-[13px] font-extrabold uppercase tracking-[0.08em]">
                            <Icon name="Pay" size={20} /><span>{t('pay.open', { lot: HERO_LOT.id })}</span>
                        </ZLink>
                    </header>
                    <ol className="flex-1 flex flex-col gap-5 px-5 py-6" aria-label={t('sms.title')}>
                        {SMS.map((m) => (
                            <li key={m.key} className="flex flex-col items-end gap-2">
                                <span className="self-center glass-panel !shadow-none px-3 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)] tabular">{m.time}</span>
                                <SmsBubble text={m.text[lang]} time={m.time} className="max-w-[min(520px,85%)]" />
                            </li>
                        ))}
                        <Replies mine={false} />
                    </ol>
                    {reply && <div className="px-5 pb-4"><ReplyBox /></div>}
                    <footer className="flex items-center justify-between gap-3 flex-wrap px-5 py-3 border-t border-[color:var(--glass-border-strong)]">
                        <span className="text-[14px] font-semibold text-[var(--text-secondary)] flex items-center gap-2"><Icon name="Info" size={20} />{t('sms.readonly')}</span>
                        {allLink}
                        <ZLink href="/slip" className="inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"><Icon name="Slip" size={24} /><span>{t('slip.view')}</span></ZLink>
                    </footer>
                </section>
            </div>
            {/* Narrow content: the farmer's phone. */}
            <div className="cq-narrow-only flex flex-col gap-4 items-center">
                <p className="glass-panel !shadow-none m-0 px-4 py-3 rounded-2xl text-[16px] leading-6 font-semibold max-w-[640px] w-full"><T k="sms.note" /></p>
                <PhoneFrame className="max-w-full shadow-[var(--shadow-popover)]">
                    <div className="rc-ground min-h-full p-4 flex flex-col gap-3">
                        <div className="eyebrow">{t('sms.inbox', { farm: HERO_FARM.id })}</div>
                        <SmsThread />
                        <ul className="flex flex-col gap-3"><Replies mine /></ul>
                        {reply && <ReplyBox />}
                    </div>
                </PhoneFrame>
                {allLink}
            </div>
        </AppShell>
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
                        <ZLink href="/sms" className="inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"><Icon name="ChevronLeft" size={20} />{t('nav.sms')}</ZLink>
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
