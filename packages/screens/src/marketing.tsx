'use client';
import { useState } from 'react';
import { ApplicationLogo, DemoChip, Icon, LanguageSwitcher, SecondaryButton, StatusChip, TeamFooter, ThemeToggle, ZLink, useI18n } from '@rc/ui';
import { resetDemoState } from '@rc/store/react';
import { FARMS, TOTALS } from '@rc/domain/seed';
import { BARANGAYS, MUNICIPALITY } from '@rc/domain/params';

/* Public marketing site (apps/marketing "/" and "/launch"; derived, not in canvas). Built only from the design system:
   glass panels, tokens, line icons + a word. Every claim carries a label: Model (how the cluster is designed to work),
   Simulated (numbers from the prototype's seeded data), Assumed (placeholders in docs/NUMBERS.md). No form, no backend. */
export const CONTACT_EMAIL = 'team@example.com'; // placeholder: replace with the team's address before sharing

type Tag = 'model' | 'simulated' | 'assumed';
function ClaimTag({ tag }: { tag: Tag }) {
    const { t } = useI18n();
    return <StatusChip status={tag === 'model' ? 'open' : 'pending'} kind={tag === 'model' ? 'brand' : tag === 'simulated' ? 'info' : 'warning'} label={t('mk.tag.' + tag)} />;
}
function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 py-10 md:py-14">
            <div className="eyebrow">{eyebrow}</div>
            <h2 id={`${id}-h`} className="mt-2 text-[28px] md:text-[36px] leading-tight font-extrabold tracking-[-0.03em] uppercase break-words">{title}</h2>
            <div className="mt-6">{children}</div>
        </section>
    );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
    const { t } = useI18n();
    return (
        <div className="rc-ground min-h-screen flex flex-col">
            <header className="glass-panel !rounded-none !shadow-none sticky top-0 z-30 border-b border-[color:var(--glass-border)]">
                <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
                    <ZLink href="/" className="rounded-xl"><ApplicationLogo height={40} /></ZLink>
                    <nav aria-label={t('mk.nav')} className="hidden lg:flex items-center gap-1 ml-4">
                        {[['#problem', 'mk.nav.problem'], ['#how', 'mk.nav.how'], ['#who', 'mk.nav.who'], ['#status', 'mk.nav.status'], ['#faq', 'mk.nav.faq']].map(([h, k]) => (
                            <a key={h} href={h} className="min-h-[40px] inline-flex items-center px-3 rounded-full text-[13px] font-extrabold uppercase tracking-[0.06em] hover:bg-[rgba(5,150,105,.1)]">{t(k)}</a>
                        ))}
                    </nav>
                    <div className="flex-1" />
                    <DemoChip className="hidden md:inline-flex" />
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <ZLink href="/launch" className="btn-2026 !min-h-[44px]"><Icon name="ArrowRight" size={20} /><span>{t('mk.open')}</span></ZLink>
                </div>
            </header>
            <main className="flex-1 mx-auto w-full max-w-[1200px] px-4 md:px-6">{children}</main>
            <footer className="glass-panel !rounded-none !shadow-none border-t border-[color:var(--glass-border)]">
                <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <ApplicationLogo height={32} />
                        <span className="text-[14px] font-semibold text-[var(--text-secondary)]">{t('mk.footer.line')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold text-[var(--text-accent)] underline underline-offset-4"><Icon name="Send" size={20} />{t('mk.contact')}</a>
                        <ZLink href="/launch" className="inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold text-[var(--text-accent)] underline underline-offset-4">{t('mk.open')}</ZLink>
                        <DemoChip />
                    </div>
                </div>
                <TeamFooter className="mx-auto max-w-[1200px] !pt-0" />
            </footer>
        </div>
    );
}

const STEPS = [
    { icon: 'Plan', k: 'plan', href: '/plan' }, { icon: 'Market', k: 'commit', href: '/market' }, { icon: 'Dry', k: 'dry', href: '/dry' },
    { icon: 'Truck', k: 'haul', href: '/haul' }, { icon: 'Pay', k: 'pay', href: '/pay/L-03' },
];
const DOMAINS = [{ icon: 'Farm', k: 'supply' }, { icon: 'Market', k: 'demand' }, { icon: 'Logistics', k: 'logistics' }, { icon: 'Pay', k: 'payment' }];
const ROLES = [
    { icon: 'User', k: 'coordinator', href: '/home' }, { icon: 'Store', k: 'buyer', href: '/buyer' },
    { icon: 'Truck', k: 'driver', href: '/haul/driver' }, { icon: 'Sms', k: 'farmer', href: '/sms' },
];
const FAQ = ['live', 'data', 'app', 'price', 'privacy', 'lang'];

