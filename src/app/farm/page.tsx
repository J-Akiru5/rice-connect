'use client';
import { Suspense } from 'react';
import { FarmListScreen } from '@/screens/farm';
import { useViewState } from '@/screens/params';
import { FrameProvider, useFrameParam } from '@/screens/shell';

function Inner() {
  const state = useViewState(['empty'] as const);
  return <FrameProvider framed={useFrameParam()}><FarmListScreen state={state} /></FrameProvider>;
}

export default function FarmPage() {
  return <Suspense fallback={<FarmListScreen />}><Inner /></Suspense>;
}
