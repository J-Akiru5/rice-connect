'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { useI18n } from '@rc/i18n';
import Icon from '../Components/Icon';
import { cx } from './cx';

const MAX_WIDTH = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' } as const;

/** Glass by default; `hard` for Haul-style openers. The portal content carries the opener's style class. */
export function Dialog({
    open,
    onOpenChange,
    trigger,
    title,
    hideTitle = false,
    description,
    children,
    footer,
    maxWidth = '2xl',
    hard = false,
    closeButton = true,
    closeLabel,
    className,
    bodyClassName
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: ReactNode;
    title: string;
    hideTitle?: boolean;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
    maxWidth?: keyof typeof MAX_WIDTH;
    hard?: boolean;
    closeButton?: boolean;
    closeLabel?: string;
    className?: string;
    /** Extra classes for the body wrapper (e.g. `flex-1 min-h-0` for a full-height panel layout). */
    bodyClassName?: string;
}) {
    const { t } = useI18n();
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 rc-overlay backdrop-blur-sm" />
                <DialogPrimitive.Content
                    className={cx(
                        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-5 w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto',
                        MAX_WIDTH[maxWidth],
                        hard ? 'hard rounded-2xl' : 'glass-panel glass-fill-strong rounded-[2rem]',
                        className
                    )}
                >
                    <DialogPrimitive.Title className={hideTitle ? 'sr-only' : 'text-[18px] font-extrabold'}>
                        {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description
                        className={
                            description ? 'mt-1 text-[14px] font-semibold text-[var(--text-secondary)]' : 'sr-only'
                        }
                    >
                        {description ?? title}
                    </DialogPrimitive.Description>
                    <div className={cx('mt-4', bodyClassName)}>{children}</div>
                    {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
                    {closeButton && (
                        <DialogPrimitive.Close asChild>
                            <button
                                type="button"
                                className="absolute right-3 top-3 inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border-2 border-[color:var(--text-muted)]"
                            >
                                <Icon name="X" size={20} />
                                <span className="sr-only">{closeLabel ?? t('haul.close')}</span>
                            </button>
                        </DialogPrimitive.Close>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
