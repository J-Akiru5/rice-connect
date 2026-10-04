import { HAUL } from '@rc/domain/seed';
import type { SessionRole } from '@rc/store';

/* Simulated sign-in (prototype addition, docs/DECISIONS.md M22). Each app has its own sign-in page with one fixed
   demo identity from the seed: no accounts, no passwords, no choosing who you are. The farmer has no app sign-in:
   the farmer only uses SMS. */
export interface Account { id: string; name: string; about: string; icon: string; signIn: string; home: string }
export const ACCOUNTS: Record<SessionRole, Account> = {
    coordinator: { id: 'Cluster 1', name: 'role.name.coordinator', about: 'mk.launch.coordinator', icon: 'User', signIn: '/login', home: '/home' },
    buyer: { id: HAUL.to.label, name: 'role.name.buyer', about: 'mk.launch.buyer', icon: 'Store', signIn: '/buyer/login', home: '/buyer' },
    driver: { id: HAUL.driver ? `${HAUL.driver.name} · ${HAUL.driver.plate}` : 'role.name.driver', name: 'role.name.driver', about: 'mk.launch.driver', icon: 'Truck', signIn: '/driver/login', home: '/haul/driver' },
    admin: { id: 'role.name.admin', name: 'role.name.admin', about: 'login.admin.p', icon: 'Shield', signIn: '/admin/login', home: '/admin' },
};
