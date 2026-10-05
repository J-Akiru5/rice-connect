import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { I18nProvider } from '@rc/i18n';
import { Field, Form, FormErrorSummary, SubmitButton } from './form';
import { zodResolver } from './zod-resolver';

const schema = z.object({
    mobile: z.string().regex(/^09\d{9}$/),
    sacks: z.string().min(1)
});

type Values = z.infer<typeof schema>;

function Harness({ onSubmit }: { onSubmit: (values: Values) => void | Promise<void> }) {
    const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { mobile: '', sacks: '' } });
    return (
        <I18nProvider>
            <Form form={form} onSubmit={onSubmit}>
                <FormErrorSummary />
                <Field name="mobile" label="Mobile" hint="09XXXXXXXXX">
                    {({ value, onChange, onBlur, name, invalid, describedBy }) => (
                        <input
                            name={name}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                        />
                    )}
                </Field>
                <Field name="sacks" label="Sacks">
                    {({ value, onChange, name, describedBy }) => (
                        <input
                            name={name}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            aria-describedby={describedBy}
                        />
                    )}
                </Field>
                <SubmitButton label="Save" pendingLabel="Saving" />
            </Form>
        </I18nProvider>
    );
}

const fill = (mobile: string, sacks: string) => {
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.change(inputs[0]!, { target: { value: mobile } });
    fireEvent.change(inputs[1]!, { target: { value: sacks } });
};

describe('form kit', () => {
    it('shows translated Zod keys, wires aria-describedby and focuses the first invalid field', async () => {
        const onSubmit = vi.fn();
        render(<Harness onSubmit={onSubmit} />);
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect((await screen.findAllByText('Check the format')).length).toBeGreaterThan(0);
        expect(screen.getAllByText('Value is too small').length).toBeGreaterThan(0);
        expect(onSubmit).not.toHaveBeenCalled();
        const mobile = screen.getAllByRole('textbox')[0] as HTMLInputElement;
        const described = mobile.getAttribute('aria-describedby') ?? '';
        expect(described.length).toBeGreaterThan(0);
        expect(document.getElementById(described.split(' ')[0]!)?.textContent).toContain('Check the format');
        await waitFor(() => expect(document.activeElement?.getAttribute('name')).toBe('mobile'));
    });

    it('submits valid values once and locks the button while pending', async () => {
        let release: () => void = () => {};
        const onSubmit = vi.fn<(values: Values) => Promise<void>>(
            () =>
                new Promise<void>((resolve) => {
                    release = resolve;
                })
        );
        render(<Harness onSubmit={onSubmit} />);
        fill('09171234567', '4');
        const button = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(button);
        fireEvent.click(button);
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(screen.getByRole('button', { name: 'Saving' })).toHaveProperty('disabled', true);
        release();
        await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toHaveProperty('disabled', false));
        expect(onSubmit.mock.calls[0]?.[0]).toEqual({ mobile: '09171234567', sacks: '4' });
    });

    it('summarises errors and focuses the field from the summary', async () => {
        render(<Harness onSubmit={() => {}} />);
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
        const summary = (await screen.findAllByRole('alert')).find((el) => el.querySelector('button'));
        expect(summary).toBeTruthy();
        const firstLink = summary!.querySelector('button');
        expect(firstLink).not.toBeNull();
        fireEvent.click(firstLink!);
        await waitFor(() => expect(document.activeElement?.getAttribute('name')).toBe('mobile'));
    });
});
