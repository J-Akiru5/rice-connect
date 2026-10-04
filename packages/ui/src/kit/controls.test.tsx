import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@rc/i18n';
import { Checkbox, RadioGroup, Select, Switch, Tabs } from './controls';

const wrap = (ui: React.ReactNode) => render(<I18nProvider>{ui}</I18nProvider>);

describe('Checkbox', () => {
    it('toggles by click and can take focus', () => {
        function Harness() {
            const [checked, setChecked] = useState(false);
            return <Checkbox checked={checked} onCheckedChange={setChecked} label="Add to cluster" />;
        }
        wrap(<Harness />);
        const box = screen.getByRole('checkbox', { name: /Add to cluster/ });
        box.focus();
        expect(document.activeElement).toBe(box);
        fireEvent.click(box);
        expect(box.getAttribute('aria-checked')).toBe('true');
        fireEvent.click(box);
        expect(box.getAttribute('aria-checked')).toBe('false');
    });
});

describe('Switch', () => {
    it('toggles by click', () => {
        function Harness() {
            const [on, setOn] = useState(false);
            return <Switch checked={on} onCheckedChange={setOn} label="Only open slots" />;
        }
        wrap(<Harness />);
        const sw = screen.getByRole('switch', { name: 'Only open slots' });
        fireEvent.click(sw);
        expect(sw.getAttribute('aria-checked')).toBe('true');
    });
});

describe('RadioGroup', () => {
    it('selects by click and exposes a labelled radio group', () => {
        const onPick = vi.fn();
        const options = [
            { value: 'a', label: 'Truck A' },
            { value: 'b', label: 'Truck B' }
        ];
        wrap(<RadioGroup value="a" onValueChange={onPick} label="Vehicle" options={options} />);
        expect(screen.getByRole('radiogroup', { name: 'Vehicle' })).toBeTruthy();
        const first = screen.getByRole('radio', { name: 'Truck A' });
        first.focus();
        expect(document.activeElement).toBe(first);
        fireEvent.click(screen.getByRole('radio', { name: 'Truck B' }));
        expect(onPick).toHaveBeenCalledWith('b');
    });
});

describe('Tabs', () => {
    it('changes by click and exposes a labelled tab list', () => {
        const onChange = vi.fn();
        const items = [
            { value: 'w1', label: 'W1' },
            { value: 'w2', label: 'W2' }
        ];
        wrap(<Tabs value="w1" onValueChange={onChange} label="Weeks" items={items} />);
        expect(screen.getByRole('tablist', { name: 'Weeks' })).toBeTruthy();
        const first = screen.getByRole('tab', { name: 'W1' });
        first.focus();
        expect(document.activeElement).toBe(first);
        fireEvent.mouseDown(screen.getByRole('tab', { name: 'W2' }), { button: 0 });
        expect(onChange).toHaveBeenCalledWith('w2');
    });
});

describe('Select', () => {
    it('opens from the keyboard and selects an option', async () => {
        const onPick = vi.fn();
        function Harness() {
            const [value, setValue] = useState('');
            return (
                <Select
                    value={value}
                    onValueChange={(v) => {
                        setValue(v);
                        onPick(v);
                    }}
                    label="Week"
                    placeholder="Pick a week"
                    options={[
                        { value: 'w1', label: 'Week 1' },
                        { value: 'w2', label: 'Week 2' }
                    ]}
                />
            );
        }
        wrap(<Harness />);
        const trigger = screen.getByRole('combobox', { name: 'Week' });
        expect(trigger.textContent).toContain('Pick a week');
        trigger.focus();
        fireEvent.keyDown(trigger, { key: 'Enter' });
        const option = await screen.findByRole('option', { name: 'Week 2' });
        fireEvent.click(option);
        await waitFor(() => expect(onPick).toHaveBeenCalledWith('w2'));
        await waitFor(() => expect(trigger.textContent).toContain('Week 2'));
    });
});
