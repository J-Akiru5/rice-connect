import type { Metadata } from 'next';
import { isDemo } from '@rc/ui/mode';
import { RoleGuard } from '@rc/screens/guard';

/* Coordinator app pages: an internal tool, not for search engines (the X-Robots-Tag header says the same). */
export const metadata: Metadata = {
  title: `RiceConnect · Coordinator${isDemo ? ' (prototype)' : ''}`,
  robots: { index: false, follow: false }
};

/* S-12: coordinator routes require the coordinator session in live mode; demo mode stays open. */
export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="coordinator">{children}</RoleGuard>;
}
