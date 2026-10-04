import type { Metadata } from 'next';

/* Coordinator app pages: a prototype tool, not for search engines (the X-Robots-Tag header says the same). */
export const metadata: Metadata = {
  title: 'RiceConnect · Coordinator (prototype)',
  robots: { index: false, follow: false },
};

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
