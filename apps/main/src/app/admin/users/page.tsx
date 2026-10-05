'use client';
import { Suspense } from 'react';
import { AdminUsersScreen } from '@rc/screens/admin';
import { useListState } from '@rc/screens/list-state';

function Inner() {
  return <AdminUsersScreen list={useListState()} />;
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminUsersScreen />}>
      <Inner />
    </Suspense>
  );
}
