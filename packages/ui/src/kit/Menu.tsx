'use client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';
import { cx } from './cx';

/** Glass by default; `hard` for Haul-style openers. Arrow keys, typeahead and Escape come from Radix. */
export function Menu({
    trigger,
    children,
    align = 'end',
    sideOffset = 6,
    hard = false,
    className
}: {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    hard?: boolean;
    className?: string;
}) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align={align}
                    sideOffset={sideOffset}
                    className={cx(
                        'z-50 w-[248px] max-w-[calc(100vw-2rem)] p-2 rounded-[1.25rem] shadow-[var(--shadow-popover)]',
                        hard ? 'hard' : 'glass-panel bg-[var(--glass-fill-strong)]',
                        className
                    )}
                >
                    {children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export function MenuItem({
    children,
    onSelect,
    disabled = false,
    selected = false,
    lang,
    className
}: {
    children: ReactNode;
    onSelect?: () => void;
    disabled?: boolean;
    selected?: boolean;
    lang?: string;
    className?: string;
}) {
    return (
        <DropdownMenu.Item
            disabled={disabled}
            onSelect={onSelect}
            lang={lang}
            className={cx(
                'rc-menu-item flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-left text-[15px] font-bold outline-none cursor-pointer',
                selected ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)]',
                disabled ? 'opacity-40 cursor-not-allowed' : '',
                className
            )}
        >
            {children}
        </DropdownMenu.Item>
    );
}

export function MenuSeparator({ className }: { className?: string }) {
    return <DropdownMenu.Separator className={cx('h-px my-2 bg-[color:var(--glass-border-strong)]', className)} />;
}
