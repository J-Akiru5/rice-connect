'use client';
import { Suspense } from 'react';
import { PhoneStage } from '@/components/riceconnect';
import { FarmProfileScreen } from '@/screens/farm';
import { useViewState } from '@/screens/params';

function Inner({ id }: { id: string }) {
  const state = useViewState(['error', 'success'] as const);
  return <FarmProfileScreen key={state} id={id} state={state} />;
}

export function FarmProfilePage({ id }: { id: string }) {
  return (
    <PhoneStage>
      <Suspense fallback={<FarmProfileScreen id={id} />}><Inner id={id} /></Suspense>
    </PhoneStage>
  );
}
