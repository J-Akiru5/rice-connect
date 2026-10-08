'use client';
import { Fragment, useEffect, useState } from 'react';
import {
    ACCOUNTS,
    ApplicationLogo,
    DemoChip,
    Icon,
    LanguageSwitcher,
    SecondaryButton,
    StatusChip,
    ThemeToggle,
    ZLink,
    useI18n
} from '@rc/ui';
import { resetDemoState } from '@rc/store/react';
import overrides from '@rc/domain/overrides.json';
import { FARMS, LOTS, TOTALS, WEEKS, commitmentOfLot, farmById } from '@rc/domain/seed';
import { BARANGAYS, MUNICIPALITY, PRICE } from '@rc/domain/params';

/* Public marketing site (apps/main "/" and "/launch"; derived, not in canvas). Built only from the design system:
   glass for the chrome, opaque "panel-solid" cards for content, tokens, line icons + a word. Every claim carries a label:
   Model (how the cluster is designed to work), Simulated (numbers from the prototype's seeded data), Assumed (placeholders
   in docs/NUMBERS.md). No form, no backend.

   Reader notes (older residents, municipal staff, business owners): body copy is 17px/28px in var(--ink) rather than
   muted 14-15px; paragraphs hold a ~60-70 character measure; long headings are sentence case (wide-tracked uppercase is
   hard to read at length) and only short labels stay uppercase; every card is an opaque sheet so its edge and its text
   contrast do not depend on what sits behind it. */
export const CONTACT_EMAIL = 'team@example.com'; // placeholder: replace with the team's address before sharing

type Tag = 'model' | 'simulated' | 'assumed';
function ClaimTag({ tag }: { tag: Tag }) {
    const { t } = useI18n();
    return (
        <StatusChip
            status={tag === 'model' ? 'open' : 'pending'}
            kind={tag === 'model' ? 'brand' : tag === 'simulated' ? 'info' : 'warning'}
            label={t('mk.tag.' + tag)}
        />
    );
}

/** One marketing section: the section name sits in the margin column beside the title instead of in a
    kicker above it, so the page has one left axis and reads like a document with a margin.
    The rule is ink-tinted: --glass-border-strong is a white overlay, which draws nothing at all on the
    light canvas, so the sections used to be separated by empty space and nothing else. */
function Section({
    id,
    eyebrow,
    title,
    children
}: {
    id: string;
    eyebrow: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 py-12 md:py-16 border-t rule-ink">
            <div className="grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,168px)_minmax(0,1fr)]">
                {/* md:pt-px lifts the 12px label's cap line onto the 38px title's cap line, so the margin
                    note and the heading share one top edge. */}
                <div className="eyebrow md:pt-px">{eyebrow}</div>
                <h2
                    id={`${id}-h`}
                    className="rc-display m-0 text-[30px] md:text-[38px] leading-[1.12] font-extrabold tracking-[-0.03em] max-w-[26ch] text-balance break-words"
                >
                    <AccentText text={title} />
                </h2>
            </div>
            <div className="mt-8">{children}</div>
        </section>
    );
}

/** Body copy inside a content card: 17px, high contrast, capped measure. */
const bodyCls = 'm-0 text-[17px] leading-7 font-medium text-[var(--ink)] max-w-[70ch]';
/** Secondary line under a figure or a card: readable size, not a whisper. */
const metaCls = 'm-0 text-[15px] leading-6 font-semibold text-[var(--text-secondary)] max-w-[70ch]';
/** The card itself: opaque sheet, one radius for the whole page. 16px, not 24-56px: the larger radii
    read as "insanely rounded" on a sheet, and this page is meant to look filed rather than friendly. */
const cardCls = 'panel-solid rounded-2xl';

/** The public site's only figures that are neither simulated nor computed: the impact the pitch commits
    to. They live in overrides.json (assumed, listed in docs/NUMBERS.md) and are interpolated into the
    strings, so no target is typed into a sentence by hand and every screen showing it can be re-checked
    in one place. */
const IMPACT = overrides.impact;
const IMPACT_VARS = {
    mc: overrides.forecastMcPct,
    adv: PRICE.advancePct,
    savingsMin: IMPACT.inputSavingsMinPct,
    savingsMax: IMPACT.inputSavingsMaxPct,
    lossMin: IMPACT.baselineLossMinPct,
    lossMax: IMPACT.baselineLossMaxPct,
    targetLoss: IMPACT.targetLossMaxPct,
    gainMin: IMPACT.incomeGainMinPct,
    gainMax: IMPACT.incomeGainMaxPct
};

/** A display heading rendered with its accent phrase marked up. The catalogue marks that phrase with
    [[...]] (strings.prototype.ts) in all three languages: the words carrying the argument get the display
    voice (the family's own italic plus the gold rule), and the rest of the string is rendered exactly as the
    reader receives it. A string with no mark renders plain. The brackets never reach the screen, so nothing
    is added to what a screen reader reads. */
