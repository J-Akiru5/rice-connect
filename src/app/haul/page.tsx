'use client';
import { Suspense } from 'react';
import { PhoneStage } from '@/components/riceconnect';
import { HaulCoordinatorScreen } from '@/screens/haul';
import { useViewState } from '@/screens/params';

function Inner() {
  const state = useViewState(['empty', 'error', 'success'] as const);
  return <HaulCoordinatorScreen key={state} state={state} />;
}

export default function HaulPage() {
  return (
    <PhoneStage>
      <Suspense fallback={<HaulCoordinatorScreen />}><Inner /></Suspense>
    </PhoneStage>
  );
}
