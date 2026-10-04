'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRepos, type FarmQuery, type ListQuery } from '@rc/store';
import type { BuyerType, Week } from '@rc/domain/schemas';
import { keys } from './keys';

/** Every write carries an idempotency key so a double tap cannot create two records. */
export const newIdempotencyKey = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useFarms = (q: FarmQuery = {}) =>
    useQuery({ queryKey: keys.farms.list(q), queryFn: () => getRepos().farms.list(q) });
export const useFarm = (id: string) =>
    useQuery({ queryKey: keys.farms.one(id), queryFn: () => getRepos().farms.get(id), enabled: id.length > 0 });

export const useLots = (q: ListQuery = {}) =>
    useQuery({ queryKey: keys.lots.list(q), queryFn: () => getRepos().lots.list(q) });
export const useLot = (id: string) =>
    useQuery({ queryKey: keys.lots.one(id), queryFn: () => getRepos().lots.get(id), enabled: id.length > 0 });

export const useSlots = (q: ListQuery = {}) =>
    useQuery({ queryKey: keys.slots.list(q), queryFn: () => getRepos().slots.list(q) });
export const useSlotStatus = (id: string) =>
    useQuery({ queryKey: keys.slots.status(id), queryFn: () => getRepos().slots.status(id), enabled: id.length > 0 });

export const useHaul = (id: string) =>
    useQuery({ queryKey: keys.hauls.one(id), queryFn: () => getRepos().hauls.get(id), enabled: id.length > 0 });
export const useHaulStatus = (id: string) =>
    useQuery({ queryKey: keys.hauls.status(id), queryFn: () => getRepos().hauls.status(id), enabled: id.length > 0 });

export const useCommitments = (q: ListQuery = {}) =>
    useQuery({ queryKey: keys.commitments.list(q), queryFn: () => getRepos().commitments.list(q) });
export const useMyCommitments = () =>
    useQuery({ queryKey: keys.commitments.mine, queryFn: () => getRepos().commitments.mine() });

export const useOrders = (q: ListQuery = {}) =>
    useQuery({ queryKey: keys.orders.list(q), queryFn: () => getRepos().orders.list(q) });

export const useSettlement = (lotId: string) =>
    useQuery({
        queryKey: keys.settlements.one(lotId),
        queryFn: () => getRepos().settlements.get(lotId),
        enabled: lotId.length > 0
    });

export const useSmsThread = () => useQuery({ queryKey: keys.sms.thread, queryFn: () => getRepos().sms.list() });
export const useSmsReplies = () => useQuery({ queryKey: keys.sms.replies, queryFn: () => getRepos().sms.replies() });

export const useAddFarm = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, idempotencyKey = newIdempotencyKey() }: { id: string; idempotencyKey?: string }) =>
            getRepos().farms.add(id, { idempotencyKey }),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.farms.all })
    });
};

export const useSetHaulStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            status,
            idempotencyKey = newIdempotencyKey()
        }: {
            id: string;
            status: Parameters<ReturnType<typeof getRepos>['hauls']['setStatus']>[1];
            idempotencyKey?: string;
        }) => getRepos().hauls.setStatus(id, status, { idempotencyKey }),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.hauls.all })
    });
};

export const useSetSlotStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            status,
            idempotencyKey = newIdempotencyKey()
        }: {
            id: string;
            status: Parameters<ReturnType<typeof getRepos>['slots']['setStatus']>[1];
            idempotencyKey?: string;
        }) => getRepos().slots.setStatus(id, status, { idempotencyKey }),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.slots.all })
    });
};

export const useCreateOrder = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            type,
            sacks,
            week,
            idempotencyKey = newIdempotencyKey()
        }: {
            type: BuyerType;
            sacks: number;
            week: Week;
            idempotencyKey?: string;
        }) => getRepos().orders.create({ type, sacks, week }, { idempotencyKey }),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.orders.all })
    });
};

export const useCreateCommitment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            tonnes,
            price,
            window,
            idempotencyKey = newIdempotencyKey()
        }: {
            tonnes: number;
            price: number;
            window: Week[];
            idempotencyKey?: string;
        }) => getRepos().commitments.create({ tonnes, price, window }, { idempotencyKey }),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.commitments.all })
    });
};

export const useSmsReply = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ text, idempotencyKey = newIdempotencyKey() }: { text: string; idempotencyKey?: string }) =>
            getRepos().sms.reply(text, { idempotencyKey }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: keys.sms.replies });
            qc.invalidateQueries({ queryKey: keys.slots.all });
            qc.invalidateQueries({ queryKey: keys.hauls.all });
        }
    });
};
