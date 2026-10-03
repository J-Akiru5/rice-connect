'use client';
import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BuyerSupplyScreen } from '@/screens/buyer';
import { useBuyerType } from '@/screens/buyer-type';
import { SLOT } from '@/data/seed';

const HERO_WEEK = Math.floor(SLOT.dayIndex / 7);

function Inner() {
  const [type, setType] = useBuyerType();
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const w = Number.parseInt(sp.get('week') ?? '', 10);
  const week = w >= 1 && w <= 4 ? w - 1 : HERO_WEEK;
  const onWeek = (i: number) => { const n = new URLSearchParams(sp.toString()); n.set('week', String(i + 1)); router.replace(`${pathname}?${n}`, { scroll: false }); };
  return <BuyerSupplyScreen type={type} onType={setType} week={week} onWeek={onWeek} />;
}

export default function BuyerPage() {
  return <Suspense fallback={<BuyerSupplyScreen type="restaurant" onType={() => {}} week={HERO_WEEK} onWeek={() => {}} />}><Inner /></Suspense>;
}
