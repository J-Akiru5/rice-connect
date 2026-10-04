'use client';
import { AppShell, ASSETS, PrimaryButton, SettlementSlip, ZLink, Icon, useI18n } from '@rc/ui';
import { HERO_FARM, SLIP } from '@rc/domain/seed';

/** Farmer slip viewer (farmer app): the A6 settlement slip the farmer gets on paper, printable. */
export function SlipScreen() {
    const { t } = useI18n();
    return (
        <AppShell
            role="farmer"
            title="slip.title"
            eyebrow={t('slip.viewer', { farm: HERO_FARM.id, slip: SLIP.id })}
            active="slip"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap gap-3 justify-center print:hidden">
                    <PrimaryButton icon="Print" onClick={() => window.print()}>
                        {t('slip.print')}
                    </PrimaryButton>
                    <ZLink
                        href="/sms"
                        className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-[2rem] border-2 border-[color:var(--text-muted)] font-extrabold uppercase text-[13px] tracking-[0.08em]"
                    >
                        <Icon name="Sms" size={20} />
                        {t('nav.sms')}
                    </ZLink>
                </div>
                <div className="slip-stage bg-[var(--gray-300)] rounded-2xl p-6 flex justify-center max-w-full overflow-x-auto">
                    <div className="shadow-[var(--shadow-popover)] print:shadow-none">
                        <SettlementSlip
                            slip={SLIP}
                            farmer={HERO_FARM.name}
                            logoSrc={ASSETS.logoMono}
                            className="print-slip"
                        />
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
