export type KitTone = 'glass' | 'hard';

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');
