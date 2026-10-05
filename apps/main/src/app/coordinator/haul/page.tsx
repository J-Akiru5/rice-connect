'use client';
import { Suspense } from 'react';
import { HaulCoordinatorScreen } from '@rc/screens/haul';
import { useViewState } from '@rc/screens/params';
import { FrameProvider, useFrameParam } from '@rc/screens/shell';

function Inner() {
  const state = useViewState(['empty', 'error', 'success'] as const);
  return (
    <FrameProvider framed={useFrameParam()}>
      <HaulCoordinatorScreen key={state} state={state} />
    </FrameProvider>
  );
}

export default function HaulPage() {
  return (
    <Suspense fallback={<HaulCoordinatorScreen />}>
      <Inner />
    </Suspense>
  );
}
