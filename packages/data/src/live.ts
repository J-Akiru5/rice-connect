import { createSupabaseRuntime, setAuthAdapter } from '@rc/store';

/* B-04: apps call this once on boot when the build is live and the Supabase env vars are set. It swaps the
   auth adapter and publishes the Supabase session through @rc/store/session, which @rc/ui's useSession reads.
   B-05 will extend this seam with the Supabase repositories (setRepos). */
export function configureLiveAuth(url: string, anonKey: string) {
    const { auth } = createSupabaseRuntime(url, anonKey);
    setAuthAdapter(auth);
}
