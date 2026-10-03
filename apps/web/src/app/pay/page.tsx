'use client';
import { Suspense } from 'react';
import { PayListScreen } from '@/screens/pay';
import { useViewState } from '@/screens/params';
import { useListState } from '@/screens/list-state';

function Inner() {
  const state = useViewState(['empty'] as const);
  return <PayListScreen state={state} list={useListState()} />;
}

export default function PayPage() {
  return <Suspense fallback={<PayListScreen />}><Inner /></Suspense>;
}
