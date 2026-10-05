/* jsdom does not implement the browser APIs Radix primitives use. */
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

if (!('ResizeObserver' in globalThis)) {
    (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverMock;
}

if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};

const element = Element.prototype as unknown as {
    hasPointerCapture?: () => boolean;
    setPointerCapture?: () => void;
    releasePointerCapture?: () => void;
};
if (!element.hasPointerCapture) element.hasPointerCapture = () => false;
if (!element.setPointerCapture) element.setPointerCapture = () => {};
if (!element.releasePointerCapture) element.releasePointerCapture = () => {};

if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    })) as unknown as typeof window.matchMedia;
}
