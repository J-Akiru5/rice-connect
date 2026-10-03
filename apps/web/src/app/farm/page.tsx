'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FarmListScreen } from '@rc/screens/farm';
import { useViewState } from '@rc/screens/params';
import { useListState } from '@rc/screens/list-state';
import { FrameProvider, useFrameParam } from '@rc/screens/shell';

function Inner() {
  const state = useViewState(['empty'] as const);
  const framed = useFrameParam();
  return (
    <FrameProvider framed={framed}>
      <List state={state} selectedId={useSearchParams().get('farm') ?? ''} />
    </FrameProvider>
  );
}
/* Inside the provider so the default page size can see the phone frame. */
function List({ state, selectedId }: { state: 'default' | 'empty'; selectedId: string }) {
  return <FarmListScreen state={state} list={useListState()} selectedId={selectedId} />;
}

export default function FarmPage() {
  return <Suspense fallback={<FarmListScreen />}><Inner /></Suspense>;
}
