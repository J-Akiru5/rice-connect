import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@rc/i18n';
import { AlertDialog, Dialog } from './index';

function DialogHarness() {
    const [open, setOpen] = useState(false);
    return (
        <I18nProvider>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                trigger={<button type="button">Open dialog</button>}
                title="Example dialog"
                description="Dialog body"
            >
                <p>Dialog content</p>
            </Dialog>
        </I18nProvider>
    );
}

function AlertHarness({ onConfirm }: { onConfirm: () => void }) {
    const [open, setOpen] = useState(false);
    return (
        <I18nProvider>
            <AlertDialog
                open={open}
                onOpenChange={setOpen}
                trigger={<button type="button">Open alert</button>}
                title="Delete farm"
                description="This cannot be undone."
                typedWord="DELETE"
                onConfirm={onConfirm}
            />
        </I18nProvider>
    );
}

describe('Dialog', () => {
    it('opens from the trigger, moves focus inside, closes on Escape and returns focus', async () => {
        render(<DialogHarness />);
        const trigger = screen.getByRole('button', { name: 'Open dialog' });
        fireEvent.click(trigger);
        const content = await screen.findByRole('dialog');
        expect(screen.getByText('Example dialog')).toBeTruthy();
        await waitFor(() => expect(content.contains(document.activeElement)).toBe(true));
        fireEvent.keyDown(document, { key: 'Escape' });
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
});

describe('AlertDialog', () => {
    it('locks confirm until the typed word matches and ignores Escape', async () => {
        const onConfirm = vi.fn();
        render(<AlertHarness onConfirm={onConfirm} />);
        fireEvent.click(screen.getByRole('button', { name: 'Open alert' }));
        await screen.findByRole('alertdialog');
        const confirm = screen.getByRole('button', { name: 'Confirm' });
        expect(confirm.hasAttribute('disabled')).toBe(true);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('alertdialog')).not.toBeNull();
        fireEvent.change(screen.getByLabelText('Type DELETE to confirm'), { target: { value: 'DELETE' } });
        expect(confirm.hasAttribute('disabled')).toBe(false);
        fireEvent.click(confirm);
        expect(onConfirm).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    });
});
