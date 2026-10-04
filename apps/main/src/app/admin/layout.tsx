import type { Metadata } from 'next';

/* Super admin pages: a prototype tool, not for search engines (the X-Robots-Tag header says the same). */
export const metadata: Metadata = {
  title: 'RiceConnect · Super Admin (prototype)',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
