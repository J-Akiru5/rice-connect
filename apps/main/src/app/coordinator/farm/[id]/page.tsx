import { notFound } from 'next/navigation';
import { FARMS, farmById } from '@rc/domain/seed';
import { FarmProfilePage } from './client';

export const dynamicParams = false;
export function generateStaticParams() {
  return FARMS.map((f) => ({ id: f.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  if (!farmById(params.id)) notFound();
  return <FarmProfilePage id={params.id} />;
}
