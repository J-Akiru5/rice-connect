'use client';
import {
    AppShell,
    ASSETS,
    ErrorState,
    Icon,
    LoadingState,
    PrimaryButton,
    SettlementSlip,
    ZLink,
    useI18n
} from '@rc/ui';
import { useSettlement } from '@rc/data';
import { peso } from '@rc/domain/money';
import { HERO_FARM, HERO_LOT } from '@rc/domain/seed';

/** Farmer slip viewer (farmer app): net, advance and balance in large type, then the A6 slip the farmer gets
    on paper (printable). The numbers come from the settlement repository and match the SMS. */
export function SlipScreen() {
    const { t } = useI18n();
    const { data: slip, isPending, isError, refetch } = useSettlement(HERO_LOT.id);
    const figure = (label: string, value: string, highlight = false) => (
        <div className="min-w-0">
            <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                {label}
            </p>
            <p
                className={`m-0 mt-1 text-[28px] md:text-[32px] leading-9 font-extrabold tabular break-words ${highlight ? 'text-[var(--text-accent)]' : ''}`}
            >
                {value}
            </p>
        </div>
    );
    return (
        <AppShell
            role="farmer"
            title="slip.title"
            eyebrow={slip ? t('slip.viewer', { farm: HERO_FARM.id, slip: slip.id }) : t('slip.title')}
            active="slip"
        >
            <div className="flex flex-col items-center gap-4">
                {isPending ? (
                    <LoadingState rows={3} className="w-full max-w-[760px]" />
                ) : isError || !slip ? (
                    <ErrorState onRetry={() => void refetch()} className="w-full max-w-[760px]" />
                ) : (
                    <>
                        <section
                            className="glass-panel rounded-[1.5rem] p-5 w-full max-w-[760px] grid gap-5 sm:grid-cols-3"
                            aria-label={t('slip.title')}
                        >
                            {figure(t('slip.net'), peso(slip.net), true)}
                            {figure(t('slip.advance'), peso(slip.advance))}
                            {figure(t('slip.balance'), peso(slip.balance))}
                            <p className="m-0 sm:col-span-3 text-[14px] font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                                <Icon name="Info" size={20} className="shrink-0" />
                                {t('slip.sameSms')}
                            </p>
                        </section>
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
                                    slip={slip}
                                    farmer={HERO_FARM.name}
                                    logoSrc={ASSETS.logoMono}
                                    className="print-slip"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppShell>
    );
}
