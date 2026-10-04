import type { Metadata } from 'next';
import { isDemo } from '@rc/ui/mode';

/* Coordinator app pages: an internal tool, not for search engines (the X-Robots-Tag header says the same). */
export const metadata: Metadata = {
  title: `RiceConnect · Coordinator${isDemo ? ' (prototype)' : ''}`,
  robots: { index: false, follow: false }
};

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
