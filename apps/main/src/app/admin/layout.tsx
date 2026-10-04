import type { Metadata } from 'next';
import { isDemo } from '@rc/ui/mode';

/* Super admin pages: an internal tool, not for search engines (the X-Robots-Tag header says the same). */
export const metadata: Metadata = {
  title: `RiceConnect · Super Admin${isDemo ? ' (prototype)' : ''}`,
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
