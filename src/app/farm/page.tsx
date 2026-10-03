'use client';
import { PhoneShell, PhoneStage } from '@/components/riceconnect';

export default function FarmPage() {
  return (
    <PhoneStage>
      <PhoneShell title="farm.title" active="farms">
        <p className="text-[16px]">Step 1 shell.</p>
      </PhoneShell>
    </PhoneStage>
  );
}
