import { notFound } from 'next/navigation';
import { HERO_LOT } from '@rc/domain/seed';
import { PayLotPage } from './client';

/* Only the weighed lot has a settlement and a slip; other lot IDs are 404 (no dead links point at them). */
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lotId: HERO_LOT.id }];
}

export default async function Page(props: { params: Promise<{ lotId: string }> }) {
  const params = await props.params;
  if (params.lotId !== HERO_LOT.id) notFound();
  return <PayLotPage />;
}
