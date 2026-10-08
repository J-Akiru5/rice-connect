'use client';
import { PropsWithChildren, ReactNode, useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon';
import SecondaryButton from './SecondaryButton';
import { useI18n } from '@rc/i18n';

/* ================================================================
   Chat kit. The farmer's screen is a phone conversation, so it is built
   from conversation parts — a header with the sender, day dividers, a
   bubble with a tail, ticks that say which step a message is on, and a
   composer that counts the SMS parts the farmer is paying for — instead
   of from cards with captions.
   Tokens only; the entrance motion is a 240ms rise and is skipped under
   prefers-reduced-motion (see .rc-bubble-in in app.css).
   ================================================================ */

/** GSM-7: 160 characters in the first part, 153 in each part after it. */
export function smsParts(text: string) {
    const gsm = /^[\x0A\x0D\x20-\x7E]*$/.test(text);
    if (!gsm) return 1;
    return text.length <= 160 ? 1 : Math.ceil(text.length / 153);
}

/** A clock time from an ISO stamp, in one fixed locale so server and client agree. */
export function chatClock(iso?: string) {
    if (!iso) return undefined;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export type ChatState = 'sending' | 'sent' | 'delivered' | 'read';

/** Sender strip: who is talking, how they reach you, and one action at most. */
export function ChatHeader({
    name,
    meta,
    avatar,
    action,
    className = ''
}: {
    name: ReactNode;
    meta?: ReactNode;
    avatar?: ReactNode;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <header
            className={
                'sticky top-0 z-20 flex items-center gap-3 px-4 py-3 glass-panel !rounded-none !shadow-none border-b border-[color:var(--glass-border)] ' +
                className
            }
        >
            <span className="shrink-0 w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-[var(--fill-strong)] text-[var(--on-fill-strong)]">
                {avatar ?? <Icon name="Sms" size={22} />}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[17px] leading-6 font-extrabold text-[var(--ink)] break-words">
                    {name}
                </span>
                {meta && (
                    <span className="block text-[13px] leading-5 font-semibold text-[var(--text-secondary)] break-words">
                        {meta}
                    </span>
                )}
            </span>
            {action}
        </header>
    );
}

/** The divider a messenger puts between days. */
export function ChatDay({ label }: { label: ReactNode }) {
    return (
        <li className="flex justify-center py-1">
            <span className="panel-solid px-3 py-1 rounded-full text-[12px] leading-4 font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)] tabular">
                {label}
            </span>
        </li>
    );
}

/** Time + the step this message is on. Ticks are the icon; the word rides along for the state that
    is not a tick at all ("Sending"), and for the reader who cannot see two strokes from one. */
function Ticks({ state }: { state?: ChatState }) {
    const { t } = useI18n();
    if (!state) return null;
    if (state === 'sending')
        return (
            <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5" aria-hidden>
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="rc-dot-pulse w-1.5 h-1.5 rounded-full bg-current"
                            style={{ animationDelay: `${i * 140}ms` }}
                        />
                    ))}
                </span>
                {t('sms.reply.sending')}
            </span>
        );
    const double = state === 'delivered' || state === 'read';
    return (
        <span className="inline-flex items-center">
            <span className="sr-only">
                {t(state === 'read' ? 'chat.read' : state === 'delivered' ? 'chat.delivered' : 'chat.sent')}
            </span>
            <Icon name="Check" size={14} strokeWidth={3} className="-mr-1.5" />
            {double && <Icon name="Check" size={14} strokeWidth={3} />}
        </span>
    );
}

