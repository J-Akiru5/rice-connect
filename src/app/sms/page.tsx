'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SmsAllScreen, SmsScreen } from '@/screens/sms';
import { FrameProvider, useFrameParam } from '@/screens/shell';

function Inner() {
  const framed = useFrameParam();
  if (useSearchParams().get('all') === '1') return <SmsAllScreen />;
  return <FrameProvider framed={framed}><SmsScreen /></FrameProvider>;
}

export default function SmsPage() {
  return <Suspense fallback={<SmsScreen />}><Inner /></Suspense>;
}
