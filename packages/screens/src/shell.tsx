'use client';
import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell, PhoneShell, PhoneStage } from '@rc/ui';
import type { Role } from '@rc/ui/Components/AppShell';

/* PhoneFrame rules (docs/DECISIONS.md, R1): the phone frame appears only on /sms (the farmer's phone),
   inside /demo, and on the phone modules (Farm, Haul) when the URL has ?frame=phone or ?rec=1.
   Everything else renders as a responsive website. */
const FrameCtx = createContext(false);
export const FrameProvider = ({ framed, children }: PropsWithChildren<{ framed: boolean }>) => (
    <FrameCtx.Provider value={framed}>{children}</FrameCtx.Provider>
);
export const useFramed = () => useContext(FrameCtx);
/** ?frame=phone or ?rec=1 asks for the phone frame (read inside a Suspense boundary). */
export function useFrameParam() {
    const p = useSearchParams();
    return p.get('frame') === 'phone' || p.get('rec') === '1';
}

/** The shell for a phone module (Farm, Haul): the website shell, or the phone shell inside the frame. */
export function ModuleShell({
    title,
    active,
    role,
    eyebrow,
    children
}: PropsWithChildren<{ title: ReactNode; active: string; role?: Role; eyebrow?: ReactNode }>) {
    const framed = useFramed();
    if (framed)
        return (
            <PhoneStage>
                <PhoneShell role={role} title={title} active={active}>
                    {children}
                </PhoneShell>
            </PhoneStage>
        );
    return (
        <AppShell role={role} title={title} eyebrow={eyebrow} active={active}>
            {children}
        </AppShell>
    );
}
