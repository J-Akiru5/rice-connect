'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DryScreen } from '@rc/screens/dry';
import { useListState } from '@rc/screens/list-state';

function Inner() {
  const w = Number.parseInt(useSearchParams().get('week') ?? '', 10);
  return <DryScreen list={useListState()} week={Number.isFinite(w) ? w - 1 : undefined} />;
}

export default function DryPage() {
  return <Suspense fallback={<DryScreen />}><Inner /></Suspense>;
}
