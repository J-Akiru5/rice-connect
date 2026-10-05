import { createSupabaseRuntime, setAuthAdapter, setRepos } from '@rc/store';
import { createSupabaseRepos } from '@rc/store/supabase-repos';

/* B-04/B-05: apps call this once on boot when the build is live and the Supabase env vars are set. It swaps
   the auth adapter and the repositories to Supabase and publishes the session through @rc/store/session, which
   @rc/ui's useSession reads. */
export function configureLive(url: string, anonKey: string) {
    const { client, auth } = createSupabaseRuntime(url, anonKey);
    setAuthAdapter(auth);
    setRepos(createSupabaseRepos(client));
}
