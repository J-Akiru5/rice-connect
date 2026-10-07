import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '@rc/i18n';
import { BarChart, ProgressBar, StatusDistribution } from './Charts';

const wrap = (ui: React.ReactNode) => render(<I18nProvider>{ui}</I18nProvider>);

/* Owner-requested dashboard primitives: labelled for screen readers, with the data repeated in a
   visually hidden table (the drawing itself is aria-hidden). */

describe('BarChart', () => {
    it('labels the drawing and repeats the series in a hidden table', () => {
        wrap(
            <BarChart
                title="Harvest by Week"
                unit="t"
                data={[
                    { label: 'W1', value: 12.5 },
                    { label: 'W2', value: 0 }
                ]}
            />
        );
        expect(screen.getByRole('img', { name: 'Harvest by Week' })).toBeTruthy();
        const table = screen.getByRole('table', { name: 'Harvest by Week' });
        expect(table.textContent).toContain('12.5 t');
        expect(table.textContent).toContain('0 t');
    });
});

describe('ProgressBar', () => {
    it('shows done over target and the percentage label', () => {
        wrap(<ProgressBar title="C-01" value={15} max={30} unit="t" />);
        /* Once in the caption, once in the visually hidden data table. */
        expect(screen.getAllByText(/15 \/ 30 t/)).toHaveLength(2);
        expect(screen.getByRole('img', { name: 'C-01: 50%' })).toBeTruthy();
    });
});

describe('StatusDistribution', () => {
    it('renders one legend entry per non-zero status and a hidden table', () => {
        wrap(
            <StatusDistribution
                title="Haul Status"
                segments={[
                    { status: 'assigned', label: 'Assigned', value: 2 },
                    { status: 'delivered', label: 'Delivered', value: 1 },
                    { status: 'requested', label: 'Requested', value: 0 }
                ]}
            />
        );
        const legend = screen.getByRole('list');
        expect(within(legend).getByText('Assigned')).toBeTruthy();
        expect(within(legend).queryByText('Requested')).toBeNull();
        expect(screen.getByRole('table', { name: 'Haul Status' }).textContent).toContain('Requested0');
    });

    it('says so when there is nothing to show', () => {
        wrap(
            <StatusDistribution title="Haul Status" segments={[{ status: 'assigned', label: 'Assigned', value: 0 }]} />
        );
        expect(screen.getByText('No data yet')).toBeTruthy();
    });
});
