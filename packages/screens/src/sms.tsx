'use client';
import { ReactNode, useState } from 'react';
import { ZLink } from '@rc/ui';
import {
    AppShell,
    ChatComposer,
    ChatDay,
    ChatHeader,
    ChatMessage,
    ChatThread,
    DemoChip,
    ErrorState,
    Icon,
    LANGS,
    LoadingState,
    PhoneFrame,
    PhoneShell,
    PhoneStage,
    SmsThread,
    StatusChip,
    T,
    TeamFooter,
    chatClock,
    smsParts,
    useI18n,
    useToast,
    type ChatState,
    type Lang
} from '@rc/ui';
import { useFramed } from './shell';
import { useSmsReplies, useSmsReply, useSmsThread } from '@rc/data';
import { isLive } from '@rc/ui/mode';
import type { SmsMessage } from '@rc/domain/schemas';
import { HERO_FARM, HERO_LOT, SLOT } from '@rc/domain/seed';

/** /sms — the three messages the farmer gets for Lot L-03, in the header language.
    Always on a phone: inside the website shell the PhoneFrame is the farmer's phone; in /demo or ?frame=phone the whole
    screen is the coordinator's phone shell (as in the canvas board). */
/** The sender the farmer sees: the cooperative, over SMS. */
const FROM = 'RiceConnect';
/** What the thread is about: one lot, one channel. */
const META = (t: ReturnType<typeof useI18n>['t']) => `${t('unit.lot')} ${HERO_LOT.id} · ${t('nav.sms')}`;
/** What the system says about a reply: live reports the outcome, demo echoes the slot SMS it parsed. */
const replyOutcome = (t: ReturnType<typeof useI18n>['t'], action: 'ok' | 'move' | null) =>
    isLive
        ? t(action === 'ok' ? 'sms.reply.accepted' : action === 'move' ? 'sms.reply.moved' : 'sms.reply.unclear')
        : t(action === 'ok' ? 'sms.reply.ok' : action === 'move' ? 'sms.reply.move' : 'sms.reply.unknown', {
              slot: SLOT.id
          });

type Entry =
    | { kind: 'day'; id: string; label: string }
    | {
          kind: 'msg';
          id: string;
          mine: boolean;
          text: string;
          time?: string;
          caption?: ReactNode;
          extra?: ReactNode;
          state?: ChatState;
      };

/** One conversation, built from the thread's system SMS (the repository thread, in the header language)
    and the replies typed in this app (the store), split by day the way a phone splits a thread.
    `sending` is the message in flight, shown as its own bubble until the store takes it over. */
function threadEntries({
    t,
    lang,
    messages,
    replies,
    sending
}: {
    t: ReturnType<typeof useI18n>['t'];
    lang: Lang;
    messages: SmsMessage[];
    replies: { id: string; farm: string; text: string; action: 'ok' | 'move' | null; at?: string }[];
    sending: string | null;
}): Entry[] {
    const entries: Entry[] = [];
    let day = '';
    messages.forEach((m) => {
        if (m.time !== day) {
            day = m.time;
            entries.push({ kind: 'day', id: 'day-' + m.key, label: m.time });
        }
        const text = m.text[lang];
        entries.push({
            kind: 'msg',
            id: m.key,
            mine: false,
            text,
            caption: `${FROM} · ${text.length} ${t('sms.chars')} · ${t('chat.parts', { n: smsParts(text) })}`
        });
    });
    /* Demo replies are the hero conversation; live rows are already scoped by RLS to this reader. */
    const mine = isLive ? replies : replies.filter((r) => r.farm === HERO_FARM.id);
    if (mine.length > 0) entries.push({ kind: 'day', id: 'day-now', label: t('chat.today') });
    mine.forEach((r) =>
        entries.push({
            kind: 'msg',
            id: r.id,
            mine: true,
            text: r.text,
            time: chatClock(r.at),
            /* A reply the system understood was read and acted on; anything else only arrived. */
            state: r.action ? 'read' : 'delivered',
            extra: (
                <StatusChip
                    status={r.action === 'ok' ? 'paid' : r.action === 'move' ? 'pending' : 'failed'}
                    label={replyOutcome(t, r.action)}
                />
            )
        })
    );
    if (sending) entries.push({ kind: 'msg', id: 'sending', mine: true, text: sending, state: 'sending' });
    return entries;
}

function renderEntry(e: Entry) {
    if (e.kind === 'day') return <ChatDay key={e.id} label={e.label} />;
    return (
        <ChatMessage
            key={e.id}
            mine={e.mine}
            text={e.text}
            time={e.time}
            caption={e.caption}
            extra={e.extra}
            state={e.state}
        />
    );
}

