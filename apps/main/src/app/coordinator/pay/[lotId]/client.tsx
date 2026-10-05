'use client';
import { Suspense } from 'react';
import { PayLotScreen } from '@rc/screens/pay';
import { useViewState } from '@rc/screens/params';

function Inner() {
  const state = useViewState(['error', 'success'] as const);
  return <PayLotScreen key={state} state={state} />;
}

export function PayLotPage() {
  return (
    <Suspense fallback={<PayLotScreen />}>
      <Inner />
    </Suspense>
  );
}
