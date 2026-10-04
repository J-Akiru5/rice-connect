'use client';
import { useId, type PropsWithChildren, type ReactNode } from 'react';
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type FieldValues,
    type UseFormReturn
} from 'react-hook-form';
import { useI18n } from '@rc/i18n';
import PrimaryButton from '../Components/PrimaryButton';
import InputError from '../Components/InputError';
import { cx } from './cx';

/** RHF + Zod form kit: labels, hints, aria-describedby wiring, focus on the first invalid field,
    a submit button that locks while pending (double-submit protection) and an error summary. */

export function Form<T extends FieldValues>({
    form,
    onSubmit,
    children,
    className
}: PropsWithChildren<{
    form: UseFormReturn<T>;
    onSubmit: (values: T) => void | Promise<void>;
    className?: string;
}>) {
    const focusField = (name: string) => document.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
    return (
        <FormProvider {...form}>
            <form
                noValidate
                className={className}
                onSubmit={async (e) => {
                    e.preventDefault();
                    await form.handleSubmit(onSubmit, (errors) => {
                        const first = Object.keys(errors)[0];
                        if (first) focusField(first);
                    })(e);
                }}
            >
                {children}
            </form>
        </FormProvider>
    );
}

export interface FieldRenderProps {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    name: string;
    invalid: boolean;
    describedBy?: string;
}

export function Field({
    name,
    label,
    hint,
    children,
    className
}: {
    name: string;
    label: string;
    hint?: string;
    children: (field: FieldRenderProps) => ReactNode;
    className?: string;
}) {
    const { t } = useI18n();
    const uid = useId();
    const { control } = useFormContext();
    const errId = `${uid}-err`;
    const hintId = `${uid}-hint`;
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const error = fieldState.error?.message ? t(String(fieldState.error.message)) : undefined;
                const describedBy = [error ? errId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;
                return (
                    <label className={cx('flex flex-col gap-1.5 min-w-0', className)}>
                        <span className="text-[13px] font-extrabold uppercase tracking-[0.06em]">{label}</span>
                        {hint && (
                            <span id={hintId} className="text-[13px] font-semibold text-[var(--text-secondary)]">
                                {hint}
                            </span>
                        )}
                        {children({
                            value: field.value ?? '',
                            onChange: field.onChange,
                            onBlur: field.onBlur,
                            name,
                            invalid: Boolean(fieldState.error),
                            describedBy
                        })}
                        <InputError id={errId} message={error} />
                    </label>
                );
            }}
        />
    );
}

/** Standalone error line for layouts that do not use Field (reads the nearest form context). */
export function FieldError({ name }: { name: string }) {
    const { t } = useI18n();
    const { formState } = useFormContext();
    const error = formState.errors[name]?.message;
    if (!error) return null;
    return <p className="m-0 text-[13px] font-bold text-[var(--danger-ink)]">{t(String(error))}</p>;
}

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
    const { control } = useFormContext();
    const { isSubmitting } = useFormState({ control });
    return (
        <PrimaryButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? pendingLabel : label}
        </PrimaryButton>
    );
}

export function FormErrorSummary({ className }: { className?: string }) {
    const { t } = useI18n();
    const { formState } = useFormContext();
    const errors = Object.entries(formState.errors);
    if (errors.length === 0) return null;
    return (
        <div
            role="alert"
            className={cx(
                'rounded-2xl bg-[var(--danger-soft)] text-[var(--danger-ink)] px-4 py-3 text-[14px] leading-5 font-semibold',
                className
            )}
        >
            <ul className="m-0 pl-4 flex flex-col gap-1">
                {errors.map(([name, error]) => (
                    <li key={name}>
                        <button
                            type="button"
                            className="underline underline-offset-2 text-left"
                            onClick={() => document.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()}
                        >
                            {t(String(error?.message ?? ''))}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
