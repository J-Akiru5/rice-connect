'use client';
import { Suspense } from 'react';
import { BuyerOrdersScreen } from '@rc/screens/buyer-orders';
import { useBuyerType } from '@rc/screens/buyer-type';

function Inner() {
  const [type, setType] = useBuyerType();
  return <BuyerOrdersScreen type={type} onType={setType} />;
}

export default function BuyerOrdersPage() {
  return <Suspense fallback={<BuyerOrdersScreen type="restaurant" onType={() => {}} />}><Inner /></Suspense>;
}
