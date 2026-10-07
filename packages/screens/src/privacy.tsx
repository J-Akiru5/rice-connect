'use client';
import { ApplicationLogo, DemoChip, Icon, LanguageSwitcher, TeamFooter, ThemeToggle, ZLink, useI18n } from '@rc/ui';
import { PRIVACY_SECTIONS, PRIVACY_VERSION } from '@rc/domain/privacy';

/* /privacy — the public Data Privacy Act notice (Phase 4). Every route footer links here; the version shown
   is the one stored with a consent record at sign-up. Reachable without signing in, in demo and live mode. */
export function PrivacyScreen() {
    const { t } = useI18n();
    return (
        <div className="rc-ground min-h-screen flex flex-col">
            <header className="px-4 md:px-8 py-3 flex items-center gap-3 flex-wrap">
                <ZLink href="/" aria-label="RiceConnect" className="rounded-xl shrink-0">
                    <ApplicationLogo height={36} />
                </ZLink>
                <div className="flex-1" />
                <DemoChip />
                <LanguageSwitcher />
                <ThemeToggle iconSize={20} />
            </header>
            <main className="flex-1 px-4 md:px-8 pb-10">
                <article className="mx-auto w-full max-w-[760px] flex flex-col gap-5">
                    <p className="eyebrow m-0">{t('privacy.eyebrow')}</p>
                    <h1 className="m-0 text-[30px] md:text-[36px] leading-tight font-extrabold tracking-[-0.03em]">
                        {t('privacy.title')}
                    </h1>
                    <p className="m-0 text-[14px] leading-5 font-bold text-[var(--text-secondary)] tabular">
                        {t('privacy.version', { version: PRIVACY_VERSION })}
                    </p>
                    <p className="m-0 text-[16px] leading-7 font-medium">{t('privacy.intro')}</p>
                    {PRIVACY_SECTIONS.map((s) => (
                        <section key={s} aria-labelledby={`privacy-${s}`} className="glass-panel rounded-[1.5rem] p-5">
                            <h2 id={`privacy-${s}`} className="eyebrow m-0">
                                {t(`privacy.${s}.title`)}
                            </h2>
                            <p className="mt-2 m-0 text-[16px] leading-7 font-medium">{t(`privacy.${s}.body`)}</p>
                        </section>
                    ))}
                    <ZLink
                        href="/"
                        className="self-start inline-flex items-center gap-1 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                    >
                        <Icon name="ChevronLeft" size={20} />
                        {t('privacy.back')}
                    </ZLink>
                </article>
            </main>
            <TeamFooter className="text-center" />
        </div>
    );
}
