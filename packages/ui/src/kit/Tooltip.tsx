'use client';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import { cx } from './cx';

/** Tooltips never hold required information (docs/plan/04-ux-standards.md). */
export function Tooltip({
    label,
    children,
    side = 'top',
    className
}: {
    label: string;
    children: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
}) {
    return (
        <TooltipPrimitive.Provider delayDuration={300}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        sideOffset={6}
                        className={cx(
                            'z-50 px-3 py-1.5 rounded-full glass-panel bg-[var(--glass-fill-strong)] text-[13px] font-bold text-[var(--ink)] shadow-[var(--shadow-popover)]',
                            className
                        )}
                    >
                        {label}
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