function AccentText({ text }: { text: string }) {
    return (
        <>
            {text.split(/(\[\[.+?\]\])/g).map((part, i) =>
                part.startsWith('[[') && part.endsWith(']]') ? (
                    <span key={i} className="rc-accent">
                        {part.slice(2, -2)}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
}

/* Section index. The order is the page's own top-to-bottom order, so the scroll indicator only ever moves forward.
   #domains borrows the section's existing eyebrow as its label ("The Four Domains") — no new strings needed. */
const NAV_LINKS = [
    ['#problem', 'mk.nav.problem'],
    ['#value', 'mk.nav.value'],
    ['#how', 'mk.nav.how'],
    ['#who', 'mk.nav.who'],
    ['#domains', 'mk.domains.eyebrow'],
    ['#status', 'mk.nav.status'],
    ['#faq', 'mk.nav.faq']
] as const;
const NAV_IDS = NAV_LINKS.map(([h]) => h.slice(1));
/* Footer links sit on the brand band, so they are solid white with an underline on hover (white on brand-green
   is 10.9:1; the accent green used on the pale page would be unreadable on the band). */
const footLinkCls =
    'inline-flex items-center gap-2 min-h-[44px] text-[16px] font-bold text-[var(--white)] underline-offset-4 hover:underline';

/** Which section the reader is in, and how far down the page they are.
    "The last section whose top has passed the reading line" (30% down the viewport) is deliberate: while a
    section that is not in the index (Team) is on screen, the previous item stays lit, so the indicator is never
    blank in the middle of the page. One rAF-throttled scroll listener; no dependency, no layout thrash. */
function useScrollSpy(ids: readonly string[]) {
    const [active, setActive] = useState('');
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let raf = 0;
        const read = () => {
            raf = 0;
            const line = window.innerHeight * 0.3;
            let current = '';
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            setActive(current);
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
        };
        const onScroll = () => {
            if (!raf) raf = window.requestAnimationFrame(read);
        };
        read();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, [ids]);
    return { active, progress };
}

/** Public-site chrome (M18, structure after the team's LikasLens landing page, RiceConnect design system):
    one header row that never wraps or changes height (nav from 1440px, a Menu panel below that), the language menu,
    theme, Log In and Open Prototype; a footer with link columns and the outlined wordmark. */
export function MarketingShell({ children }: { children: React.ReactNode }) {
    const { t } = useI18n();
    const [menu, setMenu] = useState(false);
    const { active, progress } = useScrollSpy(NAV_IDS);
    useEffect(() => {
        if (!menu) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenu(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [menu]);
    return (
        /* overflow-x-clip lets the hero band paint edge to edge with 100vw without ever widening the
           document: it does not create a scroll container, so the sticky header still sticks. */
        <div className="rc-ground overflow-x-clip min-h-screen flex flex-col">
            {/* Full-bleed row: the mark sits on the true left edge and the account actions on the true right, so a
                wide screen is used edge to edge instead of leaving the header floating inside the content column. */}
            <header className="glass-panel !rounded-none !shadow-none sticky top-0 z-30 border-b border-[color:var(--glass-border)]">
                <div className="h-[72px] px-4 md:px-6 lg:px-8 flex flex-nowrap items-center gap-2 md:gap-3">
                    <ZLink href="/" className="rounded-xl shrink-0">
                        <ApplicationLogo height={40} />
                    </ZLink>
                    {/* The section index needs 1440px in English, 1715px in Tagalog and 1800px in Hiligaynon (the
                        labels are longer, and the header also carries the logo, language switcher, theme toggle,
                        log-in and the primary action). 1800px is the widest locale, measured, so nothing is
                        clipped and no type has to shrink below the reading floor for older readers. Below that
                        the Menu panel carries the same six links with the same active highlight. */}
                    <nav aria-label={t('mk.nav')} className="hidden min-[1800px]:flex items-center gap-1 ml-6">
                        {NAV_LINKS.map(([h, k]) => {
                            const on = active === h.slice(1);
                            return (
                                <a
                                    key={h}
                                    href={h}
                                    aria-current={on ? 'true' : undefined}
                                    className={`min-h-[40px] inline-flex items-center px-3 rounded-full text-[14px] font-extrabold uppercase tracking-[0.05em] whitespace-nowrap ${on ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'rc-hover-accent'}`}
                                >
                                    {t(k)}
                                </a>
                            );
                        })}
                    </nav>
                    <div className="flex-1" />
                    <LanguageSwitcher />
                    <ThemeToggle className="hidden md:inline-flex whitespace-nowrap" />
                    <ZLink
                        href="/login"
                        className="hidden lg:inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full text-[14px] font-extrabold uppercase tracking-[0.05em] whitespace-nowrap rc-hover-accent"
                    >
                        <Icon name="LogIn" size={20} />
                        <span>{t('mk.login')}</span>
                    </ZLink>
                    <ZLink href="/launch" className="btn-2026 !min-h-[44px] !whitespace-nowrap hidden md:inline-flex">
                        <Icon name="ArrowRight" size={20} />
                        <span>{t('mk.open')}</span>
                    </ZLink>
                    <button
                        type="button"
                        onClick={() => setMenu((m) => !m)}
                        aria-expanded={menu}
                        aria-controls="mk-menu"
                        className="min-[1800px]:hidden inline-flex items-center gap-2 min-h-[44px] px-3 rounded-full glass-panel !shadow-none text-[14px] font-extrabold uppercase tracking-[0.05em] whitespace-nowrap"
                    >
                        <Icon name={menu ? 'X' : 'Menu'} size={20} />
                        <span className="sr-only sm:not-sr-only">{t(menu ? 'mk.menu.close' : 'mk.menu')}</span>
                    </button>
                </div>
                {menu && (
                    <div
                        id="mk-menu"
                        className="min-[1800px]:hidden border-t border-[color:var(--glass-border)] bg-[var(--glass-fill-strong)]"
                    >
                        <nav
                            aria-label={t('mk.nav')}
                            className="mx-auto max-w-[1280px] px-4 md:px-6 py-4 grid gap-1 sm:grid-cols-2"
                        >
                            {NAV_LINKS.map(([h, k]) => {
                                const on = active === h.slice(1);
                                return (
                                    <a
                                        key={h}
                                        href={h}
                                        onClick={() => setMenu(false)}
                                        aria-current={on ? 'true' : undefined}
                                        className={`min-h-[48px] inline-flex items-center px-3 rounded-xl text-[16px] font-extrabold ${on ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'rc-hover-accent'}`}
                                    >
                                        {t(k)}
                                    </a>
                                );
                            })}
                            <div className="sm:col-span-2 mt-2 pt-3 border-t rule-ink flex flex-wrap items-center gap-3">
                                <ZLink
                                    href="/login"
                                    className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-2 border-[color:var(--text-muted)] text-[14px] font-extrabold uppercase tracking-[0.05em]"
                                >
                                    <Icon name="LogIn" size={20} />
                                    <span>{t('mk.login')}</span>
                                </ZLink>
                                <ZLink href="/launch" className="btn-2026 md:hidden">
                                    <Icon name="ArrowRight" size={20} />
                                    <span>{t('mk.open')}</span>
                                </ZLink>
                                <ThemeToggle className="md:hidden" />
                            </div>
                        </nav>
                    </div>
                )}
                {/* Reading progress along the header's bottom edge: a quiet cue for how much page is left. */}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px]">
                    <div
                        className="h-full bg-[var(--fill-strong)]"
                        style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                </div>
            </header>
            <main className="flex-1 mx-auto w-full max-w-[1280px] px-4 md:px-6">{children}</main>
            <SiteFooter />
        </div>
    );
}

function SiteFooter() {
    const { t } = useI18n();
    const cols: { h: string; links: [string, string][] }[] = [
        {
            h: 'mk.foot.prototype',
            links: [
                [ACCOUNTS.coordinator.signIn, 'role.name.coordinator'],
                [ACCOUNTS.buyer.signIn, 'role.name.buyer'],
                [ACCOUNTS.driver.signIn, 'role.name.driver'],
                [ACCOUNTS.farmer.signIn, 'mk.role.farmer.h'],
                [ACCOUNTS.admin.signIn, 'role.name.admin']
            ]
        },
        {
            h: 'mk.foot.project',
            links: [
                ['/#how', 'mk.nav.how'],
                ['/#status', 'mk.nav.status'],
                ['/#faq', 'mk.nav.faq'],
                ['/demo', 'mk.launch.demo.h']
            ]
        },
        {
            h: 'mk.foot.contact',
            links: [
                [`mailto:${CONTACT_EMAIL}`, 'mk.contact'],
                ['/launch', 'mk.open'],
                ['/login', 'mk.login']
            ]
        }
    ];
    return (
        <footer className="band-foot relative overflow-hidden mt-12">
            <div className="relative z-10 px-4 md:px-6 lg:px-8 pt-14 pb-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
                <div className="flex flex-col gap-5">
                    {/* tone="reversed": the white-on-dark logo set, so the mark survives the brand-green band. */}
                    <ApplicationLogo tone="reversed" height={44} />
                    <div className="band-panel rounded-[1.5rem] p-5 max-w-[460px]">
                        <h3 className="m-0 text-[17px] font-extrabold text-[var(--white)]">{t('mk.foot.mode.h')}</h3>
                        <p className="m-0 mt-1.5 text-[16px] leading-6 font-medium text-[var(--white)]">
                            {t('mk.foot.mode.p')}
                        </p>
                    </div>
                    <p className="m-0 text-[16px] leading-6 font-semibold text-[var(--white)] max-w-[460px]">
                        {t('mk.footer.line')}
                    </p>
                </div>
                {cols.map((c) => (
                    <nav key={c.h} aria-label={t(c.h)} className="flex flex-col gap-1">
                        <h3 className="m-0 mb-2 text-[13px] leading-4 font-extrabold uppercase tracking-[0.12em] text-[var(--white)]">
                            {t(c.h)}
                        </h3>
                        {c.links.map(([href, k]) =>
                            href.startsWith('mailto:') ? (
                                <a key={href} href={href} className={footLinkCls}>
                                    {t(k)}
                                </a>
                            ) : (
                                <ZLink key={href} href={href} className={footLinkCls}>
                                    {t(k)}
                                </ZLink>
                            )
                        )}
                    </nav>
                ))}
            </div>
            <div className="relative z-10 px-4 md:px-6 lg:px-8 py-5 border-t band-rule flex flex-wrap items-center justify-between gap-3">
                <span className="text-[15px] font-semibold text-[var(--white)]">{t('mk.foot.rights')}</span>
                <DemoChip />
            </div>
            {/* Sized from the live type metrics rather than a vw clamp: Plus Jakarta Sans 800 at -0.04em
                tracks 6.922em wide with 0.76em of ink above the baseline and 0.02em below. The viewBox is
                that ink box plus 24 units of headroom top and bottom, so the mark fits edge to edge at any
                width and no font substitution or metric rounding can shave an edge off. textLength holds the
                width to the same value even if the webfont has not loaded yet; vector-effect keeps the
                hairline stroke at 2 device px however far the mark is scaled. */}
            <svg
                aria-hidden
                viewBox="0 -24 6922 828"
                preserveAspectRatio="xMidYMid meet"
                className="rc-wordmark pointer-events-none select-none block w-full h-auto"
            >
                <text
                    x="0"
                    y="760"
                    textLength="6922"
                    lengthAdjust="spacingAndGlyphs"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                    fontSize="1000"
                    fontWeight="800"
                    letterSpacing="-40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                >
                    RICECONNECT
                </text>
            </svg>
        </footer>
    );
}

/** Live-tracker style card (hero): the demo week's lots from the seed, with their buyer match. */
function HarvestTracker() {
    const { t } = useI18n();
    const week = Math.floor(overrides.demoTodayDayIndex / 7);
    const lots = LOTS.filter((l) => l.week === WEEKS[week])
        .sort((a, b) => a.dayIndex - b.dayIndex || a.id.localeCompare(b.id))
        .slice(0, 5);
    return (
        /* White sheet on the green band. No hairline border, a defined drop shadow instead: a 1px border
           plus a wide soft shadow on one element is the "ghost card" pattern. */
        <section aria-labelledby="tracker-h" className="sheet-on-band rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 flex-wrap px-6 py-5 border-b rule-ink">
                <h2 id="tracker-h" className="eyebrow flex items-center gap-2">
                    <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
                    {t('mk.tracker.title')}
                </h2>
                <span className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-bold text-[var(--text-secondary)] tabular">
                        {t('mk.tracker.week', { w: WEEKS[week] ?? WEEKS[0] })}
                    </span>
                    <ClaimTag tag="simulated" />
                </span>
            </div>
            <ul>
                {lots.map((l) => {
                    const f = farmById(l.farm)!;
                    const c = commitmentOfLot(l.id);
                    return (
                        <li
                            key={l.id}
                            className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 px-6 py-4 border-b rule-ink last:border-0 tabular"
                        >
                            <div className="min-w-0">
                                <div className="text-[17px] leading-6 font-extrabold">
                                    {t('farm.lot')} {l.id}{' '}
                                    <span className="text-[15px] font-semibold text-[var(--text-secondary)]">
                                        · {f.harvestLabel}
                                    </span>
                                </div>
                                <div className="text-[15px] leading-6 font-semibold text-[var(--text-secondary)] break-words">
                                    {t('mk.tracker.lotLine', { farm: f.id, brgy: f.barangay })}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <span className="text-[20px] leading-7 font-extrabold whitespace-nowrap">
                                    {(Math.round(l.driedKg / 100) / 10).toFixed(1)} {t('unit.t')}
                                </span>
                                <StatusChip
                                    status={c ? 'matched' : 'open'}
                                    label={t(c ? 'mk.tracker.matched' : 'mk.tracker.open')}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="flex items-center justify-between gap-3 flex-wrap px-6 py-4 border-t rule-ink rc-bg-accent-faint">
                <span className="text-[15px] font-semibold text-[var(--text-secondary)]">{t('mk.tracker.foot')}</span>
                <ZLink
                    href="/plan"
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.05em] text-[var(--text-accent)]"
                >
                    {t('mk.tracker.cta')}
                    <Icon name="ArrowRight" size={20} />
                </ZLink>
            </div>
        </section>
    );
}

/* Demand first: the chain opens with what buyers have already committed, then how the cluster answers
   it. Bulk Inputs is the one step with no screen behind it (the prototype has no inputs module), so it
   carries a Model chip where the others carry "See It": a link that goes nowhere is worse than a label.
   Haul keeps its own step and its /haul link: logistics is part of the offer, and dropping the step would
   leave a shipped screen with no door on this page. */
const STEPS: { icon: string; k: string; href: string | null }[] = [
    { icon: 'Market', k: 'demand', href: '/market' },
    { icon: 'Plan', k: 'plan', href: '/plan' },
    { icon: 'Inventory', k: 'inputs', href: null },
    { icon: 'Dry', k: 'harvest', href: '/dry' },
    { icon: 'Truck', k: 'haul', href: '/haul' },
    { icon: 'Pay', k: 'settle', href: '/pay/L-03' }
];
const DOMAINS = [
    { icon: 'Farm', k: 'supply' },
    { icon: 'Market', k: 'demand' },
    { icon: 'Logistics', k: 'logistics' },
    { icon: 'Pay', k: 'payment' }
];
const ROLES = [
    { icon: 'User', k: 'coordinator', href: ACCOUNTS.coordinator.signIn },
    { icon: 'Store', k: 'buyer', href: ACCOUNTS.buyer.signIn },
    { icon: 'Truck', k: 'driver', href: ACCOUNTS.driver.signIn },
    { icon: 'Sms', k: 'farmer', href: ACCOUNTS.farmer.signIn }
];
const FAQ = ['live', 'data', 'app', 'price', 'privacy', 'lang'];

export function MarketingPage() {
    const { t } = useI18n();
    const ha = (TOTALS.areaTenths / 10).toFixed(1);
    return (
        <MarketingShell>
            {/* Hero: the page opens on the brand band, edge to edge, with the product's own tracker sheet laid
                on it. Image-free: the retired farm photograph is banned by the CI guard, and a stock farm shot
                reads as NGO affect (a PRODUCT.md anti-reference). The depth is a survey-ring field etched into
                the band, which is this product's actual subject, land under cultivation measured not pictured. */}
            <section
                aria-labelledby="hero-h"
                className="hero-band hero-ground pt-10 md:pt-12 pb-10 grid gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center"
            >
                <div className="flex flex-col gap-7">
                    {/* One stamp, not a chip stack. The prototype notice is the only mark above the headline
                        because it is the one claim an evaluator has to see before reading anything else; the
                        category label and the SMS/language/place pills that used to sit here restated the
                        headline, the standfirst and the record below, in three more pill shapes. */}
                    <div className="rc-in flex flex-wrap items-center gap-2">
                        <DemoChip />
                    </div>
                    <h1
                        id="hero-h"
                        className="rc-display rc-in rc-in-2 m-0 text-[40px] md:text-[56px] lg:text-[64px] leading-[1.04] font-extrabold tracking-[-0.04em] max-w-[22ch] text-balance break-words text-[var(--white)]"
                    >
                        <AccentText text={t('mk.hero.title')} />
                    </h1>
                    <p className="rc-in rc-in-3 m-0 text-[20px] leading-8 font-medium on-band-sub max-w-[58ch] text-pretty">
                        {t('mk.hero.sub')}
                    </p>
                    <div className="rc-in rc-in-4 flex flex-wrap gap-3">
                        <ZLink href="/launch" className="btn-2026 btn-on-band">
                            <Icon name="ArrowRight" size={20} />
                            <span>{t('mk.open')}</span>
                        </ZLink>
                        <a
                            href="#how"
                            className="on-band-outline inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-[2rem] font-extrabold uppercase text-[14px] leading-4 tracking-[0.05em]"
                        >
                            <Icon name="Route" size={20} />
                            <span>{t('mk.how')}</span>
                        </a>
                    </div>
                </div>
                <div className="rc-in rc-in-5">
                    <HarvestTracker />
                </div>
                {/* The key figures close the band rather than opening a second green block: on a darker inset
                    slab, so they read as the record underneath the hero and not as another section. */}
                <section
                    aria-label={t('mk.hero.card')}
                    className="band-inset rounded-2xl lg:col-span-2 px-6 py-6 md:px-8 md:py-7 grid gap-6 md:gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))] items-center tabular"
                >
                    <div>
                        <div className="text-[13px] leading-4 font-extrabold uppercase tracking-[0.12em] text-[var(--white)]">
                            {t('plan.stat.farms')}
                        </div>
                        <div className="mt-1 text-[40px] leading-[44px] font-extrabold text-[var(--white)]">
                            {FARMS.length}
                        </div>
                    </div>
                    <div>
                        <div className="text-[13px] leading-4 font-extrabold uppercase tracking-[0.12em] text-[var(--white)]">
                            {t('plan.stat.area')}
                        </div>
                        <div className="mt-1 text-[40px] leading-[44px] font-extrabold text-[var(--white)]">
                            {ha} {t('unit.ha')}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] leading-4 font-extrabold uppercase tracking-[0.12em] text-[var(--white)]">
                            {t('mk.hero.where')}
                        </div>
                        <div className="mt-1 text-[18px] leading-7 font-bold text-[var(--white)] break-words">
                            {MUNICIPALITY} · {BARANGAYS.join(', ')}
                        </div>
                    </div>
                </section>
                {/* The pitch's own commitments, on their own slab. The strip above is the record of the
                    prototype (simulated); these two are targets nothing here can measure yet, so they are
                    never mixed into one band of numbers. Both carry the Assumed chip, and the label says
                    out loud that they are not measured. */}
                <section
                    aria-label={t('mk.hero.impact')}
                    className="band-inset rounded-2xl lg:col-span-2 px-6 py-5 md:px-8 md:py-6 flex flex-wrap items-center gap-x-10 gap-y-5 tabular"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[13px] leading-4 font-extrabold uppercase tracking-[0.12em] text-[var(--white)]">
                            {t('mk.hero.impact')}
                        </span>
                        <ClaimTag tag="assumed" />
                    </div>
                    <div className="flex flex-wrap gap-x-10 gap-y-4">
                        <div>
                            <div className="text-[13px] leading-4 font-extrabold uppercase tracking-[0.12em] text-[var(--white)]">
                                {t('mk.hero.income')}
                            </div>
                            <div className="mt-1 text-[32px] leading-9 font-extrabold text-[var(--white)]">
                                {t('mk.hero.income.val', IMPACT_VARS)}
                            </div>
                        </div>
                        <div>
                            <div className="text-[13px] leading-4 font-extrabold uppercase tracking-[0.12em] text-[var(--white)]">
                                {t('mk.hero.loss')}
                            </div>
                            <div className="mt-1 text-[32px] leading-9 font-extrabold text-[var(--white)]">
                                {t('mk.hero.loss.val', IMPACT_VARS)}
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <a
                href="#problem"
                className="mx-auto mt-8 flex w-fit flex-col items-center gap-1 min-h-[44px] text-[13px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-secondary)]"
            >
                {t('mk.scroll')}
                <Icon name="ChevronDown" size={20} />
            </a>

            <Section id="problem" eyebrow={t('mk.problem.eyebrow')} title={t('mk.problem.title')}>
                {/* A register, not three identical cards: the label in the margin column, the prose in the text
                    column, one rule per entry. This is the shape a municipal reader already reads every day. */}
                <div className={`${cardCls} overflow-hidden`}>
                    {['when', 'whom', 'terms'].map((k) => (
                        <div
                            key={k}
                            className="grid gap-2 md:gap-x-10 md:gap-y-0 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] p-6 md:px-7 md:py-6 border-t rule-ink first:border-t-0"
                        >
                            <h3 className="m-0 text-[21px] leading-7 font-extrabold">{t(`mk.problem.${k}.h`)}</h3>
                            <p className={bodyCls}>{t(`mk.problem.${k}.p`)}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Two audiences, two doors, straight after the problem: the page has already said what is
                wrong, so the next thing a judge reads is who this is for and what each side gets. The
                claims on the two cards are not the same kind, so each card is chipped: the buyer side is
                the model, the farmer side is the model plus the assumed targets. Both actions are mailto:
                there is no intake form, and a form that posts nowhere would be worse than an email. */}
            <Section id="value" eyebrow={t('mk.value.eyebrow')} title={t('mk.value.title')}>
                <div className="grid gap-5 md:grid-cols-2">
                    {(['buyer', 'farmer'] as const).map((side) => (
                        <div key={side} className={`${cardCls} p-6 md:p-7 flex flex-col gap-3`}>
                            <span className="icon-box !h-14 !w-14">
                                <Icon name={side === 'buyer' ? 'Store' : 'Farm'} size={26} />
                            </span>
                            <h3 className="m-0 text-[21px] leading-7 font-extrabold">{t(`mk.value.${side}.h`)}</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <ClaimTag tag="model" />
                                {side === 'farmer' && <ClaimTag tag="assumed" />}
                            </div>
                            <p className={bodyCls}>{t(`mk.value.${side}.p`, IMPACT_VARS)}</p>
                            <a
                                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                                    t(`mk.value.${side}.subject`)
                                )}`}
                                className="mt-auto flex w-full items-center justify-center gap-2 min-h-[48px] px-5 rounded-[2rem] border-2 border-[color:var(--text-accent)] text-[14px] font-extrabold uppercase tracking-[0.05em] text-[var(--text-accent)]"
                            >
                                <Icon name="ArrowRight" size={20} />
                                {t(`mk.value.${side}.cta`)}
                            </a>
                        </div>
                    ))}
                </div>
                <p className={`${metaCls} mt-5`}>{t('mk.value.note')}</p>
            </Section>

            <Section id="how" eyebrow={t('mk.how.eyebrow')} title={t('mk.how.title')}>
                {/* Five steps as a numbered list rather than five narrow cards: at 200px each the copy wrapped
                    every few words, which is exactly the reading problem this pass is about. */}
                <ol className={`${cardCls} overflow-hidden list-none m-0 p-0`}>
                    {STEPS.map((s, i) => (
                        <li
                            key={s.k}
                            className="grid gap-4 md:gap-6 p-6 md:p-7 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start border-t rule-ink first:border-t-0"
                        >
                            <span
                                aria-hidden
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--fill-strong)] text-[22px] font-extrabold tabular text-[var(--on-fill-strong)]"
                            >
                                {i + 1}
                            </span>
                            <div className="min-w-0">
                                <h3 className="m-0 flex items-center gap-2.5 text-[21px] leading-7 font-extrabold">
                                    <Icon name={s.icon} size={24} className="shrink-0 text-[var(--text-accent)]" />
                                    {t(`mk.step.${s.k}.h`)}
                                </h3>
                                <p className={`${bodyCls} mt-2`}>{t(`mk.step.${s.k}.p`, IMPACT_VARS)}</p>
                            </div>
                            {s.href ? (
                                <ZLink
                                    href={s.href}
                                    className="justify-self-start md:justify-self-end inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full border-2 border-[color:var(--text-accent)] text-[14px] font-extrabold uppercase tracking-[0.05em] text-[var(--text-accent)] whitespace-nowrap"
                                >
                                    {t('mk.see')}
                                    <Icon name="ArrowRight" size={20} />
                                </ZLink>
                            ) : (
                                <span className="justify-self-start md:justify-self-end flex items-center min-h-[44px]">
                                    <ClaimTag tag="model" />
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
                <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <ClaimTag tag="model" />
                    <span className="text-[16px] leading-6 font-semibold text-[var(--text-secondary)]">
                        {t('mk.how.note')}
                    </span>
                </div>
            </Section>

            <Section id="who" eyebrow={t('mk.who.eyebrow')} title={t('mk.who.title')}>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
                    {ROLES.map((r) => (
                        <div key={r.k} className={`${cardCls} p-6 flex flex-col gap-3`}>
                            <span className="icon-box !h-14 !w-14">
                                <Icon name={r.icon} size={26} />
                            </span>
                            <h3 className="m-0 text-[21px] leading-7 font-extrabold">{t(`mk.role.${r.k}.h`)}</h3>
                            <p className={bodyCls}>{t(`mk.role.${r.k}.p`)}</p>
                            {/* A full-width, clearly bordered entry point: the old 13px text link was easy to miss. */}
                            <ZLink
                                href={r.href}
                                className="mt-auto flex w-full items-center justify-center gap-2 min-h-[48px] px-5 rounded-[2rem] border-2 border-[color:var(--text-accent)] text-[14px] font-extrabold uppercase tracking-[0.05em] text-[var(--text-accent)]"
                            >
                                <Icon name="ArrowRight" size={20} />
                                {t('mk.try')}
                            </ZLink>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Moved below "Who It's For": How It Works and The Four Domains both answer "what does this do", and
                reading them back to back made the page feel like it was repeating itself. Now the order is
                problem → mechanism → who it's for → scope → stage → team → questions. */}
            <Section id="domains" eyebrow={t('mk.domains.eyebrow')} title={t('mk.domains.title')}>
                {/* The four domains as one chain, in order, on the page's second brand band. Supply → matched
                    demand → logistics → payment is a cycle, so the sequence is information; drawn as a chain
                    because four more icon cards is the shape the section above has already used. */}
                <ol className="band-brand rounded-2xl list-none m-0 p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-5 md:gap-3">
                    {DOMAINS.map((d, i) => (
                        <Fragment key={d.k}>
                            {i > 0 && (
                                <li
                                    aria-hidden
                                    className="self-center shrink-0 text-[color:color-mix(in_srgb,var(--white)_55%,transparent)]"
                                >
                                    <Icon name="ChevronRight" size={22} className="rotate-90 md:rotate-0" />
                                </li>
                            )}
                            <li className="flex-1 min-w-0 flex flex-col gap-3">
                                <span className="on-band-chip inline-flex h-12 w-12 items-center justify-center rounded-xl">
                                    <Icon name={d.icon} size={24} />
                                </span>
                                <h3 className="m-0 text-[20px] leading-7 font-extrabold text-[var(--white)]">
                                    {t(`mk.domain.${d.k}.h`)}
                                </h3>
                                <p className="m-0 text-[16px] leading-6 font-medium on-band-sub max-w-[42ch]">
                                    {t(`mk.domain.${d.k}.p`)}
                                </p>
                            </li>
                        </Fragment>
                    ))}
                </ol>
            </Section>

            <Section id="status" eyebrow={t('mk.status.eyebrow')} title={t('mk.status.title')}>
                <div className={`${cardCls} p-6 md:p-8 flex flex-col gap-5 border-2 border-[color:var(--brand-gold)]`}>
                    <div className="flex flex-wrap items-center gap-3">
                        <DemoChip />
                        <span className="text-[18px] leading-7 font-extrabold">{t('mk.status.stage')}</span>
                    </div>
                    <ul className="flex flex-col gap-4 list-none m-0 p-0">
                        {(['model', 'simulated', 'assumed'] as Tag[]).map((g) => (
                            <li key={g} className="flex flex-wrap items-start gap-3">
                                <ClaimTag tag={g} />
                                <span className="flex-1 min-w-[240px] text-[17px] leading-7 font-medium text-[var(--ink)] max-w-[70ch]">
                                    {t(`mk.status.${g}`, { n: FARMS.length, ha })}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className={metaCls}>{t('mk.status.next')}</p>
                </div>
            </Section>

            <Section id="team" eyebrow={t('mk.team.eyebrow')} title={t('mk.team.title')}>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
                    {['team', 'school', 'tbi'].map((k) => (
                        <div key={k} className={`${cardCls} p-6`}>
                            <h3 className="m-0 text-[21px] leading-7 font-extrabold">{t(`mk.team.${k}.h`)}</h3>
                            <p className={`${bodyCls} mt-2`}>{t(`mk.team.${k}.p`)}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="faq" eyebrow={t('mk.faq.eyebrow')} title={t('mk.faq.title')}>
                <div className="flex flex-col gap-4">
                    {FAQ.map((k) => (
                        <details key={k} className={`${cardCls} p-6 group`}>
                            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 min-h-[44px] text-[19px] leading-7 font-extrabold">
                                {t(`mk.faq.${k}.q`)}
                                <Icon
                                    name="ChevronDown"
                                    size={24}
                                    className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                                />
                            </summary>
                            <p className={`${bodyCls} mt-3`}>{t(`mk.faq.${k}.a`)}</p>
                        </details>
                    ))}
                </div>
            </Section>
        </MarketingShell>
    );
}

const APPS = [
    {
        k: 'coordinator',
        icon: 'User',
        href: ACCOUNTS.coordinator.signIn,
        h: 'mk.role.coordinator.h',
        p: 'mk.launch.coordinator'
    },
    { k: 'buyer', icon: 'Store', href: ACCOUNTS.buyer.signIn, h: 'mk.role.buyer.h', p: 'mk.launch.buyer' },
    { k: 'driver', icon: 'Truck', href: ACCOUNTS.driver.signIn, h: 'mk.role.driver.h', p: 'mk.launch.driver' },
    { k: 'farmer', icon: 'Sms', href: ACCOUNTS.farmer.signIn, h: 'mk.role.farmer.h', p: 'mk.launch.farmer' },
    { k: 'admin', icon: 'Shield', href: ACCOUNTS.admin.signIn, h: 'login.admin.h', p: 'login.admin.p' }
];
/** /launch: the four apps, the 78 s demo and "Reset demo data" (clears the shared store in this browser, all tabs). */
export function LaunchPage() {
    const { t } = useI18n();
    const [done, setDone] = useState(false);
    return (
        <MarketingShell>
            <section aria-labelledby="launch-h" className="py-12 md:py-16 flex flex-col gap-7">
                {/* The same heading system as the home page: the label sits in the margin column and shares a
                    top edge with the title. (The old coloured rail bar here was a side-stripe accent, which
                    is a banned pattern, and it was the last one in the codebase.) */}
                <div className="grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,168px)_minmax(0,1fr)]">
                    <div className="eyebrow md:pt-px">{t('mk.launch.eyebrow')}</div>
                    <div className="min-w-0">
                        <h1
                            id="launch-h"
                            className="rc-display m-0 text-[32px] md:text-[38px] leading-[1.12] font-extrabold tracking-[-0.03em] max-w-[26ch] text-balance"
                        >
                            {t('mk.launch.title')}
                        </h1>
                        <p className="mt-3 m-0 text-[17px] leading-7 font-medium text-[var(--ink)] max-w-[70ch]">
                            {t('mk.launch.sub')}
                        </p>
                    </div>
                </div>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
                    {APPS.map((a) => (
                        <ZLink key={a.k} href={a.href} className={`${cardCls} p-6 flex flex-col gap-3`}>
                            <span className="icon-box !h-14 !w-14">
                                <Icon name={a.icon} size={26} />
                            </span>
                            <span className="text-[21px] leading-7 font-extrabold">{t(a.h)}</span>
                            <span className="text-[17px] leading-7 font-medium text-[var(--ink)]">{t(a.p)}</span>
                            <span className="mt-auto inline-flex items-center gap-1.5 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.05em] text-[var(--text-accent)]">
                                {t('mk.try')}
                                <Icon name="ArrowRight" size={20} />
                            </span>
                        </ZLink>
                    ))}
                </div>
                <div className={`${cardCls} p-6 flex flex-wrap items-center justify-between gap-5`}>
                    <div className="min-w-0 flex-1">
                        <h2 className="m-0 text-[21px] leading-7 font-extrabold">{t('mk.launch.demo.h')}</h2>
                        <p className="mt-2 m-0 text-[17px] leading-7 font-medium text-[var(--ink)] max-w-[70ch]">
                            {t('mk.launch.demo.p')}
                        </p>
                    </div>
                    <ZLink href="/demo" className="btn-2026">
                        <Icon name="Play" size={20} />
                        <span>{t('mk.launch.demo.cta')}</span>
                    </ZLink>
                </div>
                <div className={`${cardCls} p-6 flex flex-wrap items-center justify-between gap-5`}>
                    <div className="min-w-0 flex-1">
                        <h2 className="m-0 text-[21px] leading-7 font-extrabold">{t('mk.reset.h')}</h2>
                        <p className="mt-2 m-0 text-[17px] leading-7 font-medium text-[var(--ink)] max-w-[70ch]">
                            {t('mk.reset.p')}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <SecondaryButton
                            icon="Retry"
                            onClick={() => {
                                resetDemoState();
                                setDone(true);
                            }}
                        >
                            {t('mk.reset.cta')}
                        </SecondaryButton>
                        {done && (
                            <p
                                role="status"
                                className="m-0 text-[16px] font-extrabold text-[var(--success-ink)] flex items-center gap-1.5"
                            >
                                <Icon name="CircleCheck" size={20} />
                                {t('mk.reset.done')}
                            </p>
                        )}
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
    return (
        <ZLink
            href="/"
            className="self-start inline-flex items-center gap-2 min-h-[44px] text-[15px] font-extrabold uppercase tracking-[0.05em] text-[var(--text-accent)]"
        >
            <Icon name="ChevronLeft" size={20} />
            {t('mk.back')}
        </ZLink>
    );
}
