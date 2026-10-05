import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@rc/i18n';
import { Popover, Tooltip, ToastProvider, useToast } from './index';

function ToastHarness({ onUndo }: { onUndo: () => void }) {
    const { show } = useToast();
    return (
        <button type="button" onClick={() => show('Haul H-07 marked Delivered', { label: 'Undo', onClick: onUndo })}>
            Deliver
        </button>
    );
}

describe('Toast', () => {
    it('announces the message with role status and calls Undo', async () => {
        const onUndo = vi.fn();
        render(
            <I18nProvider>
                <ToastProvider>
                    <ToastHarness onUndo={onUndo} />
                </ToastProvider>
            </I18nProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Deliver' }));
        const toast = (await screen.findAllByRole('status')).find((el) =>
            el.textContent?.includes('Haul H-07 marked Delivered')
        );
        expect(toast).toBeTruthy();
        fireEvent.click(within(toast!).getByRole('button', { name: /Undo/ }));
        expect(onUndo).toHaveBeenCalledTimes(1);
    });
});

describe('Popover', () => {
    it('opens from the trigger and closes on Escape', async () => {
        render(
            <I18nProvider>
                <Popover trigger={<button type="button">Filters</button>}>
                    <p>Popover body</p>
                </Popover>
            </I18nProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
        expect(await screen.findByText('Popover body')).toBeTruthy();
        fireEvent.keyDown(document, { key: 'Escape' });
        await waitFor(() => expect(screen.queryByText('Popover body')).toBeNull());
    });
});

describe('Tooltip', () => {
    it('shows on focus and hides on blur', async () => {
        render(
            <I18nProvider>
                <Tooltip label="Sample label">
                    <button type="button">Info</button>
                </Tooltip>
            </I18nProvider>
        );
        const trigger = screen.getByRole('button', { name: 'Info' });
        fireEvent.focus(trigger);
        const tip = await screen.findByRole('tooltip');
        expect(tip.textContent).toContain('Sample label');
        fireEvent.blur(trigger);
        await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    });
});