export function SmsScreen({ reply = false }: { reply?: boolean }) {
    const { t, lang } = useI18n();
    const framed = useFramed();
    const thread = useSmsThread();
    const replies = useSmsReplies();
    const mutation = useSmsReply();
    const toast = useToast();
    const [sending, setSending] = useState<string | null>(null);
    const loading = thread.isPending || replies.isPending;
    const failed = thread.isError || replies.isError;
    const retry = () => {
        void thread.refetch();
        void replies.refetch();
    };
    const states = loading ? <LoadingState rows={3} /> : failed ? <ErrorState onRetry={retry} /> : null;
    /* Gate 3: the messages come from the repository thread (mock in demo, Supabase in live). */
    const messages = thread.data ?? [];

    const send = async (raw: string) => {
        const text = raw.trim();
        if (!text || mutation.isPending) return;
        setSending(text);
        try {
            const stored = await mutation.mutateAsync({ text });
            toast.show(replyOutcome(t, stored.action));
        } catch {
            /* The store surfaces the error through the thread state; the bubble stops being "sending". */
        } finally {
            setSending(null);
        }
    };

    const entries = threadEntries({ t, lang, messages, replies: replies.data ?? [], sending });
    const quick = [
        { label: t('sms.reply.quickOk'), text: '1 OK', icon: 'Check' },
        { label: t('sms.reply.quickMove'), text: '2 Move', icon: 'Clock' }
    ];
    const allLink = (
        <ZLink
            href="/sms?all=1"
            className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
        >
            <Icon name="Language" size={24} />
            <span>{t('sms.all.link')}</span>
        </ZLink>
    );
    const note = (
        <p className="glass-panel !shadow-none m-0 px-4 py-3 rounded-2xl text-[16px] leading-6 font-semibold">
            <T k="sms.note" />
        </p>
    );
    /* Pay opens the hero lot — a demo lot, so a live thread never shows it. */
    const payLink = (
        <ZLink
            href={`/pay/${HERO_LOT.id}`}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-[2rem] border-2 border-[color:var(--text-accent)] text-[var(--text-accent)] text-[13px] font-extrabold uppercase tracking-[0.08em]"
        >
            <Icon name="Pay" size={20} />
            <span>{t('pay.open', { lot: HERO_LOT.id })}</span>
        </ZLink>
    );

    if (framed)
        return (
            <PhoneStage>
                <PhoneShell role="farmer" title="sms.title" active="sms">
                    <div className="flex flex-col gap-4">
                        {note}
                        <div className="panel-solid rounded-[1.75rem] overflow-hidden">
                            {states ?? (
                                <>
                                    <ChatHeader name={FROM} meta={META(t)} />
                                    <ChatThread ariaLabel={t('sms.title')} className="p-3">
                                        {entries.map(renderEntry)}
                                    </ChatThread>
                                    {reply && (
                                        <ChatComposer
                                            onSend={(text) => void send(text)}
                                            pending={mutation.isPending}
                                            quickReplies={quick}
                                            placeholder={t('sms.reply.placeholder')}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                        {allLink}
                    </div>
                </PhoneShell>
            </PhoneStage>
        );

    /* The last thing said, for the conversation list: the reply if the farmer has sent one. */
    const said = entries.filter((e): e is Extract<Entry, { kind: 'msg' }> => e.kind === 'msg');
    const last = said[said.length - 1];
    return (
        <AppShell role="farmer" title="sms.title" active="sms">
            {/* Wide content: a desktop chat (derived, not in canvas). Conversation list left, the thread right. */}
            <div className="cq-wide-only panel-solid rounded-[1.75rem] overflow-hidden grid grid-cols-[minmax(260px,320px)_minmax(0,1fr)] min-h-[660px]">
                <nav
                    aria-label={t('sms.conversations')}
                    className="border-r border-[color:var(--glass-border-strong)] flex flex-col"
                >
                    <h2 className="px-4 pt-4 pb-2 text-[19px] leading-6 font-extrabold tracking-[-0.02em] text-[var(--ink)]">
                        {t('sms.conversations')}
                    </h2>
                    <ul className="list-none m-0 p-0">
                        <li>
                            <a
                                href="#sms-thread"
                                aria-current="true"
                                className="flex items-start gap-3 px-4 py-3.5 min-h-[72px] rc-bg-highlight border-l-4 border-[color:var(--fill-strong)]"
                            >
                                <span className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-[var(--fill-strong)] text-[var(--on-fill-strong)]">
                                    <Icon name="Sms" size={22} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-baseline justify-between gap-2 flex-wrap">
                                        <span className="text-[17px] font-extrabold break-words">{FROM}</span>
                                        <span className="text-[13px] font-semibold text-[var(--text-secondary)] tabular">
                                            {last?.time ?? messages[messages.length - 1]?.time}
                                        </span>
                                    </span>
                                    <span className="block text-[15px] leading-6 font-medium text-[var(--text-secondary)] break-words">
                                        {last?.text}
                                    </span>
                                </span>
                            </a>
                        </li>
                    </ul>
                    <p className="mt-auto m-0 p-4 text-[15px] leading-6 font-semibold text-[var(--text-secondary)]">
                        <T k="sms.note" />
                    </p>
                </nav>
                <section id="sms-thread" aria-labelledby="sms-thread-h" className="flex flex-col min-w-0" lang={lang}>
                    <div className="flex flex-col min-w-0">
                        <ChatHeader
                            name={<span id="sms-thread-h">{FROM}</span>}
                            meta={isLive ? META(t) : `${META(t)} · ${HERO_FARM.mobile}`}
                            action={isLive ? undefined : payLink}
                        />
                        {states ?? (
                            <ChatThread ariaLabel={t('sms.title')} className="flex-1 p-5">
                                {entries.map(renderEntry)}
                            </ChatThread>
                        )}
                        {reply && (
                            <ChatComposer
                                onSend={(text) => void send(text)}
                                pending={mutation.isPending}
                                quickReplies={quick}
                                placeholder={t('sms.reply.placeholder')}
                            />
                        )}
                    </div>
                    <footer className="mt-auto flex items-center justify-between gap-3 flex-wrap px-5 py-3 border-t border-[color:var(--glass-border-strong)]">
                        <span className="text-[14px] font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                            <Icon name="Info" size={20} />
                            {t('sms.readonly')}
                        </span>
                        {allLink}
                        <ZLink
                            href="/slip"
                            className="inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                        >
                            <Icon name="Slip" size={24} />
                            <span>{t('slip.view')}</span>
                        </ZLink>
                    </footer>
                </section>
            </div>
            {/* Narrow content: the farmer's phone, which is where this conversation actually happens. */}
            <div className="cq-narrow-only flex flex-col gap-4 items-center">
                {note}
                <div className="eyebrow w-full max-w-[640px]">{t('sms.inbox', { farm: HERO_FARM.id })}</div>
                <PhoneFrame className="max-w-full shadow-[var(--shadow-popover)]">
                    <div className="rc-ground min-h-full flex flex-col">
                        {states ?? (
                            <>
                                <ChatHeader name={FROM} meta={META(t)} />
                                <ChatThread ariaLabel={t('sms.title')} autoScroll className="flex-1 p-3">
                                    {entries.map(renderEntry)}
                                </ChatThread>
                                {reply && (
                                    <ChatComposer
                                        onSend={(text) => void send(text)}
                                        pending={mutation.isPending}
                                        quickReplies={quick}
                                        placeholder={t('sms.reply.placeholder')}
                                    />
                                )}
                            </>
                        )}
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
                    <h1 className="m-0 text-[38px] leading-[44px] font-extrabold tracking-[-0.03em] uppercase">
                        {t('sms.all.title', { lot: HERO_LOT.id })}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <DemoChip />
                        <ZLink
                            href="/sms"
                            className="inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                        >
                            <Icon name="ChevronLeft" size={20} />
                            {t('nav.sms')}
                        </ZLink>
                    </div>
                </div>
                <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
                    {LANGS.map((l) => (
                        <section
                            key={l.id}
                            aria-labelledby={`sms-${l.id}`}
                            className="panel-solid rounded-[1.75rem] p-5 md:p-6"
                        >
                            <h2 id={`sms-${l.id}`} className="m-0 text-[22px] font-extrabold tracking-[-0.02em]">
                                {l.name}
                            </h2>
                            {l.draft && (
                                <p className="mt-1 text-[13px] font-bold text-[var(--warning-ink)] flex items-center gap-1">
                                    <Icon name="Alert" size={16} />
                                    <T k="lang.draft" />
                                </p>
                            )}
                            <SmsThread lang={l.id} className="mt-3" />
                        </section>
                    ))}
                </div>{' '}
                <p className="mt-8 text-[16px] leading-7 font-semibold text-[var(--text-secondary)]">
                    {t('sms.ascii')}
                </p>
            </div>
            <TeamFooter />
        </div>
    );
}
