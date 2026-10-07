'use client';
import { Suspense } from 'react';
import { HaulDriverScreen } from '@rc/screens/haul';
import { FrameProvider, useFrameParam } from '@rc/screens/shell';

function Inner({ id }: { id: string }) {
  return (
    <FrameProvider framed={useFrameParam()}>
      <HaulDriverScreen id={id} />
    </FrameProvider>
  );
}

export function JobClient({ id }: { id: string }) {
  return (
    <Suspense fallback={<HaulDriverScreen id={id} />}>
      <Inner id={id} />
    </Suspense>
  );
}
