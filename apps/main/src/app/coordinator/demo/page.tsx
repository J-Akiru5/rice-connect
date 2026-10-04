'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DemoPlayer, Stage, BEATS } from '@rc/screens/demo';

function Inner() {
  const p = useSearchParams();
  const beat = Number(p.get('beat'));
  const start = Number.isInteger(beat) && beat >= 1 && beat <= BEATS.length ? beat - 1 : 0;
  return <DemoPlayer rec={p.get('rec') === '1'} flip={p.get('flip') === '1'} startBeat={start} />;
}

export default function DemoPage() {
  return <Suspense fallback={<Stage t={0} />}><Inner /></Suspense>;
}
