'use client';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { useState, type ReactNode } from 'react';
import { useI18n } from '@rc/i18n';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import { cx } from './cx';

/** Consequence text is required. With `typedWord`, the confirm button stays locked until the word is typed
    and Escape does not close the dialog. `confirmDisabled` lets the opener lock confirm on extra form validity
    (e.g. a new value that is not valid yet). Glass by default; `hard` for Haul-style openers. */
export function AlertDialog({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    confirmLabel,
    cancelLabel,
    onConfirm,
    typedWord,
    confirmDisabled = false,
    hard = false,
    className
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: ReactNode;
    title: string;
    description: string;
    children?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    typedWord?: string;
    confirmDisabled?: boolean;
    hard?: boolean;
    className?: string;
}) {
    const { t } = useI18n();
    const [typed, setTyped] = useState('');
    const ready = !typedWord || typed.trim() === typedWord;
    const close = (next: boolean) => {
        if (!next) setTyped('');
        onOpenChange(next);
    };
    return (
        <AlertDialogPrimitive.Root open={open} onOpenChange={close}>
            {trigger && <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>}
            <AlertDialogPrimitive.Portal>
                <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 rc-overlay backdrop-blur-sm" />
                <AlertDialogPrimitive.Content
                    onEscapeKeyDown={(e) => {
                        if (typedWord) e.preventDefault();
                    }}
                    className={cx(
                        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-5 w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto',
                        hard ? 'hard rounded-2xl' : 'glass-panel glass-fill-strong rounded-[2rem]',
                        className
                    )}
                >
                    <AlertDialogPrimitive.Title className="text-[18px] font-extrabold">
                        {title}
                    </AlertDialogPrimitive.Title>
                    <AlertDialogPrimitive.Description className="mt-1 text-[14px] font-semibold text-[var(--text-secondary)]">
                        {description}
                    </AlertDialogPrimitive.Description>
                    {children && <div className="mt-4">{children}</div>}
                    {typedWord && (
                        <label className="mt-4 flex flex-col gap-1 text-[13px] font-bold">
                            <span>{t('kit.typedPrompt', { word: typedWord })}</span>
                            <input
                                value={typed}
                                onChange={(e) => setTyped(e.target.value)}
                                autoComplete="off"
                                className={
                                    (hard ? 'hard-thin ' : '') +
                                    'min-h-[44px] px-3 rounded-xl bg-[var(--glass-fill-strong)] border-2 border-[color:var(--text-muted)] text-[16px] font-bold'
                                }
                            />
                        </label>
                    )}
                    <div className="mt-5 flex flex-wrap justify-end gap-2">
                        <AlertDialogPrimitive.Cancel asChild>
                            <SecondaryButton
                                className={hard ? '!rounded-xl !bg-white !text-black !border-black' : ''}
                                disabled={false}
                            >
                                {cancelLabel ?? t('action.cancel')}
                            </SecondaryButton>
                        </AlertDialogPrimitive.Cancel>
                        <AlertDialogPrimitive.Action asChild>
                            <PrimaryButton
                                disabled={!ready || confirmDisabled}
                                onClick={onConfirm}
                                className={hard ? 'hard-btn' : ''}
                            >
                                {confirmLabel ?? t('action.confirm')}
                            </PrimaryButton>
                        </AlertDialogPrimitive.Action>
                    </div>
                </AlertDialogPrimitive.Content>
            </AlertDialogPrimitive.Portal>
        </AlertDialogPrimitive.Root>
    );
}
