import { notFound } from 'next/navigation';
import { HAUL } from '@rc/domain/seed';
import { isLive } from '@rc/ui/mode';
import { JobClient } from './client';

/* Demo has one haul, so other IDs are 404 (the check below). Live resolves the job from the repositories,
   so the route stays open and the screen shows its own states. dynamicParams is always true because Next
   requires a static literal; the demo 404 is enforced in the component instead. */
export const dynamicParams = true;
export function generateStaticParams() {
  return isLive ? [] : [{ id: HAUL.id }];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (!isLive && params.id !== HAUL.id) notFound();
  return <JobClient id={params.id} />;
}
