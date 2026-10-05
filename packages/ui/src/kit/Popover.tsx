'use client';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ReactNode } from 'react';
import { cx } from './cx';

/** Glass by default; `hard` for Haul-style openers. */
export function Popover({
    trigger,
    children,
    align = 'start',
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
        <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    align={align}
                    sideOffset={sideOffset}
                    className={cx(
                        'z-50 w-[min(320px,calc(100vw-2rem))] p-4 rounded-[1.25rem] shadow-[var(--shadow-popover)]',
                        hard ? 'hard' : 'glass-panel bg-[var(--glass-fill-strong)]',
                        className
                    )}
                >
                    {children}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
