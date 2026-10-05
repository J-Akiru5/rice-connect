'use client';
import { Suspense } from 'react';
import { PayListScreen } from '@rc/screens/pay';
import { useViewState } from '@rc/screens/params';
import { useListState } from '@rc/screens/list-state';

function Inner() {
  const state = useViewState(['empty'] as const);
  return <PayListScreen state={state} list={useListState()} />;
}

export default function PayPage() {
  return (
    <Suspense fallback={<PayListScreen />}>
      <Inner />
    </Suspense>
  );
}
