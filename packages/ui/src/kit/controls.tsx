'use client';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import Icon from '../Components/Icon';
import { cx } from './cx';

const ROW = 'flex items-center gap-3 min-h-[44px] md:min-h-[40px]';
const TEXT = 'text-[15px] font-bold text-[var(--ink)]';

export function Checkbox({
    checked,
    onCheckedChange,
    label,
    hint,
    disabled = false,
    name,
    invalid = false,
    describedBy,
    className
}: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    hint?: string;
    disabled?: boolean;
    name?: string;
    invalid?: boolean;
    describedBy?: string;
    className?: string;
}) {
    return (
        <label className={cx(ROW, 'items-start cursor-pointer', disabled ? 'opacity-40' : '', className)}>
            <CheckboxPrimitive.Root
                checked={checked}
                onCheckedChange={(v) => onCheckedChange(v === true)}
                disabled={disabled}
                name={name}
                aria-invalid={invalid ? true : undefined}
                aria-describedby={describedBy}
                className="mt-1.5 w-6 h-6 shrink-0 rounded-md border-2 border-[color:var(--text-muted)] bg-[var(--glass-fill-strong)] inline-flex items-center justify-center data-[state=checked]:bg-[var(--fill-strong)] data-[state=checked]:border-[color:var(--fill-strong)]"
            >
                <CheckboxPrimitive.Indicator>
                    <Icon name="Check" size={16} className="text-[var(--on-fill-strong)]" />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            <span className="min-w-0">
                <span className={cx('block', TEXT)}>{label}</span>
                {hint && <span className="block text-[13px] font-semibold text-[var(--text-secondary)]">{hint}</span>}
            </span>
        </label>
    );
}

export function RadioGroup<T extends string>({
    value,
    onValueChange,
    label,
    options,
    className
}: {
    value: T;
    onValueChange: (value: T) => void;
    label: string;
    options: { value: T; label: string }[];
    className?: string;
}) {
    return (
        <RadioGroupPrimitive.Root
            value={value}
            onValueChange={(v) => onValueChange(v as T)}
            aria-label={label}
            className={cx('flex flex-col gap-1', className)}
        >
            {options.map((o) => (
                <label key={o.value} className={cx(ROW, 'cursor-pointer')}>
                    <RadioGroupPrimitive.Item
                        value={o.value}
                        className="w-6 h-6 shrink-0 rounded-full border-2 border-[color:var(--text-muted)] bg-[var(--glass-fill-strong)] inline-flex items-center justify-center data-[state=checked]:border-[color:var(--fill-strong)]"
                    >
                        <RadioGroupPrimitive.Indicator className="block w-3 h-3 rounded-full bg-[var(--fill-strong)]" />
                    </RadioGroupPrimitive.Item>
                    <span className={TEXT}>{o.label}</span>
                </label>
            ))}
        </RadioGroupPrimitive.Root>
    );
}

export function Switch({
    checked,
    onCheckedChange,
    label,
    disabled = false,
    className
}: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <label className={cx(ROW, 'cursor-pointer', disabled ? 'opacity-40' : '', className)}>
            <SwitchPrimitive.Root
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className="relative w-12 h-7 shrink-0 rounded-full border-2 border-[color:var(--text-muted)] bg-[var(--glass-fill-strong)] data-[state=checked]:bg-[var(--fill-strong)] data-[state=checked]:border-[color:var(--fill-strong)]"
            >
                <SwitchPrimitive.Thumb className="block w-5 h-5 rounded-full bg-[var(--ink)] transition-transform duration-200 motion-reduce:transition-none translate-x-0.5 data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-white" />
            </SwitchPrimitive.Root>
            <span className={TEXT}>{label}</span>
        </label>
    );
}

export function Select<T extends string>({
    value,
    onValueChange,
    label,
    options,
    placeholder,
    disabled = false,
    className
}: {
    value: T;
    onValueChange: (value: T) => void;
    label: string;
    options: { value: T; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <SelectPrimitive.Root value={value} onValueChange={(v) => onValueChange(v as T)} disabled={disabled}>
            <SelectPrimitive.Trigger
                aria-label={label}
                className={cx(
                    'inline-flex items-center justify-between gap-2 min-h-[44px] md:min-h-[40px] px-4 rounded-full border-2 border-[color:var(--text-muted)] bg-[var(--glass-fill-strong)] text-[15px] font-bold text-[var(--ink)]',
                    disabled ? 'opacity-40' : '',
                    className
                )}
            >
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon>
                    <Icon name="ChevronDown" size={16} />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={6}
                    className="z-50 max-h-[320px] min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-[1.25rem] glass-panel bg-[var(--glass-fill-strong)] p-2 shadow-[var(--shadow-popover)]"
                >
                    <SelectPrimitive.Viewport>
                        {options.map((o) => (
                            <SelectPrimitive.Item
                                key={o.value}
                                value={o.value}
                                className="rc-menu-item flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[15px] font-bold text-[var(--ink)] outline-none cursor-pointer data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed"
                            >
                                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                                <SelectPrimitive.ItemIndicator className="ml-auto">
                                    <Icon name="Check" size={18} />
                                </SelectPrimitive.ItemIndicator>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}

export function Tabs({
    value,
    onValueChange,
    items,
    label,
    children,
    className
}: {
    value?: string;
    onValueChange: (value: string) => void;
    items: { value: string; label: string }[];
    label: string;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <TabsPrimitive.Root value={value} onValueChange={onValueChange} className={className}>
            <TabsPrimitive.List
                aria-label={label}
                className="inline-flex flex-wrap gap-1 p-1 rounded-full glass-panel !shadow-none"
            >
                {items.map((i) => (
                    <TabsPrimitive.Trigger
                        key={i.value}
                        value={i.value}
                        className="min-h-[44px] md:min-h-[40px] px-4 rounded-full text-[14px] font-extrabold tracking-[0.04em] text-[var(--ink)] data-[state=active]:bg-[var(--fill-strong)] data-[state=active]:text-[var(--on-fill-strong)]"
                    >
                        {i.label}
                    </TabsPrimitive.Trigger>
                ))}
            </TabsPrimitive.List>
            {children}
        </TabsPrimitive.Root>
    );
}

export function TabPanel({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
    return (
        <TabsPrimitive.Content value={value} className={className}>
            {children}
        </TabsPrimitive.Content>
    );
}

/** Tabs whose selection lives in a URL search param, so Back and Reload keep the user's place. */
export function UrlTabs({
    param,
    items,
    label,
    className
}: {
    param: string;
    items: { value: string; label: string }[];
    label: string;
    className?: string;
}) {
    const sp = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const value = sp.get(param) ?? items[0]?.value;
    const set = (next: string) => {
        const params = new URLSearchParams(sp.toString());
        params.set(param, next);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
    return <Tabs value={value} onValueChange={set} items={items} label={label} className={className} />;
}
