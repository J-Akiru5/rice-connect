'use client';
import { Suspense } from 'react';
import { FarmProfileScreen } from '@rc/screens/farm';
import { useViewState } from '@rc/screens/params';
import { FrameProvider, useFrameParam } from '@rc/screens/shell';

function Inner({ id }: { id: string }) {
  const state = useViewState(['error', 'success'] as const);
  return (
    <FrameProvider framed={useFrameParam()}>
      <FarmProfileScreen key={state} id={id} state={state} />
    </FrameProvider>
  );
}

export function FarmProfilePage({ id }: { id: string }) {
  return (
    <Suspense fallback={<FarmProfileScreen id={id} />}>
      <Inner id={id} />
    </Suspense>
  );
}
