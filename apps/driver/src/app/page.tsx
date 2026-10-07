'use client';
import { Suspense } from 'react';
import { HaulDriverListScreen } from '@rc/screens/haul';
import { FrameProvider, useFrameParam } from '@rc/screens/shell';

function Inner() {
  return (
    <FrameProvider framed={useFrameParam()}>
      <HaulDriverListScreen />
    </FrameProvider>
  );
}

export default function HaulDriverPage() {
  return (
    <Suspense fallback={<HaulDriverListScreen />}>
      <Inner />
    </Suspense>
  );
}
