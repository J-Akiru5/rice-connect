import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@rc/i18n';
import { Menu, MenuItem, MenuSeparator } from './index';
import { LanguageSwitcher } from '../Components/Enactus';

function Harness({ onPick }: { onPick: (value: string) => void }) {
    return (
        <I18nProvider>
            <Menu trigger={<button type="button">Options</button>}>
                <MenuItem onSelect={() => onPick('one')}>First</MenuItem>
                <MenuItem onSelect={() => onPick('two')}>Second</MenuItem>
                <MenuSeparator />
                <MenuItem disabled>Disabled</MenuItem>
            </Menu>
        </I18nProvider>
    );
}

describe('Menu', () => {
    it('opens, highlights with the arrow keys and selects an item', async () => {
        const onPick = vi.fn();
        render(<Harness onPick={onPick} />);
        const trigger = screen.getByRole('button', { name: 'Options' });
        trigger.focus();
        fireEvent.keyDown(trigger, { key: 'ArrowDown' });
        const menu = await screen.findByRole('menu');
        fireEvent.keyDown(menu, { key: 'ArrowDown' });
        const first = screen.getByRole('menuitem', { name: 'First' });
        await waitFor(() => expect(first).toHaveProperty('dataset.highlighted'));
        fireEvent.click(first);
        await waitFor(() => expect(onPick).toHaveBeenCalledWith('one'));
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        render(<Harness onPick={() => {}} />);
        const trigger = screen.getByRole('button', { name: 'Options' });
        trigger.focus();
        fireEvent.keyDown(trigger, { key: 'Enter' });
        const menu = await screen.findByRole('menu');
        fireEvent.keyDown(menu, { key: 'Escape' });
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
});

describe('LanguageSwitcher', () => {
    it('switches the language from the menu and keeps the short code in the trigger', async () => {
        render(
            <I18nProvider>
                <LanguageSwitcher />
            </I18nProvider>
        );
        const trigger = screen.getByRole('button', { name: /Language/ });
        expect(trigger.textContent).toContain('EN');
        trigger.focus();
        fireEvent.keyDown(trigger, { key: 'Enter' });
        const tagalog = await screen.findByRole('menuitem', { name: /Tagalog/ });
        fireEvent.click(tagalog);
        await waitFor(() => expect(trigger.textContent).toContain('TL'));
    });
});
