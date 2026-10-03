'use client';
import { Suspense } from 'react';
import { PayListScreen } from '@/screens/pay';
import { useViewState } from '@/screens/params';

function Inner() {
  const state = useViewState(['empty'] as const);
  return <PayListScreen state={state} />;
}

export default function PayPage() {
  return <Suspense fallback={<PayListScreen />}><Inner /></Suspense>;
}
