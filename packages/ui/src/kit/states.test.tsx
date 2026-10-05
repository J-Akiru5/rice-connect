import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@rc/i18n';
import { ErrorState, ForbiddenState, LoadingState, OfflineBanner, RefreshMarker } from './states';

const wrap = (ui: React.ReactNode) => render(<I18nProvider>{ui}</I18nProvider>);

describe('LoadingState', () => {
    it('shows nothing before the delay, then a skeleton', () => {
        vi.useFakeTimers();
        wrap(<LoadingState />);
        expect(screen.queryByRole('status')).toBeNull();
        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(screen.getByRole('status')).toBeTruthy();
        vi.useRealTimers();
    });
});

describe('ErrorState', () => {
    it('shows the message, a reference code and a working Try Again', () => {
        const onRetry = vi.fn();
        wrap(<ErrorState reference="RC-500" onRetry={onRetry} />);
        expect(screen.getByRole('alert').textContent).toContain('Something went wrong');
        expect(screen.getByRole('alert').textContent).toContain('Reference RC-500');
        fireEvent.click(screen.getByRole('button', { name: /Try Again/ }));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('has a not-found variant without a retry', () => {
        wrap(<ErrorState variant="notFound" />);
        expect(screen.getByRole('alert').textContent).toContain('This record no longer exists');
        expect(screen.queryByRole('button', { name: /Try Again/ })).toBeNull();
    });
});

describe('ForbiddenState', () => {
    it('names the role and offers sign in', () => {
        const onSignIn = vi.fn();
        wrap(<ForbiddenState role="coordinators" onSignIn={onSignIn} />);
        expect(screen.getByText(/for coordinators/)).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: /Sign In/ }));
        expect(onSignIn).toHaveBeenCalledTimes(1);
    });
});

describe('OfflineBanner', () => {
    it('appears offline and disappears online', async () => {
        const original = Object.getOwnPropertyDescriptor(window.navigator, 'onLine');
        Object.defineProperty(window.navigator, 'onLine', { configurable: true, get: () => false });
        wrap(<OfflineBanner />);
        expect(screen.getByRole('status').textContent).toContain('You are offline');
        Object.defineProperty(window.navigator, 'onLine', { configurable: true, get: () => true });
        act(() => {
            window.dispatchEvent(new Event('online'));
        });
        await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
        if (original) Object.defineProperty(window.navigator, 'onLine', original);
    });
});

describe('RefreshMarker', () => {
    it('marks a refresh without blanking the screen', () => {
        wrap(<RefreshMarker />);
        expect(screen.getByRole('status').textContent).toContain('Updating');
    });
});
