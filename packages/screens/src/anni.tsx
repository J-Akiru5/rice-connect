'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AlertDialog, Dialog, Icon, PrimaryButton, TextInput, useI18n, useToast, useZone, type Zone } from '@rc/ui';
import {
    AnniChatError,
    useAnniChat,
    useCancelOrder,
    useCreateOrder,
    useMarkPaid,
    type AnniChatMessage
} from '@rc/data';
import { makeRiceOrder } from '@rc/domain/buyers';
import { peso } from '@rc/domain/money';
import type { AnniProposal } from '@rc/ai/anni';
import type { SessionRole } from '@rc/store';

/* ANNI, the RiceConnect Farm Assistant (out-of-plan owner request, docs/DECISIONS.md M42). Floating head
   bubble bottom-right; opens a side panel on desktop and a full-height sheet on mobile. Advice-only: the
   `/api/anni` route answers from Gemini and writes nothing. Mounted inside each app's RoleGuard. */

const ENDPOINT: Record<Zone, string> = {
    main: '/api/anni',
    buyer: '/buyer/api/anni',
    driver: '/driver/api/anni',
    farmer: '/farmer/api/anni'
};
const HEAD: Record<Zone, string> = {
    main: '/brand/anni/anni-head.png',
    buyer: '/buyer/brand/anni/anni-head.png',
    driver: '/driver/brand/anni/anni-head.png',
    farmer: '/farmer/brand/anni/anni-head.png'
};
const ROLE: Record<Zone, SessionRole> = { main: 'coordinator', buyer: 'buyer', driver: 'driver', farmer: 'farmer' };

type ChatMessage = { who: 'user' | 'anni'; text: string };

function Bubble({ who, children }: { who: 'user' | 'anni'; children: ReactNode }) {
    return who === 'user' ? (
        <p className="m-0 self-end max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-[15px] leading-6 font-semibold bg-[var(--fill-strong)] text-[var(--on-fill-strong)] break-words">
            {children}
        </p>
    ) : (
        <p className="m-0 self-start max-w-[92%] glass-panel !shadow-none rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[15px] leading-6 font-semibold text-[var(--ink)] break-words">
            {children}
        </p>
    );
}

