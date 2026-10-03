'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SmsAllScreen, SmsScreen } from '@rc/screens/sms';
import { FrameProvider, useFrameParam } from '@rc/screens/shell';

function Inner() {
  const framed = useFrameParam();
  if (useSearchParams().get('all') === '1') return <SmsAllScreen />;
  return <FrameProvider framed={framed}><SmsScreen reply /></FrameProvider>;
}

export default function SmsPage() {
  return <Suspense fallback={<SmsScreen />}><Inner /></Suspense>;
}
