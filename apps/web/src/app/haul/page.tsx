'use client';
import { Suspense } from 'react';
import { HaulCoordinatorScreen } from '@/screens/haul';
import { useViewState } from '@/screens/params';
import { FrameProvider, useFrameParam } from '@/screens/shell';

function Inner() {
  const state = useViewState(['empty', 'error', 'success'] as const);
  return <FrameProvider framed={useFrameParam()}><HaulCoordinatorScreen key={state} state={state} /></FrameProvider>;
}

export default function HaulPage() {
  return <Suspense fallback={<HaulCoordinatorScreen />}><Inner /></Suspense>;
}
