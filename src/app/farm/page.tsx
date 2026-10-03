'use client';
import { Suspense } from 'react';
import { PhoneStage } from '@/components/riceconnect';
import { FarmListScreen } from '@/screens/farm';
import { useViewState } from '@/screens/params';

function Inner() {
  const state = useViewState(['empty'] as const);
  return <FarmListScreen state={state} />;
}

export default function FarmPage() {
  return (
    <PhoneStage>
      <Suspense fallback={<FarmListScreen />}><Inner /></Suspense>
    </PhoneStage>
  );
}
