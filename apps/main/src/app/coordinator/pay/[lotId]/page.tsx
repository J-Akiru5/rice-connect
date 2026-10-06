import { notFound } from 'next/navigation';
import { HERO_LOT } from '@rc/domain/seed';
import { isLive } from '@rc/ui/mode';
import { PayLotPage } from './client';

/* Demo only has a settlement for the weighed hero lot, so other IDs are 404 (the check below). Live resolves
   the lot from the repositories, so the route stays open and the screen shows its own states. dynamicParams is
   always true because Next requires a static literal; the demo 404 is enforced in the component instead. */
export const dynamicParams = true;
export function generateStaticParams() {
  return isLive ? [] : [{ lotId: HERO_LOT.id }];
}

export default async function Page(props: { params: Promise<{ lotId: string }> }) {
  const params = await props.params;
  if (!isLive && params.lotId !== HERO_LOT.id) notFound();
  return <PayLotPage lotId={params.lotId} />;
}
