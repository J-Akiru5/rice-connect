'use client';
import { useEffect, useState } from 'react';
import { ACCOUNTS, ApplicationLogo, DemoChip, Icon, LanguageSwitcher, SecondaryButton, StatusChip, ThemeToggle, ZLink, useI18n } from '@rc/ui';
import { resetDemoState } from '@rc/store/react';
import overrides from '@rc/domain/overrides.json';
import { FARMS, LOTS, TOTALS, WEEKS, commitmentOfLot, farmById } from '@rc/domain/seed';
import { BARANGAYS, MUNICIPALITY } from '@rc/domain/params';

/* Public marketing site (apps/main "/" and "/launch"; derived, not in canvas). Built only from the design system:
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

const NAV_LINKS = [['#problem', 'mk.nav.problem'], ['#how', 'mk.nav.how'], ['#who', 'mk.nav.who'], ['#status', 'mk.nav.status'], ['#faq', 'mk.nav.faq']];
const linkCls = 'inline-flex items-center gap-2 min-h-[44px] text-[15px] font-bold text-[var(--ink)] hover:text-[var(--text-accent)]';

/** Public-site chrome (M18, structure after the team's LikasLens landing page, RiceConnect design system):
    one header row that never wraps or changes height (nav from 1440px, a Menu panel below that), the language menu,
    theme, Log In and Open Prototype; a footer with link columns and the outlined wordmark. */
