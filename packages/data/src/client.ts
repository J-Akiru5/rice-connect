import { QueryClient } from '@tanstack/react-query';

/** Mock-adapter defaults (AGENTS.md): no retry, no refetch on focus, cached forever until invalidated. */
export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, refetchOnWindowFocus: false, staleTime: Infinity },
            mutations: { retry: false }
        }
    });
}

let browser: QueryClient | null = null;
export function getQueryClient(): QueryClient {
    browser ??= createQueryClient();
    return browser;
}
