'use client';
import { Suspense } from 'react';
import { PayLotScreen } from '@rc/screens/pay';
import { useViewState } from '@rc/screens/params';

function Inner({ lotId }: { lotId: string }) {
  const state = useViewState(['error', 'success'] as const);
  return <PayLotScreen key={state} lotId={lotId} state={state} />;
}

export function PayLotPage({ lotId }: { lotId: string }) {
  return (
    <Suspense fallback={<PayLotScreen lotId={lotId} />}>
      <Inner lotId={lotId} />
    </Suspense>
  );
}