export function AnniDock() {
    const { t } = useI18n();
    const toast = useToast();
    const zone = useZone();
    const chat = useAnniChat(ENDPOINT[zone]);
    const createOrder = useCreateOrder();
    const cancelOrder = useCancelOrder();
    const markPaid = useMarkPaid();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [proposal, setProposal] = useState<AnniProposal | null>(null);
    const [text, setText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const uid = useId();
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, [messages, chat.isPending, open, error]);

    const run = async (history: ChatMessage[]) => {
        try {
            const reply = await chat.mutateAsync({
                messages: history.map<AnniChatMessage>((m) => ({
                    role: m.who === 'user' ? 'user' : 'anni',
                    text: m.text
                })),
                role: ROLE[zone]
            });
            if (reply.proposal) {
                setProposal(reply.proposal);
                return;
            }
            setMessages([...history, { who: 'anni', text: reply.text }]);
        } catch (e) {
            setError(
                e instanceof AnniChatError && e.code === 'not_configured' ? t('anni.notConfigured') : t('anni.error')
            );
        }
    };
    const send = (value: string) => {
        const content = value.trim();
        if (!content || chat.isPending) return;
        setText('');
        setError(null);
        void run([...messages, { who: 'user', text: content }]);
    };
    const retry = () => {
        if (chat.isPending) return;
        setError(null);
        void run(messages);
    };

    return (
        <>
            <button
                type="button"
                aria-label={t('anni.launch')}
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="fixed right-4 bottom-[84px] md:bottom-6 z-30 inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full glass-panel glass-fill-strong p-1.5 rc-hover-accent"
            >
                <img src={HEAD[zone]} alt="" width={56} height={56} className="h-full w-full object-contain" />
            </button>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                title={t('anni.title')}
                hideTitle
                closeLabel={t('action.close')}
                className="!left-auto !top-0 !right-0 !translate-x-0 !translate-y-0 !h-[100dvh] !max-h-none !w-full md:!w-[420px] !max-w-none !rounded-none md:!rounded-l-[2rem] md:!rounded-r-none !p-0 !overflow-hidden flex flex-col"
                bodyClassName="mt-0 flex-1 min-h-0 flex flex-col"
            >
                <div className="flex items-center gap-3 p-5 pr-16">
                    <img src={HEAD[zone]} alt="" width={44} height={44} className="h-11 w-11 shrink-0 object-contain" />
                    <div className="min-w-0">
                        <p className="m-0 text-[18px] font-extrabold">{t('anni.title')}</p>
                        <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)]">{t('anni.sub')}</p>
                    </div>
                </div>
                <p className="m-0 px-5 pb-2 text-[12px] leading-4 font-semibold text-[var(--text-muted)]">
                    {t('anni.disclaimer')}
                </p>
                <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 flex flex-col gap-3">
                    <Bubble who="anni">{t('anni.greeting')}</Bubble>
                    {messages.map((m, i) => (
                        <Bubble key={i} who={m.who}>
                            {m.text}
                        </Bubble>
                    ))}
                    {chat.isPending && (
                        <p
                            role="status"
                            className="m-0 self-start glass-panel !shadow-none rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[15px] leading-6 font-semibold text-[var(--text-secondary)]"
                        >
                            {t('anni.thinking')}
                        </p>
                    )}
                    {error && (
                        <div
                            role="alert"
                            className="self-start max-w-[92%] rounded-2xl bg-[var(--danger-soft)] text-[var(--danger-ink)] px-3.5 py-2.5 flex flex-col items-start gap-2 text-[14px] leading-5 font-semibold"
                        >
                            <span className="flex items-start gap-2">
                                <Icon name="Alert" size={20} className="shrink-0" />
                                {error}
                            </span>
                            <button
                                type="button"
                                onClick={retry}
                                className="inline-flex items-center gap-2 min-h-[40px] px-3 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                            >
                                <Icon name="RefreshCw" size={18} />
                                {t('error.retry')}
                            </button>
                        </div>
                    )}
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        send(text);
                    }}
                    className="border-t border-[color:var(--glass-border)] p-4 flex items-center gap-2 bg-[var(--glass-fill-strong)]"
                >
                    <label htmlFor={`${uid}-anni`} className="sr-only">
                        {t('anni.inputLabel')}
                    </label>
                    <TextInput
                        id={`${uid}-anni`}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t('anni.placeholder')}
                        autoComplete="off"
                        maxLength={4000}
                        className="!text-base min-w-0 flex-1"
                    />
                    <PrimaryButton type="submit" icon="Send" disabled={!text.trim() || chat.isPending}>
                        {t('anni.send')}
                    </PrimaryButton>
                </form>
            </Dialog>
            {proposal?.kind === 'create_order' &&
                (() => {
                    const p = proposal.params;
                    const order = makeRiceOrder(p.type, p.sacks, p.week, 1);
                    return (
                        <AlertDialog
                            open
                            onOpenChange={(o) => {
                                if (!o) setProposal(null);
                            }}
                            title={t('anni.order.title')}
                            description={t('anni.order.body', {
                                sacks: p.sacks,
                                type: t(`buyer.type.${p.type}`),
                                week: p.week,
                                total: peso(order.total)
                            })}
                            confirmLabel={t('anni.order.confirm')}
                            onConfirm={() => {
                                setProposal(null);
                                void createOrder
                                    .mutateAsync({ type: p.type, sacks: p.sacks, week: p.week })
                                    .then((o) =>
                                        toast.show(t('anni.order.done', { id: o.id, total: peso(o.total) }), {
                                            label: t('action.undo'),
                                            onClick: () => {
                                                void cancelOrder.mutateAsync({ id: o.id });
                                            }
                                        })
                                    )
                                    .catch(() => toast.show(t('anni.action.failed')));
                            }}
                        />
                    );
                })()}
            {proposal?.kind === 'mark_paid' && (
                <AlertDialog
                    open
                    onOpenChange={(o) => {
                        if (!o) setProposal(null);
                    }}
                    title={t('anni.paid.title')}
                    description={t('anni.paid.body', { lot: proposal.params.lotId })}
                    confirmLabel={t('anni.paid.confirm')}
                    typedWord={proposal.params.lotId}
                    onConfirm={() => {
                        const lotId = proposal.params.lotId;
                        setProposal(null);
                        void markPaid
                            .mutateAsync({ lotId })
                            .then(() => toast.show(t('anni.paid.done', { lot: lotId })))
                            .catch(() => toast.show(t('anni.action.failed')));
                    }}
                />
            )}
        </>
    );
}
