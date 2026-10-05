import type { Metadata } from 'next';
import { isDemo } from '@rc/ui/mode';
import { RoleGuard } from '@rc/screens/guard';

/* Super admin pages: an internal tool, not for search engines (the X-Robots-Tag header says the same). */
export const metadata: Metadata = {
  title: `RiceConnect · Super Admin${isDemo ? ' (prototype)' : ''}`,
  robots: { index: false, follow: false }
};

/* S-12: admin routes require the admin session in live mode; /admin/login stays open. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin" allow={['/admin/login']}>
      {children}
    </RoleGuard>
  );
}