/** One message. `mine` = seen from the farmer's own phone: right side, brand fill, ticks. */
export function ChatMessage({
    mine = false,
    text,
    time,
    caption,
    extra,
    state,
    className = ''
}: {
    mine?: boolean;
    text: string;
    time?: string;
    caption?: ReactNode;
    /** Anything the thread wants under the bubble outside it: a status chip, a link. */
    extra?: ReactNode;
    state?: ChatState;
    className?: string;
}) {
    return (
        <li className={`flex flex-col gap-1 rc-bubble-in ${mine ? 'items-end' : 'items-start'} ${className}`}>
            <div
                className={`max-w-[min(520px,88%)] rounded-[1.25rem] px-4 pt-3 pb-2 text-[16px] leading-6 font-medium break-words ${
                    mine
                        ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)] rounded-br-md'
                        : 'rc-bg-highlight text-[var(--ink)] rounded-bl-md border border-[color:var(--glass-border-strong)]'
                }`}
            >
                <p className="m-0 whitespace-pre-line">{text}</p>
                {(time || (mine && state)) && (
                    <span
                        className={`mt-1 flex items-center justify-end gap-1.5 text-[12px] leading-4 font-semibold tabular ${
                            mine
                                ? 'text-[color:color-mix(in_srgb,var(--on-fill-strong)_80%,transparent)]'
                                : 'text-[var(--text-muted)]'
                        }`}
                    >
                        {time}
                        {mine && <Ticks state={state} />}
                    </span>
                )}
            </div>
            {caption && (
                <span className="px-1 text-[12px] leading-4 font-semibold text-[var(--text-muted)] tabular break-words">
                    {caption}
                </span>
            )}
            {extra}
        </li>
    );
}

/** The thread. In the phone it opens at the newest message, the way a phone opens a thread. */
export function ChatThread({
    children,
    ariaLabel,
    autoScroll = false,
    className = ''
}: PropsWithChildren<{ ariaLabel?: string; autoScroll?: boolean; className?: string }>) {
    const end = useRef<HTMLLIElement>(null);
    useEffect(() => {
        if (!autoScroll) return;
        end.current?.scrollIntoView({ block: 'end' });
    }, [autoScroll, children]);
    return (
        <ol aria-label={ariaLabel} className={'flex flex-col gap-3 list-none p-0 m-0 ' + className}>
            {children}
            <li ref={end} aria-hidden className="h-px" />
        </ol>
    );
}

/** The keyboard bar: quick replies while the line is empty, then the message, the Send action and
    the running SMS count. Enter sends; the counter names the cost before the farmer pays it. */
export function ChatComposer({
    onSend,
    pending = false,
    quickReplies = [],
    placeholder,
    className = ''
}: {
    onSend: (text: string) => void;
    pending?: boolean;
    quickReplies?: { label: string; text: string; icon?: string }[];
    placeholder?: string;
    className?: string;
}) {
    const { t } = useI18n();
    /* Each composer gets its own id: the phone and the wide pane both render one, and only one of them
       is shown at a time (the other is display:none), so a shared id would label the wrong field. */
    const inputId = 'chat-message-' + useId();
    const [text, setText] = useState('');
    const parts = smsParts(text);
    const canSend = text.trim().length > 0 && !pending;
    const send = (raw: string) => {
        const value = raw.trim();
        if (!value || pending) return;
        onSend(value);
        setText('');
    };
    return (
        <div
            className={
                'sticky bottom-0 z-20 px-3 pt-2 pb-3 border-t border-[color:var(--glass-border)] bg-[var(--glass-fill-strong)] ' +
                className
            }
        >
            {quickReplies.length > 0 && text.length === 0 && (
                <div className="flex flex-wrap gap-2 pb-2" role="group" aria-label={t('sms.reply.quick')}>
                    {quickReplies.map((q) => (
                        <SecondaryButton key={q.text} icon={q.icon} disabled={pending} onClick={() => send(q.text)}>
                            {q.label}
                        </SecondaryButton>
                    ))}
                </div>
            )}
            <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    send(text);
                }}
            >
                <label htmlFor={inputId} className="sr-only">
                    {placeholder ?? t('sms.reply.label')}
                </label>
                <input
                    id={inputId}
                    name="message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    enterKeyHint="send"
                    autoComplete="off"
                    className="input-2026 !text-base flex-1"
                />
                <button
                    type="submit"
                    disabled={!canSend}
                    className={`btn-2026 shrink-0 !px-5 ${canSend ? '' : 'opacity-40 !shadow-none !transform-none cursor-not-allowed'}`}
                >
                    <Icon name="Send" size={20} />
                    <span>{t('sms.reply.send')}</span>
                </button>
            </form>
            {text.length > 0 && (
                <p className="mt-1.5 mb-0 px-1 text-[12px] leading-4 font-semibold text-[var(--text-muted)] tabular">
                    {t('chat.parts', { n: parts })} · {text.length}/160
                </p>
            )}
        </div>
    );
}