export function MarketingShell({ children }: { children: React.ReactNode }) {
    const { t } = useI18n();
    const [menu, setMenu] = useState(false);
    useEffect(() => {
        if (!menu) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [menu]);
    return (
        <div className="rc-ground min-h-screen flex flex-col">
            <header className="glass-panel !rounded-none !shadow-none sticky top-0 z-30 border-b border-[color:var(--glass-border)]">
                <div className="mx-auto max-w-[1280px] h-[72px] px-4 md:px-6 flex flex-nowrap items-center gap-2 md:gap-3">
                    <ZLink href="/" className="rounded-xl shrink-0"><ApplicationLogo height={40} /></ZLink>
                    <nav aria-label={t('mk.nav')} className="hidden xl:flex items-center gap-1 ml-6">
                        {NAV_LINKS.map(([h, k]) => (
                            <a key={h} href={h} className="min-h-[40px] inline-flex items-center px-3 rounded-full text-[13px] font-extrabold uppercase tracking-[0.06em] whitespace-nowrap hover:bg-[rgba(5,150,105,.1)]">{t(k)}</a>
                        ))}
                    </nav>
                    <div className="flex-1" />
                    <LanguageSwitcher />
                    <ThemeToggle className="hidden md:inline-flex whitespace-nowrap" />
                    <ZLink href="/login" className="hidden lg:inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full text-[13px] font-extrabold uppercase tracking-[0.06em] whitespace-nowrap hover:bg-[rgba(5,150,105,.1)]"><Icon name="LogIn" size={20} /><span>{t('mk.login')}</span></ZLink>
                    <ZLink href="/launch" className="btn-2026 !min-h-[44px] !whitespace-nowrap hidden md:inline-flex"><Icon name="ArrowRight" size={20} /><span>{t('mk.open')}</span></ZLink>
                    <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mk-menu"
                        className="xl:hidden inline-flex items-center gap-2 min-h-[44px] px-3 rounded-full glass-panel !shadow-none text-[13px] font-extrabold uppercase tracking-[0.06em] whitespace-nowrap">
                        <Icon name={menu ? 'X' : 'Menu'} size={20} /><span className="sr-only sm:not-sr-only">{t(menu ? 'mk.menu.close' : 'mk.menu')}</span>
                    </button>
                </div>
                {menu && (
                    <div id="mk-menu" className="xl:hidden border-t border-[color:var(--glass-border)] bg-[var(--glass-fill-strong)]">
                        <nav aria-label={t('mk.nav')} className="mx-auto max-w-[1280px] px-4 md:px-6 py-4 grid gap-1 sm:grid-cols-2">
                            {NAV_LINKS.map(([h, k]) => (
                                <a key={h} href={h} onClick={() => setMenu(false)} className="min-h-[44px] inline-flex items-center px-3 rounded-xl text-[15px] font-extrabold hover:bg-[rgba(5,150,105,.1)]">{t(k)}</a>
                            ))}
                            <div className="sm:col-span-2 mt-2 pt-3 border-t border-[color:var(--glass-border-strong)] flex flex-wrap items-center gap-3">
                                <ZLink href="/login" className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"><Icon name="LogIn" size={20} /><span>{t('mk.login')}</span></ZLink>
                                <ZLink href="/launch" className="btn-2026 md:hidden"><Icon name="ArrowRight" size={20} /><span>{t('mk.open')}</span></ZLink>
                                <ThemeToggle className="md:hidden" />
                            </div>
                        </nav>
                    </div>
                )}
            </header>
            <main className="flex-1 mx-auto w-full max-w-[1280px] px-4 md:px-6">{children}</main>
            <SiteFooter />
        </div>
    );
}

function SiteFooter() {
    const { t } = useI18n();
    const cols: { h: string; links: [string, string][] }[] = [
        { h: 'mk.foot.prototype', links: [[ACCOUNTS.coordinator.signIn, 'role.name.coordinator'], [ACCOUNTS.buyer.signIn, 'role.name.buyer'], [ACCOUNTS.driver.signIn, 'role.name.driver'], ['/farmer', 'mk.role.farmer.h'], [ACCOUNTS.admin.signIn, 'role.name.admin']] },
        { h: 'mk.foot.project', links: [['/#how', 'mk.nav.how'], ['/#status', 'mk.nav.status'], ['/#faq', 'mk.nav.faq'], ['/demo', 'mk.launch.demo.h']] },
        { h: 'mk.foot.contact', links: [[`mailto:${CONTACT_EMAIL}`, 'mk.contact'], ['/launch', 'mk.open'], ['/login', 'mk.login']] },
    ];
    return (
        <footer className="relative overflow-hidden glass-panel !rounded-none !shadow-none border-t border-[color:var(--glass-border)] mt-10">
            <div className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 pt-12 pb-6 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
                <div className="flex flex-col gap-4">
                    <ApplicationLogo height={44} />
                    <div className="glass-panel rounded-[1.25rem] p-4 max-w-[440px]">
                        <h3 className="text-[15px] font-extrabold text-[var(--text-accent)]">{t('mk.foot.mode.h')}</h3>
                        <p className="m-0 mt-1 text-[14px] leading-5 font-medium text-[var(--text-secondary)]">{t('mk.foot.mode.p')}</p>
                    </div>
                    <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)] max-w-[440px]">{t('mk.footer.line')}</p>
                </div>
                {cols.map((c) => (
                    <nav key={c.h} aria-label={t(c.h)} className="flex flex-col gap-1">
                        <h3 className="eyebrow mb-2">{t(c.h)}</h3>
                        {c.links.map(([href, k]) => href.startsWith('mailto:')
                            ? <a key={href} href={href} className={linkCls}>{t(k)}</a>
                            : <ZLink key={href} href={href} className={linkCls}>{t(k)}</ZLink>)}
                    </nav>
                ))}
            </div>
            <div className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 py-5 border-t border-[color:var(--glass-border-strong)] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{t('mk.foot.rights')}</span>
                <DemoChip />
            </div>
            <div aria-hidden className="rc-wordmark pointer-events-none select-none text-center whitespace-nowrap leading-[0.8] font-extrabold tracking-[-0.04em] text-[clamp(64px,15vw,240px)] -mb-[0.12em]">RICECONNECT</div>
        </footer>
    );
}

