import type { FarmQuery, HaulQuery, ListQuery } from '@rc/store';

/** Query-key factory: one place for every cache key, so mutations invalidate the right lists. */
export const keys = {
    farms: {
        all: ['farms'] as const,
        list: (q: FarmQuery = {}) => ['farms', 'list', q] as const,
        one: (id: string) => ['farms', 'one', id] as const,
        created: ['farms', 'created'] as const
    },
    lots: {
        all: ['lots'] as const,
        list: (q: ListQuery = {}) => ['lots', 'list', q] as const,
        one: (id: string) => ['lots', 'one', id] as const
    },
    slots: {
        all: ['slots'] as const,
        list: (q: ListQuery = {}) => ['slots', 'list', q] as const,
        one: (id: string) => ['slots', 'one', id] as const,
        status: (id: string) => ['slots', 'status', id] as const
    },
    hauls: {
        all: ['hauls'] as const,
        list: (q: HaulQuery = {}) => ['hauls', 'list', q] as const,
        one: (id: string) => ['hauls', 'one', id] as const,
        status: (id: string) => ['hauls', 'status', id] as const
    },
    commitments: {
        all: ['commitments'] as const,
        list: (q: ListQuery = {}) => ['commitments', 'list', q] as const,
        mine: ['commitments', 'mine'] as const
    },
    orders: {
        all: ['orders'] as const,
        list: (q: ListQuery = {}) => ['orders', 'list', q] as const
    },
    settlements: {
        all: ['settlements'] as const,
        one: (lotId: string) => ['settlements', 'one', lotId] as const,
        paid: (lotId: string) => ['settlements', 'paid', lotId] as const
    },
    sms: {
        thread: ['sms', 'thread'] as const,
        replies: ['sms', 'replies'] as const
    },
    admin: {
        all: ['admin'] as const,
        overrides: ['admin', 'overrides'] as const
    }
};
