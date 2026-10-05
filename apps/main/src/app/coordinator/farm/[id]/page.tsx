import { notFound } from 'next/navigation';
import { FARMS, farmById } from '@rc/domain/seed';
import { FarmProfilePage } from './client';

export const dynamicParams = false;
export function generateStaticParams() {
  return FARMS.map((f) => ({ id: f.id }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (!farmById(params.id)) notFound();
  return <FarmProfilePage id={params.id} />;
}