export function MarketingPage() {
    const { t } = useI18n();
    const ha = (TOTALS.areaTenths / 10).toFixed(1);
    return (
        <MarketingShell>
            {/* Hero */}
            <section aria-labelledby="hero-h" className="py-12 md:py-20 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
                <div className="flex flex-col gap-5">
                    <ApplicationLogo height={64} />
                    <h1 id="hero-h" className="text-[34px] md:text-[48px] leading-[1.05] font-extrabold tracking-[-0.03em] break-words">{t('mk.hero.title')}</h1>
                    <p className="m-0 text-[18px] leading-7 font-medium text-[var(--text-secondary)] max-w-[60ch]">{t('mk.hero.sub')}</p>
                    <div className="flex flex-wrap gap-3">
                        <ZLink href="/launch" className="btn-2026"><Icon name="ArrowRight" size={20} /><span>{t('mk.open')}</span></ZLink>
                        <a href="#how" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-[2rem] font-extrabold uppercase text-[13px] leading-4 tracking-[0.08em] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]"><Icon name="Route" size={20} /><span>{t('mk.how')}</span></a>
                    </div>
                </div>
                <div className="glass-panel rounded-[2rem] p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap"><span className="eyebrow">{t('mk.hero.card')}</span><ClaimTag tag="simulated" /></div>
                    <dl className="grid grid-cols-2 gap-4 tabular">
                        <div><dt className="eyebrow">{t('plan.stat.farms')}</dt><dd className="m-0 text-[32px] font-extrabold">{FARMS.length}</dd></div>
                        <div><dt className="eyebrow">{t('plan.stat.area')}</dt><dd className="m-0 text-[32px] font-extrabold">{ha} ha</dd></div>
                        <div className="col-span-2"><dt className="eyebrow">{t('mk.hero.where')}</dt><dd className="m-0 text-[16px] font-bold break-words">{MUNICIPALITY} · {BARANGAYS.join(', ')}</dd></div>
                    </dl>
                    <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)]">{t('mk.hero.cardNote')}</p>
                </div>
            </section>

            <Section id="problem" eyebrow={t('mk.problem.eyebrow')} title={t('mk.problem.title')}>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
                    {['when', 'whom', 'terms'].map((k) => (
                        <div key={k} className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-2">
                            <h3 className="text-[18px] font-extrabold">{t(`mk.problem.${k}.h`)}</h3>
                            <p className="m-0 text-[16px] leading-6 font-medium text-[var(--text-secondary)]">{t(`mk.problem.${k}.p`)}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="how" eyebrow={t('mk.how.eyebrow')} title={t('mk.how.title')}>
                <ol className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))]">
                    {STEPS.map((s, i) => (
                        <li key={s.k} className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-2">
                            <span className="flex items-center gap-2 eyebrow"><span className="tabular">{i + 1}</span><Icon name={s.icon} size={20} />{t(`mk.step.${s.k}.h`)}</span>
                            <p className="m-0 text-[15px] leading-6 font-medium">{t(`mk.step.${s.k}.p`)}</p>
                            <ZLink href={s.href} className="mt-auto inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]">{t('mk.see')}<Icon name="ArrowRight" size={20} /></ZLink>
                        </li>
                    ))}
                </ol>
                <div className="mt-3 flex items-center gap-2 flex-wrap"><ClaimTag tag="model" /><span className="text-[14px] font-semibold text-[var(--text-secondary)]">{t('mk.how.note')}</span></div>
            </Section>

            <Section id="domains" eyebrow={t('mk.domains.eyebrow')} title={t('mk.domains.title')}>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
                    {DOMAINS.map((d) => (
                        <div key={d.k} className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-2">
                            <span className="icon-box"><Icon name={d.icon} size={24} /></span>
                            <h3 className="text-[18px] font-extrabold">{t(`mk.domain.${d.k}.h`)}</h3>
                            <p className="m-0 text-[15px] leading-6 font-medium text-[var(--text-secondary)]">{t(`mk.domain.${d.k}.p`)}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="who" eyebrow={t('mk.who.eyebrow')} title={t('mk.who.title')}>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
                    {ROLES.map((r) => (
                        <div key={r.k} className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-2">
                            <span className="icon-box"><Icon name={r.icon} size={24} /></span>
                            <h3 className="text-[18px] font-extrabold">{t(`mk.role.${r.k}.h`)}</h3>
                            <p className="m-0 text-[15px] leading-6 font-medium text-[var(--text-secondary)]">{t(`mk.role.${r.k}.p`)}</p>
                            <ZLink href={r.href} className="mt-auto inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]">{t('mk.try')}<Icon name="ArrowRight" size={20} /></ZLink>
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="status" eyebrow={t('mk.status.eyebrow')} title={t('mk.status.title')}>
                <div className="glass-panel rounded-[2rem] p-6 flex flex-col gap-4 border-2 border-[color:var(--brand-gold)]">
                    <div className="flex flex-wrap items-center gap-3"><DemoChip /><span className="text-[16px] font-extrabold">{t('mk.status.stage')}</span></div>
                    <ul className="flex flex-col gap-3">
                        {(['model', 'simulated', 'assumed'] as Tag[]).map((g) => (
                            <li key={g} className="flex flex-wrap items-start gap-3"><ClaimTag tag={g} /><span className="flex-1 min-w-[220px] text-[15px] leading-6 font-medium">{t(`mk.status.${g}`, { n: FARMS.length, ha })}</span></li>
                        ))}
                    </ul>
                    <p className="m-0 text-[15px] leading-6 font-semibold text-[var(--text-secondary)]">{t('mk.status.next')}</p>
                </div>
            </Section>

            <Section id="team" eyebrow={t('mk.team.eyebrow')} title={t('mk.team.title')}>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
                    {['team', 'school', 'tbi'].map((k) => (
                        <div key={k} className="glass-panel rounded-[1.5rem] p-5"><h3 className="text-[18px] font-extrabold">{t(`mk.team.${k}.h`)}</h3><p className="mt-1 m-0 text-[15px] leading-6 font-medium text-[var(--text-secondary)]">{t(`mk.team.${k}.p`)}</p></div>
                    ))}
                </div>
            </Section>

            <Section id="faq" eyebrow={t('mk.faq.eyebrow')} title={t('mk.faq.title')}>
                <div className="flex flex-col gap-3">
                    {FAQ.map((k) => (
                        <details key={k} className="glass-panel rounded-[1.5rem] p-5 group">
                            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 min-h-[44px] text-[17px] font-extrabold">{t(`mk.faq.${k}.q`)}<Icon name="ChevronDown" size={24} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" /></summary>
                            <p className="mt-2 m-0 text-[16px] leading-6 font-medium text-[var(--text-secondary)]">{t(`mk.faq.${k}.a`)}</p>
                        </details>
                    ))}
                </div>
            </Section>
        </MarketingShell>
    );
}

const APPS = [
    { k: 'coordinator', icon: 'User', href: '/home' }, { k: 'buyer', icon: 'Store', href: '/buyer' },
    { k: 'driver', icon: 'Truck', href: '/haul/driver' }, { k: 'farmer', icon: 'Sms', href: '/sms' },
];
/** /launch: the four apps, the 78 s demo and "Reset demo data" (clears the shared store in this browser, all tabs). */
export function LaunchPage() {
    const { t } = useI18n();
    const [done, setDone] = useState(false);
    return (
        <MarketingShell>
            <section aria-labelledby="launch-h" className="py-10 md:py-14 flex flex-col gap-6">
                <div>
                    <div className="eyebrow">{t('mk.launch.eyebrow')}</div>
                    <h1 id="launch-h" className="mt-2 text-[32px] md:text-[40px] leading-tight font-extrabold tracking-[-0.03em] uppercase">{t('mk.launch.title')}</h1>
                    <p className="mt-2 m-0 text-[16px] leading-6 font-medium text-[var(--text-secondary)] max-w-[70ch]">{t('mk.launch.sub')}</p>
                </div>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
                    {APPS.map((a) => (
                        <ZLink key={a.k} href={a.href} className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform motion-reduce:transition-none">
                            <span className="icon-box"><Icon name={a.icon} size={24} /></span>
                            <span className="text-[18px] font-extrabold">{t(`mk.role.${a.k}.h`)}</span>
                            <span className="text-[15px] leading-6 font-medium text-[var(--text-secondary)]">{t(`mk.launch.${a.k}`)}</span>
                            <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]">{t('mk.try')}<Icon name="ArrowRight" size={20} /></span>
                        </ZLink>
                    ))}
                </div>
                <div className="glass-panel rounded-[1.5rem] p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[18px] font-extrabold">{t('mk.launch.demo.h')}</h2>
                        <p className="m-0 text-[15px] leading-6 font-medium text-[var(--text-secondary)]">{t('mk.launch.demo.p')}</p>
                    </div>
                    <ZLink href="/demo" className="btn-2026"><Icon name="Play" size={20} /><span>{t('mk.launch.demo.cta')}</span></ZLink>
                </div>
                <div className="glass-panel rounded-[1.5rem] p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[18px] font-extrabold">{t('mk.reset.h')}</h2>
                        <p className="m-0 text-[15px] leading-6 font-medium text-[var(--text-secondary)]">{t('mk.reset.p')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <SecondaryButton icon="Retry" onClick={() => { resetDemoState(); setDone(true); }}>{t('mk.reset.cta')}</SecondaryButton>
                        {done && <p role="status" className="m-0 text-[14px] font-extrabold text-[var(--success-ink)] flex items-center gap-1"><Icon name="CircleCheck" size={20} />{t('mk.reset.done')}</p>}
                    </div>
                </div>
                <PrimaryButtonLink />
            </section>
        </MarketingShell>
    );
}
function PrimaryButtonLink() {
    const { t } = useI18n();
    return <ZLink href="/" className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]"><Icon name="ChevronLeft" size={20} />{t('mk.back')}</ZLink>;
}
