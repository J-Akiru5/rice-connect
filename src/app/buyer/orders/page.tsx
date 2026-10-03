'use client';
import { Suspense } from 'react';
import { BuyerOrdersScreen } from '@/screens/buyer-orders';
import { useBuyerType } from '@/screens/buyer-type';

function Inner() {
  const [type, setType] = useBuyerType();
  return <BuyerOrdersScreen type={type} onType={setType} />;
}

export default function BuyerOrdersPage() {
  return <Suspense fallback={<BuyerOrdersScreen type="restaurant" onType={() => {}} />}><Inner /></Suspense>;
}
