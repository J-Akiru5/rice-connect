'use client';
import { Suspense } from 'react';
import { PlanScreen } from '@rc/screens/plan';
import { useListState } from '@rc/screens/list-state';

function Inner() {
  return <PlanScreen list={useListState()} />;
}

export default function PlanPage() {
  return <Suspense fallback={<PlanScreen />}><Inner /></Suspense>;
}
