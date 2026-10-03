'use client';
import { Suspense } from 'react';
import { HaulDriverScreen } from '@/screens/haul';
import { FrameProvider, useFrameParam } from '@/screens/shell';

function Inner() {
  return <FrameProvider framed={useFrameParam()}><HaulDriverScreen /></FrameProvider>;
}

export default function HaulDriverPage() {
  return <Suspense fallback={<HaulDriverScreen />}><Inner /></Suspense>;
}
