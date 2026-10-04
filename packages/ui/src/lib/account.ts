import { HAUL, HERO_FARM } from '@rc/domain/seed';
import type { Identifier } from '@rc/domain/auth-form';
import { MockAuthAdapter, type AuthAdapter, type SessionRole } from '@rc/store';

/* Sign-in per app (prototype addition, docs/DECISIONS.md M22, M23). Every app has its own Sign In page, and all
   but the super admin a Sign Up page. Coordinator, buyer and admin use an email; driver and farmer a PH mobile
   number. The prototype's AuthAdapter is the mock: any well-formed input signs in as the app's one demo identity
   from the seed below, and nothing typed is kept. Swap `auth` for a Supabase adapter to make it real. */
export interface Account {
    id: string; name: string; about: string; icon: string;
    signIn: string; signUp: string | null; home: string; identifier: Identifier;
}
export const ACCOUNTS: Record<SessionRole, Account> = {
    coordinator: { id: 'Cluster 1', name: 'role.name.coordinator', about: 'mk.launch.coordinator', icon: 'User', signIn: '/login', signUp: '/signup', home: '/home', identifier: 'email' },
    buyer: { id: HAUL.to.label, name: 'role.name.buyer', about: 'mk.launch.buyer', icon: 'Store', signIn: '/buyer/login', signUp: '/buyer/signup', home: '/buyer', identifier: 'email' },
    driver: { id: HAUL.driver ? `${HAUL.driver.name} · ${HAUL.driver.plate}` : 'role.name.driver', name: 'role.name.driver', about: 'mk.launch.driver', icon: 'Truck', signIn: '/driver/login', signUp: '/driver/signup', home: '/haul/driver', identifier: 'mobile' },
    farmer: { id: `Farmer ${HERO_FARM.id}`, name: 'mk.role.farmer.h', about: 'mk.launch.farmer', icon: 'Sms', signIn: '/farmer/login', signUp: '/farmer/signup', home: '/sms', identifier: 'mobile' },
    /* Admins don't sign themselves up: accounts are created by RiceConnect. */
    admin: { id: 'role.name.admin', name: 'role.name.admin', about: 'login.admin.p', icon: 'Shield', signIn: '/admin/login', signUp: null, home: '/admin', identifier: 'email' },
};

/** The app-wide auth client. Mock today; a Supabase adapter implements the same interface. */
export const auth: AuthAdapter = new MockAuthAdapter(
    Object.fromEntries(Object.entries(ACCOUNTS).map(([r, a]) => [r, a.id])) as Record<SessionRole, string>,
);
