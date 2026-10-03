'use client';
import { PropsWithChildren } from 'react';
import { PhoneFrame } from './Enactus';

/* Prototype addition (logged in docs/DECISIONS.md): phone modules render at 390px inside the design's
   PhoneFrame, centered on the ground, from 640px up. Below 640px (a real phone, or the 390x844 screenshot)
   the bezel and the drawn status bar are dropped and the screen fills the viewport. */
export default function PhoneStage({ children }: PropsWithChildren) {
    return (
        <div className="rc-ground min-h-screen w-full flex flex-col items-center sm:justify-center sm:py-8">
            <PhoneFrame className="max-sm:!w-full max-sm:!h-auto max-sm:!min-h-screen max-sm:!rounded-none max-sm:!border-0 max-sm:!overflow-visible max-sm:[&>div:first-child]:hidden max-sm:[&>div:last-child]:!static max-sm:[&>div:last-child]:!pt-0 shadow-[var(--shadow-popover)]">
                {children}
            </PhoneFrame>
        </div>
    );
}
