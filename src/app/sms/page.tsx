'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PhoneStage } from '@/components/riceconnect';
import { SmsAllScreen, SmsScreen } from '@/screens/sms';

const Phone = () => <PhoneStage><SmsScreen /></PhoneStage>;
function Inner() {
  return useSearchParams().get('all') === '1' ? <SmsAllScreen /> : <Phone />;
}

export default function SmsPage() {
  return <Suspense fallback={<Phone />}><Inner /></Suspense>;
}
