import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import type { PropsWithChildren } from 'react';
import { getStore } from '@rc/store';
import { createQueryClient } from './client';
import { keys } from './keys';
import { useCreateOrder, useFarms, useOrders, useSmsReplies, useSmsReply } from './hooks';

afterEach(() => getStore().reset());

const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        {children}
    </QueryClientProvider>
);

describe('query client defaults', () => {
    it('uses the mock-adapter defaults', () => {
        const defaults = createQueryClient().getDefaultOptions();
        expect(defaults.queries?.retry).toBe(false);
        expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
        expect(defaults.queries?.staleTime).toBe(Infinity);
    });
});

describe('query keys', () => {
    it('is stable and separates pages', () => {
        expect(keys.farms.list({ page: 1 })).toEqual(keys.farms.list({ page: 1 }));
        expect(keys.farms.list({ page: 1 })).not.toEqual(keys.farms.list({ page: 2 }));
        expect(keys.farms.one('F-014')).toEqual(['farms', 'one', 'F-014']);
    });
});

describe('hooks', () => {
    it('loads farms through the repository', async () => {
        const { result } = renderHook(() => useFarms({ size: 5 }), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.rows).toHaveLength(5);
        expect(result.current.data?.total).toBe(100);
    });

    it('places an order and invalidates the list', async () => {
        const { result } = renderHook(() => ({ create: useCreateOrder(), orders: useOrders() }), { wrapper });
        await waitFor(() => expect(result.current.orders.isSuccess).toBe(true));
        expect(result.current.orders.data?.total).toBe(0);
        await act(async () => {
            await result.current.create.mutateAsync({ type: 'restaurant', sacks: 4, week: 'W3' });
        });
        await waitFor(() => expect(result.current.orders.data?.total).toBe(1));
        const order = result.current.orders.data?.rows[0];
        expect(order?.sacks).toBe(4);
        expect(order?.total).toBe(order?.kg ? order.kg * 4800 : -1);
    });

    it('records an SMS reply and invalidates the replies', async () => {
        const { result } = renderHook(() => ({ reply: useSmsReply(), replies: useSmsReplies() }), { wrapper });
        await waitFor(() => expect(result.current.replies.isSuccess).toBe(true));
        expect(result.current.replies.data).toHaveLength(0);
        await act(async () => {
            await result.current.reply.mutateAsync({ text: '1 OK' });
        });
        await waitFor(() => expect(result.current.replies.data).toHaveLength(1));
        expect(result.current.replies.data?.[0]?.action).toBe('ok');
    });
});