/** Live-tracker style card (hero): the demo week's lots from the seed, with their buyer match. */
function HarvestTracker() {
    const { t } = useI18n();
    const week = Math.floor(overrides.demoTodayDayIndex / 7);
    const lots = LOTS.filter((l) => l.week === WEEKS[week]).sort((a, b) => a.dayIndex - b.dayIndex || a.id.localeCompare(b.id)).slice(0, 5);
    return (
        <section aria-labelledby="tracker-h" className="glass-panel rounded-[1.75rem] overflow-hidden shadow-[var(--shadow-popover)]">
            <div className="flex items-center justify-between gap-2 flex-wrap px-5 py-4 border-b border-[color:var(--glass-border-strong)]">
                <h2 id="tracker-h" className="eyebrow flex items-center gap-2"><span aria-hidden className="w-2 h-2 rounded-full bg-[var(--success)]" />{t('mk.tracker.title')}</h2>
                <span className="flex items-center gap-2 flex-wrap"><span className="text-[13px] font-bold text-[var(--text-secondary)] tabular">{t('mk.tracker.week', { w: WEEKS[week] })}</span><ClaimTag tag="simulated" /></span>
            </div>
            <ul>
                {lots.map((l) => {
                    const f = farmById(l.farm)!;
                    const c = commitmentOfLot(l.id);
                    return (
                        <li key={l.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-[color:var(--glass-border-strong)] last:border-0 tabular">
                            <div className="min-w-0">
                                <div className="text-[16px] font-extrabold">{t('farm.lot')} {l.id} <span className="text-[14px] font-semibold text-[var(--text-secondary)]">· {f.harvestLabel}</span></div>
                                <div className="text-[14px] font-semibold text-[var(--text-secondary)] break-words">{t('mk.tracker.lotLine', { farm: f.id, brgy: f.barangay })}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[18px] font-extrabold whitespace-nowrap">{(Math.round(l.driedKg / 100) / 10).toFixed(1)} t</span>
                                <StatusChip status={c ? 'matched' : 'open'} label={t(c ? 'mk.tracker.matched' : 'mk.tracker.open')} />
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-3 border-t border-[color:var(--glass-border-strong)] bg-[rgba(5,150,105,.05)]">
                <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{t('mk.tracker.foot')}</span>
                <ZLink href="/plan" className="inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]">{t('mk.tracker.cta')}<Icon name="ArrowRight" size={20} /></ZLink>
            </div>
        </section>
    );
}

const STEPS = [
    { icon: 'Plan', k: 'plan', href: '/plan' }, { icon: 'Market', k: 'commit', href: '/market' }, { icon: 'Dry', k: 'dry', href: '/dry' },
    { icon: 'Truck', k: 'haul', href: '/haul' }, { icon: 'Pay', k: 'pay', href: '/pay/L-03' },
];
const DOMAINS = [{ icon: 'Farm', k: 'supply' }, { icon: 'Market', k: 'demand' }, { icon: 'Logistics', k: 'logistics' }, { icon: 'Pay', k: 'payment' }];
const ROLES = [
    { icon: 'User', k: 'coordinator', href: ACCOUNTS.coordinator.signIn }, { icon: 'Store', k: 'buyer', href: ACCOUNTS.buyer.signIn },
    { icon: 'Truck', k: 'driver', href: ACCOUNTS.driver.signIn }, { icon: 'Sms', k: 'farmer', href: '/sms' },
];
const FAQ = ['live', 'data', 'app', 'price', 'privacy', 'lang'];

export function MarketingPage() {
    const { t } = useI18n();
    const ha = (TOTALS.areaTenths / 10).toFixed(1);
    return (
        <MarketingShell>
            {/* Hero */}
            <section aria-labelledby="hero-h" className="pt-10 md:pt-16 pb-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 min-h-[32px] px-3.5 py-1 rounded-full glass-panel !shadow-none border border-[color:var(--text-accent)] text-[12px] leading-4 font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]">
                            <span aria-hidden className="w-2 h-2 rounded-full bg-[var(--text-accent)]" />{t('mk.hero.pill')}
                        </span>
                        <DemoChip />
                    </div>
                    <h1 id="hero-h" className="text-[40px] md:text-[56px] lg:text-[64px] leading-[1.02] font-extrabold tracking-[-0.04em] break-words">{t('mk.hero.title')}</h1>
                    <p className="m-0 text-[18px] leading-7 font-medium text-[var(--text-secondary)] max-w-[58ch]">{t('mk.hero.sub')}</p>
                    <div className="flex flex-wrap gap-3">
                        <ZLink href="/launch" className="btn-2026"><Icon name="ArrowRight" size={20} /><span>{t('mk.open')}</span></ZLink>
                        <a href="#how" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-[2rem] font-extrabold uppercase text-[13px] leading-4 tracking-[0.08em] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]"><Icon name="Route" size={20} /><span>{t('mk.how')}</span></a>
                    </div>
                    <ul className="flex flex-wrap gap-2" aria-label={t('mk.hero.card')}>
                        {[['Sms', 'mk.badge.sms'], ['Language', 'mk.badge.lang'], ['MapPin', 'mk.badge.place']].map(([icon, k]) => (
                            <li key={k} className="inline-flex items-center gap-2 min-h-[32px] px-3 py-1 rounded-full glass-panel !shadow-none text-[13px] font-bold"><Icon name={icon} size={16} />{t(k)}</li>
                        ))}
                    </ul>
                </div>
                <HarvestTracker />
            </section>
            <section aria-label={t('mk.hero.card')} className="glass-panel rounded-[1.5rem] px-5 py-4 grid gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,2fr)_auto] items-center tabular">
                <div><div className="eyebrow">{t('plan.stat.farms')}</div><div className="text-[28px] font-extrabold">{FARMS.length}</div></div>
                <div><div className="eyebrow">{t('plan.stat.area')}</div><div className="text-[28px] font-extrabold">{ha} ha</div></div>
                <div className="min-w-0"><div className="eyebrow">{t('mk.hero.where')}</div><div className="text-[16px] font-bold break-words">{MUNICIPALITY} · {BARANGAYS.join(', ')}</div></div>
                <ClaimTag tag="simulated" />
            </section>
            <a href="#problem" className="mx-auto mt-6 flex w-fit flex-col items-center gap-1 min-h-[44px] text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-secondary)]">{t('mk.scroll')}<Icon name="ChevronDown" size={20} /></a>

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
    { k: 'coordinator', icon: 'User', href: ACCOUNTS.coordinator.signIn, h: 'mk.role.coordinator.h', p: 'mk.launch.coordinator' },
    { k: 'buyer', icon: 'Store', href: ACCOUNTS.buyer.signIn, h: 'mk.role.buyer.h', p: 'mk.launch.buyer' },
    { k: 'driver', icon: 'Truck', href: ACCOUNTS.driver.signIn, h: 'mk.role.driver.h', p: 'mk.launch.driver' },
    /* The farmer has no app sign-in: the farmer only uses SMS. */
    { k: 'farmer', icon: 'Sms', href: '/sms', h: 'mk.role.farmer.h', p: 'mk.launch.farmer' },
    { k: 'admin', icon: 'Shield', href: ACCOUNTS.admin.signIn, h: 'login.admin.h', p: 'login.admin.p' },
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
                            <span className="text-[18px] font-extrabold">{t(a.h)}</span>
                            <span className="text-[15px] leading-6 font-medium text-[var(--text-secondary)]">{t(a.p)}</span>
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
/** /login (M19): simulated sign-in. No accounts, no passwords: choosing a role opens that person's app. */
function PrimaryButtonLink() {
    const { t } = useI18n();
    return <ZLink href="/" className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]"><Icon name="ChevronLeft" size={20} />{t('mk.back')}</ZLink>;
}
