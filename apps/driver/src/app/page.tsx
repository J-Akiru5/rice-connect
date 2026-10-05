'use client';
import { Suspense } from 'react';
import { HaulDriverScreen } from '@rc/screens/haul';
import { FrameProvider, useFrameParam } from '@rc/screens/shell';

function Inner() {
  return (
    <FrameProvider framed={useFrameParam()}>
      <HaulDriverScreen />
    </FrameProvider>
  );
}

export default function HaulDriverPage() {
  return (
    <Suspense fallback={<HaulDriverScreen />}>
      <Inner />
    </Suspense>
  );
}
