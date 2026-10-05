import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isDemo } from '@rc/ui/mode';
import { KitBoard } from './board';

export const metadata: Metadata = {
  title: 'RiceConnect · Component Kit',
  robots: { index: false, follow: false }
};

export default function KitPage() {
  if (!isDemo) notFound();
  return <KitBoard />;
}
